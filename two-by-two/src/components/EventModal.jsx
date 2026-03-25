import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

export default function EventModal() {
  const pendingEvent = useGameStore((s) => s.pendingEvent)
  const resolveEventChoice = useGameStore((s) => s.resolveEventChoice)
  const lastDayResult = useGameStore((s) => s.lastDayResult)
  const [phase, setPhase] = useState('choosing') // 'choosing' | 'outcome'
  const [chosenIndex, setChosenIndex] = useState(null)

  if (!pendingEvent) return null

  const handleChoice = (index) => {
    setChosenIndex(index)
    resolveEventChoice(index)
    setPhase('outcome')
  }

  const handleContinue = () => {
    setPhase('choosing')
    setChosenIndex(null)
  }

  const eventResult = lastDayResult?.eventResult

  return (
    <div style={styles.overlay}>
      <div
        className="fade-in"
        style={{
          ...styles.modal,
          borderColor: phase === 'outcome'
            ? eventResult?.outcome === 'good' ? 'var(--success)' : 'var(--danger)'
            : 'var(--border-light)',
        }}
      >
        <h3 style={styles.title}>{pendingEvent.title}</h3>
        <p style={styles.description}>{pendingEvent.description}</p>

        {phase === 'choosing' && (
          <div style={styles.choices}>
            {pendingEvent.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                style={styles.choiceBtn}
              >
                {choice.label}
              </button>
            ))}
          </div>
        )}

        {phase === 'outcome' && eventResult && (
          <div className="fade-in" style={styles.outcome}>
            <p style={{
              ...styles.outcomeText,
              borderLeftColor: eventResult.outcome === 'good' ? 'var(--success)' : 'var(--danger)',
            }}>
              {eventResult.text}
            </p>
            {Object.keys(eventResult.statDeltas).length > 0 && (
              <div style={styles.deltas}>
                {Object.entries(eventResult.statDeltas).map(([stat, delta]) => (
                  <span
                    key={stat}
                    className="pixel-font"
                    style={{
                      ...styles.delta,
                      color: delta > 0 ? 'var(--success)' : 'var(--danger)',
                    }}
                  >
                    {stat}: {delta > 0 ? '+' : ''}{delta}
                  </span>
                ))}
                {eventResult.rapportDelta !== 0 && (
                  <span
                    className="pixel-font"
                    style={{
                      ...styles.delta,
                      color: eventResult.rapportDelta > 0 ? 'var(--success)' : 'var(--danger)',
                    }}
                  >
                    rapport: {eventResult.rapportDelta > 0 ? '+' : ''}{eventResult.rapportDelta}
                  </span>
                )}
              </div>
            )}
            <button className="primary" onClick={handleContinue} style={styles.continueBtn}>
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '16px',
  },
  modal: {
    maxWidth: '480px',
    width: '100%',
    padding: '20px',
    borderWidth: '2px',
    borderStyle: 'solid',
    background: 'var(--panel)',
    borderRadius: '2px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title: {
    fontSize: '14px',
    color: 'var(--accent-bright)',
  },
  description: {
    fontSize: '12px',
    lineHeight: 1.6,
    color: 'var(--text)',
  },
  choices: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '4px',
  },
  choiceBtn: {
    textAlign: 'left',
    padding: '10px 12px',
    fontSize: '11px',
    background: 'var(--panel-light)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    cursor: 'pointer',
    fontFamily: 'var(--font-pixel)',
    borderRadius: '2px',
  },
  outcome: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  outcomeText: {
    fontSize: '12px',
    lineHeight: 1.6,
    color: 'var(--text)',
    borderLeft: '3px solid',
    paddingLeft: '10px',
  },
  deltas: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  delta: {
    fontSize: '10px',
    textTransform: 'uppercase',
  },
  continueBtn: {
    alignSelf: 'flex-end',
    marginTop: '4px',
  },
}
