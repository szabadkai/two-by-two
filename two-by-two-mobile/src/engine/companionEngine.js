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
 * Apply companion-specific rapport decay (used in weekly processing).
 * Some companions decay faster, some slower.
 */
export function getCompanionRapportDecay(companion) {
  const baseDecay = 1
  const rate = companion.rapportDecayRate || 1
  return Math.round(baseDecay * rate)
}
