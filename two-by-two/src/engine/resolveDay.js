import { ACTIVITIES, PDAY_ACTIVITIES } from '../data/activities'
import { EVENTS } from '../data/events'
import {
  STAT_CAPS,
  EVENT_CHANCE,
  TRUNKY_THRESHOLD,
  TRUNKY_MULTIPLIER,
  ON_FIRE_THRESHOLD,
  ON_FIRE_MULTIPLIER,
  RAPPORT_EFFECT_SCALE,
} from '../data/constants'

export function rollInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function clampStat(name, value) {
  const cap = STAT_CAPS[name]
  if (!cap) return value
  return Math.max(cap.min, Math.min(cap.max, value))
}

export function resolveDay(state, isPDay = false) {
  const activityPool = isPDay ? PDAY_ACTIVITIES : ACTIVITIES
  const { schedule, stats, companion } = state
  const statDeltas = {}
  let rapportDelta = 0
  const specialResults = []

  // Process each time slot
  for (const slot of ['morning', 'afternoon', 'evening']) {
    const activityId = schedule[slot]
    if (!activityId) continue

    const activity = activityPool[activityId]
    if (!activity) continue

    // Roll each stat effect
    for (const [stat, [min, max]] of Object.entries(activity.effects)) {
      let delta = rollInRange(min, max)

      // Apply rapport multiplier to positive effects
      if (delta > 0 && companion.rapport !== undefined) {
        const rapportMod = companion.rapport > 5
          ? 1 + (companion.rapport - 5) * RAPPORT_EFFECT_SCALE * 0.5
          : companion.rapport < 5
            ? 1 - (5 - companion.rapport) * RAPPORT_EFFECT_SCALE * 0.5
            : 1
        delta = Math.round(delta * rapportMod)
      }

      // Apply trunky penalty
      if (delta > 0 && stats.spirit < TRUNKY_THRESHOLD) {
        delta = Math.round(delta * TRUNKY_MULTIPLIER)
      }

      // Apply on-fire bonus
      if (delta > 0 && stats.spirit > ON_FIRE_THRESHOLD) {
        delta = Math.round(delta * ON_FIRE_MULTIPLIER)
      }

      statDeltas[stat] = (statDeltas[stat] || 0) + delta
    }

    // Handle rapport effects
    if (activity.rapportEffect) {
      const [rMin, rMax] = activity.rapportEffect
      rapportDelta += rollInRange(rMin, rMax)
    }

    // Track special effects
    if (activity.special) {
      specialResults.push(activity.special)
    }
  }

  // Daily spirit drain (homesickness, fatigue)
  if (!isPDay) {
    statDeltas.spirit = (statDeltas.spirit || 0) - 1
  }

  // Calculate new stats
  const newStats = { ...stats }
  for (const [stat, delta] of Object.entries(statDeltas)) {
    newStats[stat] = clampStat(stat, stats[stat] + delta)
  }

  // Calculate new rapport
  const newRapport = Math.max(0, Math.min(10, companion.rapport + rapportDelta))

  // Check for random event
  let triggeredEvent = null
  if (Math.random() < EVENT_CHANCE) {
    triggeredEvent = selectEvent(state)
  }

  return {
    statDeltas,
    rapportDelta,
    newStats,
    newRapport,
    triggeredEvent,
    specialResults,
  }
}

export function selectEvent(state) {
  const eligible = EVENTS.filter(
    (e) => !e.condition || e.condition(state)
  )
  if (eligible.length === 0) return null
  return eligible[Math.floor(Math.random() * eligible.length)]
}
