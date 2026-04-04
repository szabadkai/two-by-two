import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { getTransferCompanion } from '../data/companions'
import { getPresidentInterview, calculatePromotion, LEADERSHIP_LABELS } from '../engine/transferEngine'

export default function TransferScreen() {
  const state = useGameStore.getState()
  const week = useGameStore((s) => s.week)
  const companion = useGameStore((s) => s.companion)
  const completeTransfer = useGameStore((s) => s.completeTransfer)

  const [phase, setPhase] = useState('intro') // intro, interview, newCompanion
  const [interview] = useState(() => getPresidentInterview(state))
  const [newCompanion] = useState(() =>
    getTransferCompanion(week, state.companionHistory || [])
  )
  const [interviewEffects, setInterviewEffects] = useState({})
  const [promotion, setPromotion] = useState(null)

  const handleInterviewChoice = (choice) => {
    setInterviewEffects(choice.effects || {})
    if (choice.acceptPromotion) {
      setPromotion(interview.promotion)
    }
    setPhase('newCompanion')
  }

  const handleContinue = () => {
    completeTransfer({
      newCompanion,
      interviewEffects,
      promotion,
    })
  }

  return (
    <div className="screen-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <h1>TRANSFER</h1>
        <div className="day-label">Week {week}</div>
      </div>

      <div className="scroll-area" style={{ padding: 'var(--space-md)' }}>
        {phase === 'intro' && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-sm)' }}>Transfer Day</div>
            <p style={{ color: 'var(--text-dim)', marginBottom: 'var(--space-md)' }}>
              {companion.name} packs their bags. Six weeks together — some good, some hard.
              Time for President Kovács's interview.
            </p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setPhase('interview')}>
              Enter the Office
            </button>
          </div>
        )}

        {phase === 'interview' && interview && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-sm)' }}>President Kovács</div>
            <p style={{ color: 'var(--text)', marginBottom: 'var(--space-lg)', lineHeight: 1.5 }}>
              "{interview.text}"
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {interview.choices.map((choice, i) => (
                <button key={i} className="btn" onClick={() => handleInterviewChoice(choice)}>
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'newCompanion' && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-sm)' }}>New Companion</div>
            {promotion && (
              <div style={{
                padding: 'var(--space-sm)',
                marginBottom: 'var(--space-md)',
                borderRadius: 8,
                background: 'var(--accent-soft)',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.625rem',
                textAlign: 'center',
              }}>
                Promoted to {LEADERSHIP_LABELS[promotion]}
              </div>
            )}
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--text)', marginBottom: 4 }}>
              {newCompanion.name}
            </p>
            <p style={{ fontSize: '0.625rem', fontFamily: 'var(--font-pixel)', color: 'var(--text-muted)', marginBottom: 8 }}>
              {newCompanion.archetype}
            </p>
            <p style={{ color: 'var(--text-dim)', marginBottom: 'var(--space-lg)', lineHeight: 1.4 }}>
              {newCompanion.description}
            </p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleContinue}>
              Begin Next Transfer →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
