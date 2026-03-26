import { useState, useEffect } from 'react'
import { MONTHLY_STIPEND } from '../data/constants'

const STAT_COLORS = {
  language: 'var(--language)',
  spirit: 'var(--spirit)',
  skills: 'var(--skills)',
  obedience: 'var(--obedience)',
  budget: 'var(--budget)',
  rapport: 'var(--rapport)',
}

const STAT_LABELS = {
  language: 'Language',
  spirit: 'Spirit',
  skills: 'Skills',
  obedience: 'Obedience',
  budget: 'Budget',
  rapport: 'Rapport',
}

export default function StatBar({ stat, value, max = 100, delta, compact = false }) {
  const [showDelta, setShowDelta] = useState(false)

  useEffect(() => {
    if (delta && delta !== 0) {
      setShowDelta(true)
      const timer = setTimeout(() => setShowDelta(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [delta])

  const percentage = stat === 'budget'
    ? Math.max(0, Math.min(100, (value / MONTHLY_STIPEND) * 100))
    : Math.max(0, Math.min(100, (value / max) * 100))
  const displayLabel = stat === 'budget'
    ? `${value.toLocaleString()} Ft`
    : `${value}/${max}`

  if (compact) {
    return (
      <div style={compactStyles.container}>
        <span className="pixel-font" style={{ ...compactStyles.label, color: STAT_COLORS[stat] }}>
          {STAT_LABELS[stat]}
        </span>
        <div style={compactStyles.barOuter}>
          <div
            style={{
              ...compactStyles.barFill,
              width: `${percentage}%`,
              background: STAT_COLORS[stat],
            }}
          />
        </div>
        <span style={compactStyles.value}>{stat === 'budget' ? `${Math.round(value/1000)}k` : value}</span>
        {showDelta && delta !== 0 && (
          <span className="pixel-font" style={{
            ...compactStyles.delta,
            color: delta > 0 ? 'var(--success)' : 'var(--danger)',
          }}>
            {delta > 0 ? '+' : ''}{stat === 'budget' ? `${Math.round(delta/1000)}k` : delta}
          </span>
        )}
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span className="pixel-font" style={{ ...styles.label, color: STAT_COLORS[stat] }}>
          {STAT_LABELS[stat]}
        </span>
        <div style={styles.valueRow}>
          <span style={styles.value}>{displayLabel}</span>
          {showDelta && delta !== 0 && (
            <span
              className="stat-delta"
              style={{
                position: 'relative',
                color: delta > 0 ? 'var(--success)' : 'var(--danger)',
              }}
            >
              {delta > 0 ? '+' : ''}{stat === 'budget' ? `${delta.toLocaleString()} Ft` : delta}
            </span>
          )}
        </div>
      </div>
      <div className="stat-bar">
        <div
          className="stat-bar__fill"
          data-stat={stat}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

const compactStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flex: '1 0 auto',
    minWidth: '100px',
  },
  label: {
    fontSize: '8px',
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  barOuter: {
    flex: 1,
    height: '4px',
    background: 'var(--panel-light)',
    borderRadius: '1px',
    overflow: 'hidden',
    minWidth: '30px',
  },
  barFill: {
    height: '100%',
    borderRadius: '1px',
    transition: 'width 0.3s',
  },
  value: {
    fontSize: '8px',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-body)',
    flexShrink: 0,
  },
  delta: {
    fontSize: '8px',
    flexShrink: 0,
  },
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '10px',
    textTransform: 'uppercase',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  value: {
    fontSize: '10px',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-body)',
  },
}
