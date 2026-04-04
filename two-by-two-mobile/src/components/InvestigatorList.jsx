import { useGameStore } from '../store/gameStore'
import { INVESTIGATOR_STAGES } from '../data/investigators'

export default function InvestigatorList() {
  const investigators = useGameStore((s) => s.investigators)
  const active = investigators.filter((i) => i.isActive)

  if (active.length === 0) return null

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Investigators</span>
        <span className="card-subtitle">{active.length} active</span>
      </div>
      {active.map((inv) => (
        <div className="investigator-item" key={inv.id}>
          <div className="inv-stage">{inv.stage}</div>
          <div className="inv-info">
            <div className="inv-name">{inv.name}</div>
            <div className="inv-personality">
              {inv.personality} · {INVESTIGATOR_STAGES[inv.stage] || 'Unknown'}
            </div>
          </div>
          <div className="warmth-pips">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className={`warmth-pip ${i < inv.warmth ? 'filled' : ''}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
