import { STAT_LABELS } from '../data/constants'

const STAT_COLORS = {
  language: 'var(--stat-language)',
  spirit: 'var(--stat-spirit)',
  skills: 'var(--stat-skills)',
  obedience: 'var(--stat-obedience)',
  budget: 'var(--stat-budget)',
}

export default function ActivityCard({ activity, selected, onSelect }) {
  const effects = Object.entries(activity.effects)

  return (
    <div
      className={`activity-option ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
    >
      <div className="name">{activity.label}</div>
      <div className="effects">
        {effects.map(([stat, [min, max]]) => {
          const label = STAT_LABELS[stat] || stat
          const isPositive = max > 0
          const isNegative = min < 0
          return (
            <span
              key={stat}
              className="effect-tag"
              style={{ color: isNegative && !isPositive ? 'var(--danger)' : STAT_COLORS[stat] || 'var(--text-dim)' }}
            >
              {label} {min === max ? (min >= 0 ? `+${min}` : min) : `${min >= 0 ? '+' : ''}${min}/${max >= 0 ? '+' : ''}${max}`}
            </span>
          )
        })}
      </div>
    </div>
  )
}
