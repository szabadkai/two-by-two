import { useState, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import GameCanvas from '../components/GameCanvas'
import StatRow from '../components/StatRow'

export default function TractingScreen() {
  const currentDistrict = useGameStore((s) => s.currentDistrict)
  const doorEncounters = useGameStore((s) => s.doorEncounters)
  const resolveDoor = useGameStore((s) => s.resolveDoor)
  const finishTracting = useGameStore((s) => s.finishTracting)
  const stats = useGameStore((s) => s.stats)

  const [activeDoor, setActiveDoor] = useState(null) // { doorIndex, encounter }
  const [doorResult, setDoorResult] = useState(null)  // resolved result text
  const [arrived, setArrived] = useState(true)

  const doorsKnocked = doorEncounters.filter((d) => d.resolved).length
  const totalDoors = doorEncounters.length
  const allDone = doorsKnocked === totalDoors

  // Handle interaction from GameCanvas — door knocks and tram return
  const handleMapInteraction = useCallback((interaction) => {
    if (!interaction) return

    // Tram return → finish tracting
    if (interaction.type === 'tram_return') {
      finishTracting()
      return
    }

    // Door knock
    if (interaction.type === 'tracting_door') {
      const doorIndex = interaction.doorIndex
      const doorEntry = doorEncounters.find((d) => d.doorIndex === doorIndex)
      if (!doorEntry || doorEntry.resolved) return

      setActiveDoor({ doorIndex, encounter: doorEntry.encounter })
      setDoorResult(null)
    }
  }, [doorEncounters, finishTracting])

  // Player makes a choice at a door
  const handleChoice = (choiceIndex) => {
    if (!activeDoor) return

    const doorEntry = doorEncounters.find((d) => d.doorIndex === activeDoor.doorIndex)
    if (!doorEntry) return

    // Auto-resolve encounters (neutral)
    if (activeDoor.encounter.autoResolve) {
      resolveDoor(activeDoor.doorIndex, 0)
      const updated = useGameStore.getState().doorEncounters.find(
        (d) => d.doorIndex === activeDoor.doorIndex
      )
      setDoorResult(updated?.result || { text: activeDoor.encounter.result.text, outcome: 'neutral' })
      return
    }

    resolveDoor(activeDoor.doorIndex, choiceIndex)
    // Read updated result from store
    const updated = useGameStore.getState().doorEncounters.find(
      (d) => d.doorIndex === activeDoor.doorIndex
    )
    setDoorResult(updated?.result || null)
  }

  const closeDoorModal = () => {
    setActiveDoor(null)
    setDoorResult(null)
  }

  if (!currentDistrict) return null

  return (
    <div className="screen-enter tracting-screen" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top bar */}
      <div className="top-bar">
        <h1 style={{ fontSize: '1rem' }}>TRACTING</h1>
        <div style={{ textAlign: 'right' }}>
          <div className="day-label" style={{ color: 'var(--accent)' }}>{currentDistrict.name}</div>
          <div className="day-label">{doorsKnocked}/{totalDoors} doors</div>
        </div>
      </div>

      <StatRow />

      {/* Arrival text */}
      {arrived && (
        <div style={{
          padding: 'var(--space-sm) var(--space-md)',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'var(--text-dim)',
          fontStyle: 'italic',
        }}>
          {currentDistrict.arrivalText}
        </div>
      )}

      {/* Map canvas */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <GameCanvas activeSlot="morning" onInteraction={handleMapInteraction} />
      </div>

      {/* Bottom bar — doors knocked + leave button */}
      <div style={{
        padding: 'var(--space-sm) var(--space-md)',
        background: 'var(--bg-raised)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-sm)',
      }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-dim)' }}>
          {allDone
            ? 'All doors knocked. Head back.'
            : `Tap a door to knock. ${totalDoors - doorsKnocked} remaining.`}
        </div>
        <button
          className="btn btn-sm"
          onClick={finishTracting}
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            padding: '8px 14px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            borderRadius: '4px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          ← Leave
        </button>
      </div>

      {/* Door Encounter Modal */}
      {activeDoor && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 'var(--space-md)',
        }}>
          <div style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            padding: 'var(--space-lg)',
            maxWidth: '380px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--font-pixel)',
              color: 'var(--accent)',
              fontSize: '1rem',
              marginBottom: 'var(--space-sm)',
            }}>
              {activeDoor.encounter.title}
            </h3>

            {/* Description */}
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text)',
              fontSize: '1rem',
              lineHeight: 1.4,
              marginBottom: 'var(--space-md)',
            }}>
              {activeDoor.encounter.description}
            </p>

            {/* If resolved — show result */}
            {doorResult ? (
              <div>
                <div style={{
                  background: doorResult.outcome === 'good'
                    ? 'rgba(106, 191, 105, 0.1)'
                    : doorResult.outcome === 'bad'
                      ? 'rgba(196, 91, 91, 0.1)'
                      : 'rgba(203, 166, 74, 0.1)',
                  border: `1px solid ${
                    doorResult.outcome === 'good' ? 'var(--success)'
                    : doorResult.outcome === 'bad' ? 'var(--danger)'
                    : 'var(--warning)'
                  }`,
                  borderRadius: '6px',
                  padding: 'var(--space-sm)',
                  marginBottom: 'var(--space-md)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text)',
                    fontSize: '0.95rem',
                    lineHeight: 1.4,
                  }}>
                    {doorResult.text}
                  </p>
                </div>

                {/* Stat deltas */}
                {doorResult.statDeltas && Object.keys(doorResult.statDeltas).length > 0 && (
                  <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
                    {Object.entries(doorResult.statDeltas).map(([stat, delta]) => {
                      if (delta === 0) return null
                      return (
                        <span key={stat} className={`delta-chip ${delta > 0 ? 'positive' : 'negative'}`}>
                          {stat} {delta > 0 ? `+${delta}` : delta}
                        </span>
                      )
                    })}
                  </div>
                )}

                {doorResult.newContact && (
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--success)',
                    fontSize: '0.95rem',
                    marginBottom: 'var(--space-sm)',
                  }}>
                    ✦ New contact: {doorResult.newContact.name}
                  </div>
                )}

                <button
                  onClick={closeDoorModal}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--accent)',
                    color: 'var(--text)',
                    border: 'none',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  Continue
                </button>
              </div>
            ) : (
              /* Choices */
              <div>
                {activeDoor.encounter.autoResolve ? (
                  <button
                    onClick={() => handleChoice(0)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'var(--bg-card)',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    Continue →
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    {activeDoor.encounter.choices.map((choice, i) => (
                      <button
                        key={i}
                        onClick={() => handleChoice(i)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'var(--bg-card)',
                          color: 'var(--text)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          lineHeight: 1.3,
                        }}
                      >
                        {choice.label}
                        {choice.statCheck && (
                          <span style={{
                            display: 'block',
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            marginTop: '2px',
                          }}>
                            [{choice.statCheck} check]
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
