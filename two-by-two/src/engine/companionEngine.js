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
