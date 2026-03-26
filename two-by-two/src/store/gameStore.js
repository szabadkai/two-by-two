import { create } from 'zustand'
import { INITIAL_STATS, TOTAL_WEEKS, DAY_NAMES, WEEKS_PER_TRANSFER, MONTHLY_STIPEND } from '../data/constants'
import { getStartingCompanion } from '../data/companions'
import { STARTING_INVESTIGATORS } from '../data/investigators'
import { resolveDay } from '../engine/resolveDay'
import { resolveEvent as resolveEventEngine } from '../engine/resolveEvent'
import { advanceInvestigator, weeklyInvestigatorDecay, resolveObjection } from '../engine/investigatorEngine'
import { checkNewInvestigator, resetNamePool } from '../engine/investigatorGenerator'
import { getCompanionQuote, clampRapport } from '../engine/companionEngine'
import {
  checkCompanionReport,
  checkBudgetDebt,
  checkSentHome,
  applyWeeklyExpenses,
  applyLanguageDecay,
  rollMandatoryActivity,
} from '../engine/consequenceEngine'
import { isTransferWeek } from '../engine/transferEngine'
import { exportSave, importSave, saveToLocalStorage, loadFromLocalStorage } from '../utils/saveLoad'

const createInitialState = () => ({
  screen: 'title',

  // Time
  day: 0,
  week: 1,
  transfer: 1,

  // Stats
  stats: { ...INITIAL_STATS },

  // Companion
  companion: getStartingCompanion(),

  // Investigators
  investigators: STARTING_INVESTIGATORS.map((i) => ({ ...i })),

  // Schedule
  schedule: { morning: null, afternoon: null, evening: null },
  minigameScores: { morning: null, afternoon: null, evening: null },

  // Events
  pendingEvent: null,
  pendingObjection: null,
  eventLog: [],

  // Scoring
  baptisms: 0,
  totalConnections: 0,

  // Flags
  laundryWeeksSkipped: 0,
  catAdopted: false,

  // Consequences
  warnings: 0,
  debtWeeks: 0,
  weekHadLanguageActivity: false,
  sentHome: false,
  crisisWeeksRemaining: 0,

  // Leadership & transfers
  leadership: 'missionary',
  companionHistory: [],

  // Mandatory activity for today
  mandatoryActivity: null,

  // Visit investigator targeting
  visitTarget: null,

  // Day resolution results (for UI animation)
  lastDayResult: null,

  // Weekly log for summary
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

  startMTC: () => set({ screen: 'mtc' }),

  startGame: () => {
    resetNamePool()
    const initial = createInitialState()
    set({
      ...initial,
      screen: 'game',
      weekLog: {
        startStats: { ...INITIAL_STATS },
        startRapport: 5,
        events: [],
        investigatorChanges: [],
        notifications: [],
      },
    })
    // Roll mandatory activity for first day
    const mandatoryActivity = rollMandatoryActivity(initial)
    if (mandatoryActivity) {
      set({ mandatoryActivity })
    }
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

    // If in crisis, skip this day
    if (state.crisisWeeksRemaining > 0) {
      get().advanceDay()
      return
    }

    const result = resolveDay(state, isPDay)

    // Track language activities
    let weekHadLanguage = state.weekHadLanguageActivity
    if (result.languageActivityDone) {
      weekHadLanguage = true
    }

    // Handle special results
    let investigators = [...state.investigators]
    let baptisms = state.baptisms
    const investigatorChanges = []

    let pendingObjection = null

    // Check if any scheduled activity was visit_investigator
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
          if (advancement.result === 'baptized') {
            baptisms += 1
          }
          // Check for objection
          if (advancement.objection) {
            pendingObjection = {
              ...advancement.objection,
              investigator: advancement.investigator,
            }
          }
        } else {
          investigatorChanges.push(advancement.text)
        }
      }
      if (special === 'englishClassContact') {
        // Boost warmth for any active english-source investigator
        const englishInv = investigators.find((i) => i.isActive && i.personality === 'English Student')
        if (englishInv && Math.random() < 0.3) {
          investigators = investigators.map((inv) =>
            inv.id === englishInv.id
              ? { ...inv, warmth: Math.min(10, inv.warmth + 1) }
              : inv
          )
          investigatorChanges.push(`${englishInv.name} seemed more engaged in English class today.`)
        }
      }
      if (special === 'resetLaundry') {
        set({ laundryWeeksSkipped: 0 })
      }
    }

    // Check for new investigators from activities
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
        mandatoryActivity: state.mandatoryActivity,
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

    // Advance day (if no event or objection pending, otherwise wait for resolution)
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
        {
          week: s.week,
          day: s.day,
          event: s.pendingEvent.title,
          outcome: result.outcome,
          text: result.text,
        },
      ],
      lastDayResult: {
        ...s.lastDayResult,
        eventResult: result,
      },
      // Apply flags
      ...(result.flags.catAdopted !== undefined ? { catAdopted: result.flags.catAdopted } : {}),
    }))

    // Now advance the day (check for pending objection first)
    if (get().pendingObjection) {
      // Don't advance yet — wait for objection resolution
    } else {
      get().advanceDay()
    }
  },

  resolveObjectionChoice: (effect) => {
    const state = get()
    if (!state.pendingObjection) return

    const { investigator: inv } = state.pendingObjection
    const resolved = resolveObjection(inv, effect)

    set((s) => ({
      investigators: s.investigators.map(i =>
        i.id === resolved.id ? resolved : i
      ),
      pendingObjection: null,
      weekLog: {
        ...s.weekLog,
        investigatorChanges: [
          ...s.weekLog.investigatorChanges,
          effect.advance
            ? `${inv.name} resolved their concern about ${state.pendingObjection.trigger}.`
            : `${inv.name} struggled with ${state.pendingObjection.trigger}. They stepped back.`,
        ],
      },
    }))

    // Now advance the day
    get().advanceDay()
  },

  advanceDay: () => {
    const state = get()
    const nextDay = state.day + 1

    if (nextDay === 6) {
      // Next is P-Day — roll mandatory activity for P-Day
      const mandatoryActivity = rollMandatoryActivity(state)
      set({ day: 6, screen: 'pday', mandatoryActivity })
    } else if (nextDay > 6) {
      // Week is over, show summary
      set({ screen: 'summary' })
    } else {
      // Roll mandatory activity for next day
      const mandatoryActivity = rollMandatoryActivity(state)
      set({ day: nextDay, mandatoryActivity })
    }
    setTimeout(() => get().autoSave(), 0)
  },

  endWeek: () => {
    const state = get()
    const notifications = []

    // --- Weekly Consequences ---

    // 1. Investigator decay (aggressive: -2 warmth per week)
    const { investigators: decayedInvestigators, notifications: invNotifications } =
      weeklyInvestigatorDecay(state.investigators)
    notifications.push(...invNotifications)

    // 2. Laundry check
    let laundryWeeksSkipped = state.laundryWeeksSkipped + 1
    if (laundryWeeksSkipped >= 2) {
      notifications.push('You haven\'t done laundry in weeks. Your companion has noticed.')
    }

    // 3. Language decay (if no language activity this week)
    let newLanguage = state.stats.language
    if (!state.weekHadLanguageActivity) {
      newLanguage = applyLanguageDecay(state.stats.language, false)
      if (newLanguage < state.stats.language) {
        notifications.push('Your Hungarian is getting rusty. You didn\'t study this week.')
      }
    }

    // 4. Weekly expenses (food + transit)
    const { newBudget, expense } = applyWeeklyExpenses(state.stats.budget)
    notifications.push(`Weekly expenses: -${expense.toLocaleString()} Ft (food & transit)`)

    // 5. Budget debt check
    let { warnings } = state
    let debtWeeks = state.debtWeeks
    if (newBudget < 0) {
      debtWeeks += 1
      const debtResult = checkBudgetDebt({ ...state.stats, budget: newBudget }, debtWeeks)
      if (debtResult) {
        notifications.push(debtResult.text)
        if (debtResult.warning) {
          warnings += 1
          notifications.push(`WARNING ${warnings}/${3}: Budget debt reported to mission office.`)
        }
      }
    } else {
      debtWeeks = 0
    }

    // 6. Companion report check
    const reportResult = checkCompanionReport(state.stats, state.companion)
    if (reportResult) {
      warnings += 1
      notifications.push(reportResult.text)
      notifications.push(`WARNING ${warnings}/${3}: Official report filed.`)
    }

    // 7. Monthly stipend (every 4 weeks)
    let stipendBudget = newBudget
    if (state.week % 4 === 0) {
      stipendBudget += MONTHLY_STIPEND
      notifications.push(`Monthly stipend received: +${MONTHLY_STIPEND.toLocaleString()} Ft`)
    }

    // 8. Check if sent home
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
      stats: {
        ...state.stats,
        language: newLanguage,
        budget: stipendBudget,
      },
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

    // Check if this is a transfer week
    if (isTransferWeek(state.week)) {
      set({
        ...updatedState,
        screen: 'transfer',
      })
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

    // Apply interview stat effects
    const newStats = { ...state.stats }
    for (const [stat, delta] of Object.entries(interviewEffects || {})) {
      if (newStats[stat] !== undefined) {
        newStats[stat] = Math.max(0, Math.min(100, newStats[stat] + delta))
      }
    }

    // Update leadership if promoted
    const leadership = promotion || state.leadership

    // Add old companion to history
    const companionHistory = [...(state.companionHistory || []), state.companion.id]

    set({
      companion: { ...newCompanion, rapport: newCompanion.initialRapport },
      stats: newStats,
      leadership,
      companionHistory,
      transfer: (state.transfer || 1) + 1,
      screen: 'game',
      mandatoryActivity: rollMandatoryActivity(state),
    })

    setTimeout(() => get().autoSave(), 0)
  },

  saveGame: () => {
    const state = get()
    const json = exportSave(state)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `two-by-two-week-${state.week}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  loadGame: (jsonString) => {
    const loaded = importSave(jsonString)
    set({ ...loaded, screen: 'game' })
  },

  autoSave: () => {
    const state = get()
    if (state.screen !== 'title') {
      saveToLocalStorage(state)
    }
  },

  loadAutoSave: () => {
    const loaded = loadFromLocalStorage()
    if (loaded) {
      set({ ...loaded, screen: 'game' })
    }
  },

  goToScreen: (screen) => set({ screen }),

  // Selectors
  get isPDay() { return get().day === 6 },
  get currentDayName() { return DAY_NAMES[get().day] || 'Unknown' },
  get companionQuote() { return getCompanionQuote(get().companion) },
}))