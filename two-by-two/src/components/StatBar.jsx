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

export default function StatBar({ stat, value, max = 100, delta }) {
  const [showDelta, setShowDelta] = useState(false)

  useEffect(() => {
    if (delta && delta !== 0) {
      setShowDelta(true)
      const timer = setTimeout(() => setShowDelta(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [delta])

  // Budget displays as percentage of monthly stipend
  const displayValue = stat === 'budget' ? value : value
  const percentage = stat === 'budget'
    ? Math.max(0, Math.min(100, (value / MONTHLY_STIPEND) * 100))
    : Math.max(0, Math.min(100, (value / max) * 100))
  const displayLabel = stat === 'budget'
    ? `${value.toLocaleString()} Ft`
    : `${value}/${max}`

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
