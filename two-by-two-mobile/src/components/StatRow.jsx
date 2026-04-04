import { useGameStore } from '../store/gameStore'
import { STAT_LABELS } from '../data/constants'

const STAT_COLORS = {
  language: 'var(--stat-language)',
  spirit: 'var(--stat-spirit)',
  skills: 'var(--stat-skills)',
  obedience: 'var(--stat-obedience)',
  budget: 'var(--stat-budget)',
}

export default function StatRow() {
  const stats = useGameStore((s) => s.stats)

  const formatValue = (key, val) => {
    if (key === 'budget') return `${(val / 1000).toFixed(0)}k Ft`
    return val
  }

  return (
    <div className="stat-row">
      {Object.entries(stats).map(([key, val]) => (
        <div className="stat-pill" key={key}>
          <span className="dot" style={{ background: STAT_COLORS[key] }} />
          <span style={{ color: STAT_COLORS[key] }}>{STAT_LABELS[key]}</span>
          <span className="value">{formatValue(key, val)}</span>
        </div>
      ))}
    </div>
  )
}
