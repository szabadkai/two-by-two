import { create } from 'zustand'
import { INITIAL_STATS, TOTAL_WEEKS, WEEKS_PER_TRANSFER, MONTHLY_STIPEND } from '../data/constants'
import { getStartingCompanion } from '../data/companions'
import { STARTING_INVESTIGATORS } from '../data/investigators'
import { resolveDay } from '../engine/resolveDay'
import { resolveEvent as resolveEventEngine } from '../engine/resolveEvent'
import { advanceInvestigator, weeklyInvestigatorDecay, resolveObjection } from '../engine/investigatorEngine'
import { checkNewInvestigator, resetNamePool } from '../engine/investigatorGenerator'
import { clampRapport } from '../engine/companionEngine'
import {
  checkCompanionReport,
  checkBudgetDebt,
  checkSentHome,
  applyWeeklyExpenses,
  applyLanguageDecay,
  rollMandatoryActivity,
} from '../engine/consequenceEngine'
import { isTransferWeek } from '../engine/transferEngine'
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/saveLoad'
import { MAPS, STARTING_MAP } from '../data/maps'

const createInitialState = () => ({
  screen: 'title',
  day: 0,
  week: 1,
  transfer: 1,
  stats: { ...INITIAL_STATS },
  companion: getStartingCompanion(),
  investigators: STARTING_INVESTIGATORS.map((i) => ({ ...i })),
  schedule: { morning: null, afternoon: null, evening: null },
  minigameScores: { morning: null, afternoon: null, evening: null },
  mapId: STARTING_MAP,
  pendingEvent: null,
  pendingObjection: null,
  eventLog: [],
  baptisms: 0,
  totalConnections: 0,
  laundryWeeksSkipped: 0,
  catAdopted: false,
  warnings: 0,
  debtWeeks: 0,
  weekHadLanguageActivity: false,
  sentHome: false,
  crisisWeeksRemaining: 0,
  leadership: 'missionary',
  companionHistory: [],
  mandatoryActivity: null,
  visitTarget: null,
  lastDayResult: null,
  toasts: [],
  activeMinigame: null, // { slot, activityId } when a minigame is in progress
  weekLog: {
    startStats: { ...INITIAL_STATS },
    startRapport: 5,
    events: [],
    investigatorChanges: [],
    notifications: [],
  },
})

export const useGameStore = create((set, get) => ({
  ...createInitialState(),

  _toastId: 0,

  addToast: (text, type = 'info') => {
    const id = ++get()._toastId
    set((s) => ({ toasts: [...s.toasts, { id, text, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3000)
  },

  startMTC: () => set({ screen: 'mtc' }),

  startGame: () => {
    resetNamePool()
    const initial = createInitialState()
    const mandatoryActivity = rollMandatoryActivity(initial)
    set({
      ...initial,
      screen: 'game',
      mandatoryActivity,
      weekLog: {
        startStats: { ...INITIAL_STATS },
        startRapport: 5,
        events: [],
        investigatorChanges: [],
        notifications: [],
      },
    })
    setTimeout(() => get().autoSave(), 0)
  },

  setActivity: (slot, activityId) => {
    set((s) => ({
      schedule: { ...s.schedule, [slot]: activityId },
    }))
  },

  setMinigameScore: (slot, score) => {
    set((s) => ({
      minigameScores: { ...s.minigameScores, [slot]: score },
    }))
  },

  setVisitTarget: (id) => set({ visitTarget: id }),

  acceptMandatory: () => {
    set((s) => ({
      mandatoryActivity: s.mandatoryActivity
        ? { ...s.mandatoryActivity, refused: false, accepted: true }
        : null,
    }))
  },

  refuseMandatory: () => {
    set((s) => ({
      mandatoryActivity: s.mandatoryActivity
        ? { ...s.mandatoryActivity, refused: true, accepted: false }
        : null,
    }))
  },

  endDay: () => {
    const state = get()
    const isPDay = state.day === 6

    if (state.crisisWeeksRemaining > 0) {
      get().advanceDay()
      return
    }

    const result = resolveDay(state, isPDay)

    let weekHadLanguage = state.weekHadLanguageActivity
    if (result.languageActivityDone) weekHadLanguage = true

    let investigators = [...state.investigators]
    let baptisms = state.baptisms
    const investigatorChanges = []
    let pendingObjection = null

    const hasVisitInvestigator = Object.values(state.schedule).some(
      (a) => a === 'visit_investigator'
    )

    for (const special of result.specialResults) {
      if (special === 'advanceInvestigator') {
        const targetId = hasVisitInvestigator ? state.visitTarget : null
        const advancement = advanceInvestigator({ ...state, stats: result.newStats }, targetId)
        if (advancement.investigator) {
          investigators = investigators.map((inv) =>
            inv.id === advancement.investigator.id ? advancement.investigator : inv
          )
          investigatorChanges.push(advancement.text)
          if (advancement.result === 'baptized') baptisms += 1
          if (advancement.objection) {
            pendingObjection = { ...advancement.objection, investigator: advancement.investigator }
          }
        } else {
          investigatorChanges.push(advancement.text)
        }
      }
      if (special === 'englishClassContact') {
        const englishInv = investigators.find((i) => i.isActive && i.personality === 'English Student')
        if (englishInv && Math.random() < 0.3) {
          investigators = investigators.map((inv) =>
            inv.id === englishInv.id ? { ...inv, warmth: Math.min(10, inv.warmth + 1) } : inv
          )
          investigatorChanges.push(`${englishInv.name} seemed more engaged in English class today.`)
        }
      }
      if (special === 'resetLaundry') set({ laundryWeeksSkipped: 0 })
    }

    for (const slot of ['morning', 'afternoon', 'evening']) {
      const activityId = state.schedule[slot]
      if (!activityId) continue
      const newInvestigator = checkNewInvestigator(activityId, investigators, result.newStats)
      if (newInvestigator) {
        investigators = [...investigators, newInvestigator]
        investigatorChanges.push(`New contact: ${newInvestigator.name} (${newInvestigator.personality})`)
      }
    }

    const newRapport = clampRapport(result.newRapport)

    set((s) => ({
      stats: result.newStats,
      companion: { ...s.companion, rapport: newRapport },
      investigators,
      baptisms,
      weekHadLanguageActivity: weekHadLanguage,
      lastDayResult: {
        statDeltas: result.statDeltas,
        rapportDelta: result.rapportDelta,
        specialResults: result.specialResults,
        investigatorChanges,
      },
      pendingEvent: result.triggeredEvent,
      pendingObjection,
      schedule: { morning: null, afternoon: null, evening: null },
      minigameScores: { morning: null, afternoon: null, evening: null },
      mandatoryActivity: null,
      visitTarget: null,
      weekLog: {
        ...s.weekLog,
        events: result.triggeredEvent
          ? [...s.weekLog.events, result.triggeredEvent.title]
          : s.weekLog.events,
        investigatorChanges: [...s.weekLog.investigatorChanges, ...investigatorChanges],
      },
    }))

    // Show toasts for investigator changes
    for (const change of investigatorChanges) {
      get().addToast(change, change.includes('baptized') ? 'good' : 'info')
    }

    if (!result.triggeredEvent && !pendingObjection) {
      get().advanceDay()
    }

    setTimeout(() => get().autoSave(), 0)
  },

  resolveEventChoice: (choiceIndex) => {
    const state = get()
    if (!state.pendingEvent) return

    const result = resolveEventEngine(state, state.pendingEvent, choiceIndex)
    if (!result) return

    const newRapport = clampRapport(state.companion.rapport + result.rapportDelta)

    set((s) => ({
      stats: result.newStats,
      companion: { ...s.companion, rapport: newRapport },
      pendingEvent: null,
      eventLog: [
        ...s.eventLog,
        { week: s.week, day: s.day, event: s.pendingEvent.title, outcome: result.outcome, text: result.text },
      ],
      lastDayResult: { ...s.lastDayResult, eventResult: result },
      ...(result.flags.catAdopted !== undefined ? { catAdopted: result.flags.catAdopted } : {}),
    }))

    get().addToast(result.text, result.outcome === 'good' ? 'good' : 'bad')

    if (!get().pendingObjection) get().advanceDay()
  },

  resolveObjectionChoice: (effect) => {
    const state = get()
    if (!state.pendingObjection) return

    const { investigator: inv } = state.pendingObjection
    const resolved = resolveObjection(inv, effect)

    set((s) => ({
      investigators: s.investigators.map((i) => (i.id === resolved.id ? resolved : i)),
      pendingObjection: null,
      weekLog: {
        ...s.weekLog,
        investigatorChanges: [
          ...s.weekLog.investigatorChanges,
          effect.advance
            ? `${inv.name} resolved their concern.`
            : `${inv.name} struggled and stepped back.`,
        ],
      },
    }))

    get().advanceDay()
  },

  advanceDay: () => {
    const state = get()
    const nextDay = state.day + 1

    if (nextDay === 6) {
      const mandatoryActivity = rollMandatoryActivity(state)
      set({ day: 6, screen: 'pday', mandatoryActivity, mapId: STARTING_MAP })
    } else if (nextDay > 6) {
      set({ screen: 'summary' })
    } else {
      const mandatoryActivity = rollMandatoryActivity(state)
      set({ day: nextDay, mandatoryActivity, mapId: STARTING_MAP })
    }
    setTimeout(() => get().autoSave(), 0)
  },

  endWeek: () => {
    const state = get()
    const notifications = []

    const { investigators: decayedInvestigators, notifications: invNotifications } =
      weeklyInvestigatorDecay(state.investigators)
    notifications.push(...invNotifications)

    let laundryWeeksSkipped = state.laundryWeeksSkipped + 1
    if (laundryWeeksSkipped >= 2) {
      notifications.push("You haven't done laundry in weeks.")
    }

    let newLanguage = state.stats.language
    if (!state.weekHadLanguageActivity) {
      newLanguage = applyLanguageDecay(state.stats.language, false)
      if (newLanguage < state.stats.language) {
        notifications.push('Your Hungarian is getting rusty.')
      }
    }

    const { newBudget, expense } = applyWeeklyExpenses(state.stats.budget)
    notifications.push(`Weekly expenses: -${expense.toLocaleString()} Ft`)

    let { warnings } = state
    let debtWeeks = state.debtWeeks
    if (newBudget < 0) {
      debtWeeks += 1
      const debtResult = checkBudgetDebt({ ...state.stats, budget: newBudget }, debtWeeks)
      if (debtResult) {
        notifications.push(debtResult.text)
        if (debtResult.warning) {
          warnings += 1
          notifications.push(`WARNING ${warnings}/3`)
        }
      }
    } else {
      debtWeeks = 0
    }

    const reportResult = checkCompanionReport(state.stats, state.companion)
    if (reportResult) {
      warnings += 1
      notifications.push(reportResult.text)
      notifications.push(`WARNING ${warnings}/3`)
    }

    let stipendBudget = newBudget
    if (state.week % 4 === 0) {
      stipendBudget += MONTHLY_STIPEND
      notifications.push(`Stipend: +${MONTHLY_STIPEND.toLocaleString()} Ft`)
    }

    if (checkSentHome(warnings)) {
      set({
        screen: 'sent_home',
        warnings,
        stats: { ...state.stats, language: newLanguage, budget: stipendBudget },
      })
      return
    }

    const nextWeek = state.week + 1
    if (nextWeek > TOTAL_WEEKS) {
      set({ screen: 'endgame' })
      return
    }

    const updatedState = {
      day: 0,
      week: nextWeek,
      investigators: decayedInvestigators,
      laundryWeeksSkipped,
      warnings,
      debtWeeks,
      weekHadLanguageActivity: false,
      stats: { ...state.stats, language: newLanguage, budget: stipendBudget },
      schedule: { morning: null, afternoon: null, evening: null },
      minigameScores: { morning: null, afternoon: null, evening: null },
      lastDayResult: null,
      weekLog: {
        startStats: { ...state.stats },
        startRapport: state.companion.rapport,
        events: [],
        investigatorChanges: [],
        notifications,
      },
    }

    if (isTransferWeek(state.week)) {
      set({ ...updatedState, screen: 'transfer' })
    } else {
      set({
        ...updatedState,
        screen: 'game',
        mandatoryActivity: rollMandatoryActivity(state),
      })
    }

    setTimeout(() => get().autoSave(), 0)
  },

  completeTransfer: ({ newCompanion, interviewEffects, promotion }) => {
    const state = get()
    const newStats = { ...state.stats }
    for (const [stat, delta] of Object.entries(interviewEffects || {})) {
      if (newStats[stat] !== undefined) {
        newStats[stat] = Math.max(0, Math.min(100, newStats[stat] + delta))
      }
    }

    set({
      companion: { ...newCompanion, rapport: newCompanion.initialRapport },
      stats: newStats,
      leadership: promotion || state.leadership,
      companionHistory: [...(state.companionHistory || []), state.companion.id],
      transfer: (state.transfer || 1) + 1,
      screen: 'game',
      mandatoryActivity: rollMandatoryActivity(state),
    })

    setTimeout(() => get().autoSave(), 0)
  },

  autoSave: () => {
    const state = get()
    if (state.screen !== 'title') saveToLocalStorage(state)
  },

  loadAutoSave: () => {
    const loaded = loadFromLocalStorage()
    if (loaded) set({ ...loaded, screen: 'game' })
  },

  // Minigame flow
  launchMinigame: (slot, activityId) => {
    set({ activeMinigame: { slot, activityId } })
  },

  completeMinigame: (score) => {
    const { activeMinigame } = get()
    if (!activeMinigame) return
    get().setMinigameScore(activeMinigame.slot, score)
    set({ activeMinigame: null })
  },

  cancelMinigame: () => {
    const { activeMinigame } = get()
    if (!activeMinigame) return
    // Cancelled = mediocre score
    get().setMinigameScore(activeMinigame.slot, 0.4)
    set({ activeMinigame: null })
  },

  // Free study — gives ×0.5 stat effect, no slot consumed
  applyFreeStudy: (stat, score) => {
    const multiplier = 0.5
    const delta = Math.round(score * 6 * multiplier) // max ~3 per free study
    if (delta <= 0) return
    set((s) => ({
      stats: {
        ...s.stats,
        [stat]: Math.min(100, Math.max(0, s.stats[stat] + delta)),
      },
    }))
  },

  enterMap: (mapId) => {
    const mapDef = MAPS[mapId]
    if (!mapDef) return
    set({ mapId })
  },

  resetMapToApartment: () => {
    set({ mapId: STARTING_MAP })
  },

  goToScreen: (screen) => set({ screen }),
}))
