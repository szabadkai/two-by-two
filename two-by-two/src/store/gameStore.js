import { create } from 'zustand'
import { INITIAL_STATS, TOTAL_WEEKS, DAY_NAMES } from '../data/constants'
import { getStartingCompanion } from '../data/companions'
import { STARTING_INVESTIGATORS } from '../data/investigators'
import { resolveDay } from '../engine/resolveDay'
import { resolveEvent as resolveEventEngine } from '../engine/resolveEvent'
import { advanceInvestigator, weeklyInvestigatorDecay } from '../engine/investigatorEngine'
import { getCompanionQuote, clampRapport } from '../engine/companionEngine'

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

  // Events
  pendingEvent: null,
  eventLog: [],

  // Scoring
  baptisms: 0,
  totalConnections: 0,

  // Flags
  laundryWeeksSkipped: 0,
  catAdopted: false,

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

  startGame: () => {
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
  },

  setActivity: (slot, activityId) => {
    set((s) => ({
      schedule: { ...s.schedule, [slot]: activityId },
    }))
  },

  endDay: () => {
    const state = get()
    const isPDay = state.day === 6

    const result = resolveDay(state, isPDay)

    // Handle special results
    let investigators = [...state.investigators]
    let baptisms = state.baptisms
    const investigatorChanges = []

    for (const special of result.specialResults) {
      if (special === 'advanceInvestigator') {
        const advancement = advanceInvestigator({ ...state, stats: result.newStats })
        if (advancement.investigator) {
          investigators = investigators.map((inv) =>
            inv.id === advancement.investigator.id ? advancement.investigator : inv
          )
          investigatorChanges.push(advancement.text)
          if (advancement.result === 'baptized') {
            baptisms += 1
          }
        } else {
          investigatorChanges.push(advancement.text)
        }
      }
      if (special === 'englishClassContact') {
        // Small chance of warming up Kiss Ági specifically
        const agi = investigators.find((i) => i.id === 'kiss_agi' && i.isActive)
        if (agi && Math.random() < 0.3) {
          investigators = investigators.map((inv) =>
            inv.id === 'kiss_agi'
              ? { ...inv, warmth: Math.min(10, inv.warmth + 1) }
              : inv
          )
          investigatorChanges.push('Kiss Ági seemed more engaged in English class today.')
        }
      }
      if (special === 'resetLaundry') {
        set({ laundryWeeksSkipped: 0 })
      }
    }

    const newRapport = clampRapport(result.newRapport)

    set((s) => ({
      stats: result.newStats,
      companion: { ...s.companion, rapport: newRapport },
      investigators,
      baptisms,
      lastDayResult: {
        statDeltas: result.statDeltas,
        rapportDelta: result.rapportDelta,
        specialResults: result.specialResults,
        investigatorChanges,
      },
      pendingEvent: result.triggeredEvent,
      schedule: { morning: null, afternoon: null, evening: null },
      weekLog: {
        ...s.weekLog,
        events: result.triggeredEvent
          ? [...s.weekLog.events, result.triggeredEvent.title]
          : s.weekLog.events,
        investigatorChanges: [...s.weekLog.investigatorChanges, ...investigatorChanges],
      },
    }))

    // Advance day (if no event pending, otherwise wait for event resolution)
    if (!result.triggeredEvent) {
      get().advanceDay()
    }
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

    // Now advance the day
    get().advanceDay()
  },

  advanceDay: () => {
    const state = get()
    const nextDay = state.day + 1

    if (nextDay === 6) {
      // Next is P-Day
      set({ day: 6, screen: 'pday' })
    } else if (nextDay > 6) {
      // Week is over, show summary
      set({ screen: 'summary' })
    } else {
      set({ day: nextDay })
    }
  },

  endWeek: () => {
    const state = get()

    // Weekly investigator decay
    const { investigators: decayedInvestigators, notifications } =
      weeklyInvestigatorDecay(state.investigators)

    // Laundry check
    let laundryWeeksSkipped = state.laundryWeeksSkipped + 1
    const laundryNotifications = []
    if (laundryWeeksSkipped >= 2) {
      laundryNotifications.push('You haven\'t done laundry in weeks. Your companion has noticed.')
    }

    const nextWeek = state.week + 1

    if (nextWeek > TOTAL_WEEKS) {
      // Game over — for now just go back to title
      set({ screen: 'title' })
      return
    }

    set({
      day: 0,
      week: nextWeek,
      investigators: decayedInvestigators,
      laundryWeeksSkipped,
      screen: 'game',
      schedule: { morning: null, afternoon: null, evening: null },
      lastDayResult: null,
      weekLog: {
        startStats: { ...state.stats },
        startRapport: state.companion.rapport,
        events: [],
        investigatorChanges: [],
        notifications: [...notifications, ...laundryNotifications],
      },
    })
  },

  goToScreen: (screen) => set({ screen }),

  // Selectors
  get isPDay() { return get().day === 6 },
  get currentDayName() { return DAY_NAMES[get().day] || 'Unknown' },
  get companionQuote() { return getCompanionQuote(get().companion) },
}))
