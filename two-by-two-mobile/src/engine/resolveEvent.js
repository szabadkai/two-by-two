import { STAT_CAPS } from '../data/constants'

function clampStat(name, value) {
  const cap = STAT_CAPS[name]
  if (!cap) return value
  return Math.max(cap.min, Math.min(cap.max, value))
}

export function resolveEvent(state, event, choiceIndex) {
  const choice = event.choices[choiceIndex]
  if (!choice) return null

  // Calculate success chance, modified by stat check
  let chance = choice.successChance
  if (choice.statCheck && state.stats[choice.statCheck] !== undefined) {
    chance += (state.stats[choice.statCheck] / 100) * 0.2
  }
  chance = Math.max(0, Math.min(1, chance))

  const isSuccess = Math.random() < chance
  const result = isSuccess ? choice.resultGood : choice.resultBad

  // Apply stat effects
  const statDeltas = {}
  const newStats = { ...state.stats }
  if (result.effects) {
    for (const [stat, delta] of Object.entries(result.effects)) {
      statDeltas[stat] = delta
      newStats[stat] = clampStat(stat, state.stats[stat] + delta)
    }
  }

  // Apply rapport effect
  let rapportDelta = 0
  if (result.rapportEffect !== undefined) {
    rapportDelta = result.rapportEffect
  }

  // Collect flags
  const flags = result.flags || {}

  return {
    outcome: isSuccess ? 'good' : 'bad',
    text: result.text,
    statDeltas,
    rapportDelta,
    newStats,
    flags,
  }
}
