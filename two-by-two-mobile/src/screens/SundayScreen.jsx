import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export default function SundayScreen() {
  const resolveSunday = useGameStore((s) => s.resolveSunday)
  const finishSunday = useGameStore((s) => s.finishSunday)
  const sundayAttendees = useGameStore((s) => s.sundayAttendees)
  const sundayResolved = useGameStore((s) => s.sundayResolved)
  const investigators = useGameStore((s) => s.investigators)
  const week = useGameStore((s) => s.week)

  // Auto-resolve on mount
  useEffect(() => {
    if (!sundayResolved) {
      resolveSunday()
    }
  }, [sundayResolved, resolveSunday])

  const activeInvestigators = investigators.filter((i) => i.isActive && i.stage < 7)
  const attendeeCount = sundayAttendees.length

  return (
    <div className="screen-enter" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--bg)',
    }}>
      {/* Header */}
      <div className="top-bar">
        <h1>SUNDAY MEETING</h1>
        <div style={{ textAlign: 'right' }}>
          <div className="day-label">Vasárnap · Sunday</div>
          <div className="day-label">Week {week}</div>
        </div>
      </div>

      {/* Church interior visual */}
      <div style={{
        padding: 'var(--space-lg) var(--space-md)',
        textAlign: 'center',
        background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg) 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Simple church icon */}
        <div style={{
          fontSize: '3rem',
          marginBottom: 'var(--space-sm)',
          filter: 'grayscale(0.3)',
        }}>
          ⛪
        </div>
        <div style={{
          fontFamily: 'var(--font-pixel)',
          color: 'var(--text)',
          fontSize: '1.1rem',
          marginBottom: 'var(--space-xs)',
        }}>
          Budapest Branch
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--text-dim)',
          fontSize: '1rem',
        }}>
          Sacrament Meeting
        </div>
      </div>

      {/* Attendance */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: 'var(--space-md)',
      }}>
        {attendeeCount > 0 ? (
          <>
            <div style={{
              fontFamily: 'var(--font-pixel)',
              color: 'var(--success)',
              fontSize: '0.9rem',
              marginBottom: 'var(--space-md)',
              textAlign: 'center',
            }}>
              {attendeeCount === 1
                ? '1 investigator came today'
                : `${attendeeCount} investigators came today`}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {sundayAttendees.map((inv) => (
                <div
                  key={inv.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--success)',
                    borderRadius: '8px',
                    padding: 'var(--space-sm) var(--space-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-pixel)',
                      color: 'var(--text)',
                      fontSize: '0.9rem',
                    }}>
                      {inv.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--text-dim)',
                      fontSize: '0.85rem',
                    }}>
                      {inv.personality} · Stage {inv.stage + 1}/7
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--success)',
                    fontSize: '0.9rem',
                  }}>
                    +1 warmth
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-dim)',
              fontSize: '1rem',
              textAlign: 'center',
              marginTop: 'var(--space-lg)',
              fontStyle: 'italic',
              lineHeight: 1.4,
            }}>
              {attendeeCount >= 3
                ? 'The chapel feels alive. The branch president beams. This is what it\'s all about.'
                : attendeeCount === 2
                  ? 'Two familiar faces in the pews. They sit together. Something is growing here.'
                  : 'One person came. One. That\'s enough. That\'s everything.'}
            </div>
          </>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-xl) var(--space-md)',
          }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-dim)',
              fontSize: '1.1rem',
              lineHeight: 1.5,
              fontStyle: 'italic',
              marginBottom: 'var(--space-md)',
            }}>
              {activeInvestigators.length > 0
                ? 'Empty pews today. Your investigators weren\'t ready yet. Keep teaching, keep visiting. Sunday will come again.'
                : 'No investigators to invite yet. But the branch members are here. The hymns still ring. Keep going, Elder.'}
            </div>
          </div>
        )}

        {/* Spirit bonus note */}
        {attendeeCount > 0 && (
          <div style={{
            textAlign: 'center',
            marginTop: 'var(--space-md)',
          }}>
            <span className="delta-chip positive">
              spirit +{attendeeCount * 2}
            </span>
          </div>
        )}
      </div>

      {/* Continue button */}
      <div style={{
        padding: 'var(--space-md)',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-raised)',
      }}>
        <button
          onClick={finishSunday}
          style={{
            width: '100%',
            padding: '14px',
            background: 'var(--accent)',
            color: 'var(--text)',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'var(--font-pixel)',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Continue to Weekly Summary →
        </button>
      </div>
    </div>
  )
}
