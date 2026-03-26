import { useState, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { generateTransfer, LEADERSHIP_LABELS } from '../engine/transferEngine'
import { getCompanionMood } from '../engine/companionEngine'

/**
 * Transfer Screen — multi-step sequence:
 * 1. Farewell to current companion
 * 2. Mission president interview
 * 3. New companion reveal
 */
export default function TransferScreen() {
  const state = useGameStore.getState()
  const companion = useGameStore((s) => s.companion)
  const week = useGameStore((s) => s.week)
  const leadership = useGameStore((s) => s.leadership)
  const completeTransfer = useGameStore((s) => s.completeTransfer)

  const [phase, setPhase] = useState('farewell') // farewell | interview | reveal
  const [transfer] = useState(() => generateTransfer(state))
  const [interviewResult, setInterviewResult] = useState(null)
  const [promotionAccepted, setPromotionAccepted] = useState(false)

  const mood = getCompanionMood(companion.rapport)
  const { departingCompanion, newCompanion, interview } = transfer

  // Handle interview choice
  const handleInterviewChoice = useCallback((choice) => {
    setInterviewResult(choice)
    if (choice.acceptPromotion) {
      setPromotionAccepted(true)
    }
  }, [])

  // Proceed through phases
  const handleContinue = useCallback(() => {
    if (phase === 'farewell') {
      setPhase('interview')
    } else if (phase === 'interview') {
      setPhase('reveal')
    } else if (phase === 'reveal') {
      // Complete the transfer
      completeTransfer({
        newCompanion,
        interviewEffects: interviewResult?.effects || {},
        promotion: promotionAccepted ? interview.promotion : null,
      })
    }
  }, [phase, newCompanion, interviewResult, promotionAccepted, interview, completeTransfer])

  return (
    <div style={styles.container}>
      <div className="panel" style={styles.panel}>
        {/* Transfer header */}
        <div style={styles.header}>
          <span className="pixel-font" style={styles.transferLabel}>
            TRANSFER {transfer.transferNumber}
          </span>
          <span style={styles.weekLabel}>Week {week}</span>
        </div>

        {/* Phase 1: Farewell */}
        {phase === 'farewell' && (
          <div className="fade-in" style={styles.phaseContent}>
            <h2 style={styles.phaseTitle}>Farewell</h2>

            <div style={styles.companionPortrait}>
              <div style={styles.portraitBox}>
                <span className="pixel-font" style={styles.portraitInitial}>
                  {departingCompanion.name.split(' ').pop().charAt(0)}
                </span>
              </div>
            </div>

            <div style={styles.farewellInfo}>
              <span className="pixel-font" style={styles.companionName}>
                {departingCompanion.name}
              </span>
              <span style={styles.archetype}>{departingCompanion.archetype}</span>
              <span style={{
                ...styles.moodText,
                color: mood === 'happy' ? 'var(--success)' : mood === 'unhappy' ? 'var(--danger)' : 'var(--budget)',
              }}>
                Final rapport: {companion.rapport}/10 — {mood}
              </span>
            </div>

            <div style={styles.farewellQuote}>
              <p style={styles.quoteText}>
                {mood === 'happy'
                  ? `"${departingCompanion.name.split(' ')[1]} gives you a firm handshake and a genuine smile. 'It was an honor, Elder. I mean that.'"`
                  : mood === 'neutral'
                    ? `"${departingCompanion.name.split(' ')[1]} nods and packs his bags. 'Take care of yourself out there.' A brief handshake. And he's gone."`
                    : `"${departingCompanion.name.split(' ')[1]} barely looks up as he loads his suitcase. No handshake. Just a nod. The door closes."`}
              </p>
            </div>

            <button className="primary" onClick={handleContinue} style={styles.continueBtn}>
              <span className="pixel-font">Continue</span>
            </button>
          </div>
        )}

        {/* Phase 2: Interview */}
        {phase === 'interview' && (
          <div className="fade-in" style={styles.phaseContent}>
            <h2 style={styles.phaseTitle}>Mission President Interview</h2>

            <div style={styles.presidentPortrait}>
              <div style={styles.presidentBox}>
                <span className="pixel-font" style={styles.presidentLabel}>P</span>
              </div>
              <span className="pixel-font" style={styles.presidentName}>
                President Kovács
              </span>
            </div>

            <div style={styles.interviewBubble}>
              <p style={styles.interviewText}>{interview.text}</p>
            </div>

            {!interviewResult && (
              <div style={styles.choices}>
                {interview.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleInterviewChoice(choice)}
                    style={styles.choiceBtn}
                  >
                    <span style={styles.choiceText}>{choice.text}</span>
                  </button>
                ))}
              </div>
            )}

            {interviewResult && (
              <>
                <div style={styles.responseBubble}>
                  <p style={styles.responseText}>{interviewResult.response}</p>
                </div>

                {promotionAccepted && interview.promotion && (
                  <div style={styles.promotionBanner}>
                    <span className="pixel-font" style={styles.promotionText}>
                      PROMOTED TO {LEADERSHIP_LABELS[interview.promotion].toUpperCase()}
                    </span>
                  </div>
                )}

                <button className="primary" onClick={handleContinue} style={styles.continueBtn}>
                  <span className="pixel-font">Continue</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Phase 3: New Companion Reveal */}
        {phase === 'reveal' && (
          <div className="fade-in" style={styles.phaseContent}>
            <h2 style={styles.phaseTitle}>New Companion</h2>

            <div style={styles.revealText}>
              <p style={styles.narrativeText}>
                You wait at the apartment. A knock on the door.
              </p>
            </div>

            <div style={styles.companionReveal}>
              <div style={styles.revealPortrait}>
                <span className="pixel-font" style={styles.revealInitial}>
                  {newCompanion.name.split(' ').pop().charAt(0)}
                </span>
              </div>

              <span className="pixel-font" style={styles.revealName}>
                {newCompanion.name}
              </span>
              <span className="pixel-font" style={styles.revealArchetype}>
                {newCompanion.archetype}
              </span>

              <p style={styles.revealDescription}>
                {newCompanion.description}
              </p>

              <div style={styles.traitTags}>
                {newCompanion.traits.map(trait => (
                  <span key={trait} className="pixel-font" style={styles.traitTag}>
                    {trait.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>

              <div style={styles.rapportStart}>
                <span className="pixel-font" style={styles.rapportLabel}>
                  Starting Rapport
                </span>
                <div style={styles.rapportBar}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.rapportDot,
                        background: i < newCompanion.initialRapport
                          ? 'var(--rapport)'
                          : 'var(--panel-light)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Leadership reminder */}
            {(leadership && leadership !== 'missionary') && (
              <div style={styles.leadershipReminder}>
                <span className="pixel-font" style={styles.leadershipText}>
                  Current calling: {LEADERSHIP_LABELS[leadership]}
                </span>
              </div>
            )}

            <button className="primary" onClick={handleContinue} style={styles.continueBtn}>
              <span className="pixel-font">Begin Transfer</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '16px',
  },
  panel: {
    maxWidth: '520px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    padding: '0',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'var(--panel-light)',
    borderBottom: '1px solid var(--border)',
  },
  transferLabel: {
    fontSize: '12px',
    color: 'var(--accent-bright)',
    letterSpacing: '2px',
  },
  weekLabel: {
    fontSize: '11px',
    color: 'var(--text-dim)',
  },
  phaseContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  phaseTitle: {
    fontSize: '14px',
    color: 'var(--text)',
    textAlign: 'center',
    marginBottom: '4px',
  },

  // Farewell
  companionPortrait: { marginBottom: '4px' },
  portraitBox: {
    width: '64px',
    height: '64px',
    background: 'var(--panel-light)',
    border: '2px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portraitInitial: {
    fontSize: '28px',
    color: 'var(--text-dim)',
  },
  farewellInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  companionName: {
    fontSize: '14px',
    color: 'var(--text)',
  },
  archetype: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  moodText: {
    fontSize: '10px',
    fontFamily: 'var(--font-pixel)',
  },
  farewellQuote: {
    padding: '12px 16px',
    background: 'var(--bg)',
    borderRadius: '2px',
    border: '1px solid var(--border)',
    width: '100%',
  },
  quoteText: {
    fontSize: '12px',
    color: 'var(--text-dim)',
    lineHeight: 1.6,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Interview
  presidentPortrait: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  presidentBox: {
    width: '56px',
    height: '56px',
    background: 'var(--panel-light)',
    border: '2px solid var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presidentLabel: {
    fontSize: '24px',
    color: 'var(--accent)',
  },
  presidentName: {
    fontSize: '11px',
    color: 'var(--accent-bright)',
  },
  interviewBubble: {
    padding: '14px 18px',
    background: 'var(--bg)',
    borderRadius: '2px',
    border: '1px solid var(--border)',
    width: '100%',
  },
  interviewText: {
    fontSize: '12px',
    color: 'var(--text)',
    lineHeight: 1.6,
  },
  choices: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  choiceBtn: {
    padding: '10px 14px',
    background: 'var(--panel-light)',
    border: '1px solid var(--border-light)',
    borderRadius: '2px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.2s',
  },
  choiceText: {
    fontSize: '11px',
    color: 'var(--text)',
    lineHeight: 1.5,
  },
  responseBubble: {
    padding: '14px 18px',
    background: 'rgba(196, 121, 60, 0.05)',
    borderRadius: '2px',
    border: '1px solid var(--accent)',
    width: '100%',
  },
  responseText: {
    fontSize: '12px',
    color: 'var(--accent-bright)',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  promotionBanner: {
    padding: '10px 16px',
    background: 'rgba(100, 180, 100, 0.1)',
    border: '1px solid var(--success)',
    borderRadius: '2px',
    textAlign: 'center',
  },
  promotionText: {
    fontSize: '12px',
    color: 'var(--success)',
    letterSpacing: '2px',
  },

  // Reveal
  revealText: {
    width: '100%',
  },
  narrativeText: {
    fontSize: '12px',
    color: 'var(--text-dim)',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  companionReveal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    background: 'var(--bg)',
    borderRadius: '2px',
    border: '2px solid var(--accent)',
    width: '100%',
  },
  revealPortrait: {
    width: '72px',
    height: '72px',
    background: 'var(--panel-light)',
    border: '3px solid var(--accent-bright)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  revealInitial: {
    fontSize: '32px',
    color: 'var(--accent-bright)',
  },
  revealName: {
    fontSize: '16px',
    color: 'var(--text)',
  },
  revealArchetype: {
    fontSize: '11px',
    color: 'var(--accent)',
    letterSpacing: '1px',
  },
  revealDescription: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    lineHeight: 1.6,
    textAlign: 'center',
    maxWidth: '380px',
  },
  traitTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  traitTag: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    padding: '2px 6px',
    border: '1px solid var(--border)',
    borderRadius: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  rapportStart: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  rapportLabel: {
    fontSize: '9px',
    color: 'var(--rapport)',
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  rapportBar: {
    display: 'flex',
    gap: '3px',
  },
  rapportDot: {
    width: '12px',
    height: '8px',
    borderRadius: '1px',
  },
  leadershipReminder: {
    padding: '8px 12px',
    background: 'var(--panel-light)',
    borderRadius: '2px',
    textAlign: 'center',
  },
  leadershipText: {
    fontSize: '10px',
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  continueBtn: {
    padding: '10px 32px',
    fontSize: '11px',
    marginTop: '8px',
  },
}
