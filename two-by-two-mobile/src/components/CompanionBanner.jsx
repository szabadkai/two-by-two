import { useGameStore } from '../store/gameStore'
import { getCompanionQuote } from '../engine/companionEngine'

export default function CompanionBanner() {
  const companion = useGameStore((s) => s.companion)
  if (!companion) return null

  const quote = getCompanionQuote(companion)
  const rapportPct = (companion.rapport / 10) * 100

  const emoji = companion.rapport >= 7 ? '😊' : companion.rapport >= 4 ? '😐' : '😞'

  return (
    <div className="companion-banner">
      <div className="avatar">{emoji}</div>
      <div className="info">
        <div className="name">{companion.name}</div>
        <div className="quote">"{quote}"</div>
      </div>
      <div className="rapport-bar">
        <div className="fill" style={{ width: `${rapportPct}%` }} />
      </div>
    </div>
  )
}
