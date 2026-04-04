import { useGameStore } from '../store/gameStore'
import { STAT_LABELS } from '../data/constants'

export default function WeeklySummary() {
  const stats = useGameStore((s) => s.stats)
  const week = useGameStore((s) => s.week)
  const weekLog = useGameStore((s) => s.weekLog)
  const endWeek = useGameStore((s) => s.endWeek)
  const baptisms = useGameStore((s) => s.baptisms)
  const companion = useGameStore((s) => s.companion)

  const startStats = weekLog.startStats || {}

  const formatVal = (key, val) => {
    if (key === 'budget') return `${(val / 1000).toFixed(0)}k`
    return val
  }

  return (
    <div className="screen-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <h1>WEEK {week} SUMMARY</h1>
        <div className="day-label">Baptisms: {baptisms}</div>
      </div>

      <div className="scroll-area">
        <div className="section-header">Stats</div>
        <div className="summary-list">
          {Object.entries(stats).map(([key, val]) => {
            const prev = startStats[key] ?? val
            const delta = val - prev
            return (
              <div className="summary-row" key={key}>
                <span className="label">{STAT_LABELS[key]}</span>
                <div className="values">
                  <span className="current">{formatVal(key, val)}</span>
                  {delta !== 0 && (
                    <span className={`delta ${delta > 0 ? 'positive' : 'negative'}`}>
                      {delta > 0 ? `+${key === 'budget' ? (delta/1000).toFixed(0) + 'k' : delta}` : key === 'budget' ? (delta/1000).toFixed(0) + 'k' : delta}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          <div className="summary-row">
            <span className="label">Rapport</span>
            <div className="values">
              <span className="current">{companion.rapport}/10</span>
              {weekLog.startRapport !== undefined && companion.rapport - weekLog.startRapport !== 0 && (
                <span className={`delta ${companion.rapport - weekLog.startRapport > 0 ? 'positive' : 'negative'}`}>
                  {companion.rapport - weekLog.startRapport > 0 ? '+' : ''}{companion.rapport - weekLog.startRapport}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Events */}
        {weekLog.events.length > 0 && (
          <>
            <div className="section-header">Events</div>
            <div className="card">
              {weekLog.events.map((e, i) => (
                <div key={i} style={{ padding: '4px 0', color: 'var(--text-dim)', fontSize: '0.875rem' }}>· {e}</div>
              ))}
            </div>
          </>
        )}

        {/* Investigator changes */}
        {weekLog.investigatorChanges.length > 0 && (
          <>
            <div className="section-header">Investigators</div>
            <div className="card">
              {weekLog.investigatorChanges.map((c, i) => (
                <div key={i} style={{ padding: '4px 0', color: 'var(--text-dim)', fontSize: '0.875rem' }}>· {c}</div>
              ))}
            </div>
          </>
        )}

        {/* Notifications */}
        {weekLog.notifications && weekLog.notifications.length > 0 && (
          <>
            <div className="section-header">Notices</div>
            <div className="card">
              {weekLog.notifications.map((n, i) => (
                <div key={i} style={{
                  padding: '4px 0',
                  color: n.includes('WARNING') ? 'var(--danger)' : 'var(--text-dim)',
                  fontSize: '0.875rem',
                }}>
                  · {n}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bottom-bar">
        <button className="btn btn-primary" onClick={endWeek}>
          Next Week →
        </button>
      </div>
    </div>
  )
}
