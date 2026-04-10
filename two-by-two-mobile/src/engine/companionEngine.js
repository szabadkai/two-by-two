export function getCompanionMood(rapport) {
  if (rapport >= 7) return 'happy'
  if (rapport >= 4) return 'neutral'
  return 'unhappy'
}

export function getCompanionQuote(companion) {
  const mood = getCompanionMood(companion.rapport)
  const quotes = companion.quotes[mood]
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export function clampRapport(value) {
  return Math.max(0, Math.min(10, value))
}

/**
 * Get companion's stat modifier for a given stat.
 * Returns a multiplier adjustment (e.g., 0.1 means +10% to positive gains).
 */
export function getCompanionStatModifier(companion, stat) {
  if (!companion.statModifiers) return 0
  return companion.statModifiers[stat] || 0
}

/**
 * Apply diminishing returns to rapport gains.
 * Above rapport 7, gains are halved. At 9+, gains are reduced to 1/3.
 */
export function applyRapportDiminishing(currentRapport, rawGain) {
  if (rawGain <= 0) return rawGain
  if (currentRapport >= 9) return Math.max(1, Math.round(rawGain * 0.33))
  if (currentRapport >= 7) return Math.max(1, Math.round(rawGain * 0.5))
  return rawGain
}

/**
 * Check if companion likes/dislikes a given activity.
 * Returns a rapport modifier: +1 for liked, -1 for disliked, 0 for neutral.
 */
export function getActivityPreferenceBonus(companion, activityId) {
  if (!companion.likedActivities && !companion.dislikedActivities) return 0
  if (companion.likedActivities?.includes(activityId)) return 1
  if (companion.dislikedActivities?.includes(activityId)) return -1
  return 0
}

/**
 * Apply companion-specific rapport decay (used in weekly processing).
 * Some companions decay faster, some slower.
 */
export function getCompanionRapportDecay(companion) {
  const baseDecay = 1
  const rate = companion.rapportDecayRate || 1
  return Math.round(baseDecay * rate)
}
