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
  DAILY_SPIRIT_DRAIN,
  RAPPORT_SPIRIT_RELIEF_THRESHOLD,
} from '../data/constants'
import { checkSpiritCrisis } from './consequenceEngine'
import { scaleEffects, ACTIVITY_MINIGAME_MAP } from './minigameEngine'
import { getCompanionStatModifier, applyRapportDiminishing, getActivityPreferenceBonus } from './companionEngine'

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
  let languageActivityDone = false

  // Track mandatory activity for display
  const mandatoryActivity = state.mandatoryActivity

  // Process each time slot
  for (const slot of ['morning', 'afternoon', 'evening']) {
    let activityId = schedule[slot]

    // If this slot is locked by a mandatory activity, use that instead
    if (mandatoryActivity && mandatoryActivity.slot === slot && !mandatoryActivity.refused) {
      // Mandatory activity overrides the chosen one
      const ma = mandatoryActivity
      for (const [stat, [min, max]] of Object.entries(ma.effects)) {
        const delta = rollInRange(min, max)
        statDeltas[stat] = (statDeltas[stat] || 0) + delta
      }
      if (ma.rapportEffect) {
        const [rMin, rMax] = ma.rapportEffect
        rapportDelta += rollInRange(rMin, rMax)
      }
      continue
    }

    // If mandatory was refused, apply the consequence
    if (mandatoryActivity && mandatoryActivity.slot === slot && mandatoryActivity.refused) {
      const consequence = mandatoryActivity.refuseConsequence
      if (consequence.rapportDelta) rapportDelta += consequence.rapportDelta
      if (consequence.obedienceDelta) statDeltas.obedience = (statDeltas.obedience || 0) + consequence.obedienceDelta
      if (consequence.spiritDelta) statDeltas.spirit = (statDeltas.spirit || 0) + consequence.spiritDelta
      // Still process the player's chosen activity for this slot
    }

    if (!activityId) continue

    const activity = activityPool[activityId]
    if (!activity) continue

    // Track if any language activity was done this day
    if (activityId === 'study_language' || activityId === 'pday_study') {
      languageActivityDone = true
    }

    // Check if this activity had a minigame score
    const minigameScore = state.minigameScores?.[slot]
    const hasMinigame = ACTIVITY_MINIGAME_MAP[activityId]

    if (hasMinigame && minigameScore !== null && minigameScore !== undefined) {
      // Use minigame score to scale effects deterministically
      const scaled = scaleEffects(activityId, minigameScore, isPDay)

      for (const [stat, delta] of Object.entries(scaled.effects)) {
        let d = delta

        // Apply rapport multiplier to positive effects
        if (d > 0 && companion.rapport !== undefined) {
          const rapportMod = companion.rapport > 5
            ? 1 + (companion.rapport - 5) * RAPPORT_EFFECT_SCALE * 0.5
            : companion.rapport < 5
              ? 1 - (5 - companion.rapport) * RAPPORT_EFFECT_SCALE * 0.5
              : 1
          d = Math.round(d * rapportMod)
        }

        if (d > 0 && stats.spirit < TRUNKY_THRESHOLD) {
          d = Math.round(d * TRUNKY_MULTIPLIER)
        }
        if (d > 0 && stats.spirit > ON_FIRE_THRESHOLD) {
          d = Math.round(d * ON_FIRE_MULTIPLIER)
        }

        statDeltas[stat] = (statDeltas[stat] || 0) + d
      }

      rapportDelta += scaled.rapportDelta || 0

      // Companion activity preference
      rapportDelta += getActivityPreferenceBonus(companion, activityId)

      if (scaled.special) {
        specialResults.push(scaled.special)
      }
    } else {
      // No minigame — use random roll (fallback)
      for (const [stat, [min, max]] of Object.entries(activity.effects)) {
        let delta = rollInRange(min, max)

        if (delta > 0 && companion.rapport !== undefined) {
          const rapportMod = companion.rapport > 5
            ? 1 + (companion.rapport - 5) * RAPPORT_EFFECT_SCALE * 0.5
            : companion.rapport < 5
              ? 1 - (5 - companion.rapport) * RAPPORT_EFFECT_SCALE * 0.5
              : 1
          delta = Math.round(delta * rapportMod)
        }

        if (delta > 0 && stats.spirit < TRUNKY_THRESHOLD) {
          delta = Math.round(delta * TRUNKY_MULTIPLIER)
        }
        if (delta > 0 && stats.spirit > ON_FIRE_THRESHOLD) {
          delta = Math.round(delta * ON_FIRE_MULTIPLIER)
        }

        statDeltas[stat] = (statDeltas[stat] || 0) + delta
      }

      if (activity.rapportEffect) {
        const [rMin, rMax] = activity.rapportEffect
        rapportDelta += rollInRange(rMin, rMax)
      }

      // Companion activity preference
      rapportDelta += getActivityPreferenceBonus(companion, activityId)

      if (activity.special) {
        specialResults.push(activity.special)
      }
    }
  }

  // Daily spirit drain (homesickness, fatigue)
  // Reduced by 1 when companion rapport is high (good companionship = less lonely)
  if (!isPDay) {
    let spiritDrain = DAILY_SPIRIT_DRAIN
    if (companion.rapport >= RAPPORT_SPIRIT_RELIEF_THRESHOLD) {
      spiritDrain = Math.max(1, spiritDrain - 1)
    }
    statDeltas.spirit = (statDeltas.spirit || 0) - spiritDrain
  }

  // Apply companion archetype stat modifiers (boost or penalty to gains)
  for (const [stat, delta] of Object.entries(statDeltas)) {
    if (delta > 0 && stat !== 'budget') {
      const mod = getCompanionStatModifier(companion, stat)
      if (mod !== 0) {
        statDeltas[stat] = Math.round(delta * (1 + mod))
      }
    }
  }

  // Calculate new stats
  const newStats = { ...stats }
  for (const [stat, delta] of Object.entries(statDeltas)) {
    newStats[stat] = clampStat(stat, stats[stat] + delta)
  }

  // Calculate new rapport (with diminishing returns at high rapport)
  const adjustedRapportDelta = applyRapportDiminishing(companion.rapport, rapportDelta)
  const newRapport = Math.max(0, Math.min(10, companion.rapport + adjustedRapportDelta))

  // Check for spirit crisis FIRST — forced event takes priority
  const crisisEvent = checkSpiritCrisis(newStats)
  if (crisisEvent) {
    return {
      statDeltas,
      rapportDelta,
      newStats,
      newRapport,
      triggeredEvent: crisisEvent,
      specialResults,
      languageActivityDone,
    }
  }

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
    languageActivityDone,
  }
}

export function selectEvent(state) {
  const eligible = EVENTS.filter(
    (e) => !e.condition || e.condition(state)
  )
  if (eligible.length === 0) return null
  return eligible[Math.floor(Math.random() * eligible.length)]
}
