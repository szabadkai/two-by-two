import { useState, useEffect, useCallback } from 'react'
import { CONTACT_DIALOGUES } from '../../data/minigameData'

/**
 * Street Contacting Minigame: Timed dialogue tree with NPCs.
 * Pick the best response before the timer per exchange runs out.
 */
export default function ContactDialogue({ difficulty, onScore, finishEarly, isActive }) {
  const [dialogue] = useState(() =>
    CONTACT_DIALOGUES[Math.floor(Math.random() * CONTACT_DIALOGUES.length)]
  )
  const [exchangeIndex, setExchangeIndex] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [choiceTimer, setChoiceTimer] = useState(5)
  const [feedback, setFeedback] = useState(null)
  const [failed, setFailed] = useState(false)

  const total = dialogue.exchanges.length
  const current = dialogue.exchanges[exchangeIndex]
  const maxPossible = total // 1 point per perfect answer

  // Per-exchange countdown
  useEffect(() => {
    if (!isActive || feedback || failed) return
    if (choiceTimer <= 0) {
      // Time out — NPC walks away
      setFailed(true)
      setFeedback({ type: 'timeout', text: 'They walked away...' })
      setTimeout(() => finishEarly(totalScore, maxPossible), 1200)
      return
    }
    const timer = setInterval(() => setChoiceTimer(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [isActive, choiceTimer, feedback, failed, totalScore, maxPossible, finishEarly])

  useEffect(() => {
    onScore(totalScore, maxPossible)
  }, [totalScore, maxPossible, onScore])

  const handleChoice = useCallback((option) => {
    if (!isActive || feedback) return

    setTotalScore(s => s + option.score)

    if (option.score >= 1) {
      setFeedback({ type: 'good', text: 'Great response!' })
    } else if (option.score >= 0.5) {
      setFeedback({ type: 'ok', text: 'Decent, but could be better.' })
    } else {
      setFeedback({ type: 'bad', text: 'They\'re losing interest...' })
      if (exchangeIndex >= 1) {
        // Bad response late = they leave
        setTimeout(() => {
          setFailed(true)
          finishEarly(totalScore + option.score, maxPossible)
        }, 1000)
        return
      }
    }

    setTimeout(() => {
      setFeedback(null)
      if (exchangeIndex + 1 >= total) {
        finishEarly(totalScore + option.score, maxPossible)
      } else {
        setExchangeIndex(i => i + 1)
        setChoiceTimer(5 - Math.min(difficulty, 2)) // harder = less time
      }
    }, 1000)
  }, [isActive, feedback, exchangeIndex, total, totalScore, maxPossible, difficulty, finishEarly])

  return (
    <div style={styles.container}>
      {/* NPC info */}
      <div style={styles.npcInfo}>
        <span className="pixel-font" style={styles.npcName}>{dialogue.npcName}</span>
        <span style={styles.npcMood}>({dialogue.npcMood})</span>
      </div>

      {/* Exchange */}
      {current && !failed && (
        <>
          {/* NPC speech */}
          <div style={styles.speechBubble}>
            <p style={styles.speechText}>{current.npcText}</p>
          </div>

          {/* Choice timer */}
          <div style={styles.timerRow}>
            <div style={styles.choiceTimerBar}>
              <div style={{
                ...styles.choiceTimerFill,
                width: `${(choiceTimer / 5) * 100}%`,
                background: choiceTimer > 2 ? 'var(--accent)' : 'var(--danger)',
              }} />
            </div>
            <span className="pixel-font" style={{
              fontSize: '10px',
              color: choiceTimer > 2 ? 'var(--accent)' : 'var(--danger)',
            }}>
              {choiceTimer}s
            </span>
          </div>

          {/* Options */}
          {!feedback && (
            <div style={styles.options}>
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  style={styles.optionBtn}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Feedback */}
      {feedback && (
        <div style={{
          ...styles.feedback,
          color: feedback.type === 'good' ? 'var(--success)'
            : feedback.type === 'ok' ? 'var(--budget)'
            : 'var(--danger)',
        }}>
          <span className="pixel-font">{feedback.text}</span>
        </div>
      )}

      {/* Progress */}
      <div style={styles.progress}>
        {dialogue.exchanges.map((_, i) => (
          <div key={i} style={{
            ...styles.progressDot,
            background: i < exchangeIndex ? 'var(--success)'
              : i === exchangeIndex ? 'var(--accent)' : 'var(--panel-light)',
          }} />
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '12px' },
  npcInfo: { display: 'flex', alignItems: 'center', gap: '8px' },
  npcName: { fontSize: '11px', color: 'var(--text)' },
  npcMood: { fontSize: '10px', color: 'var(--text-dim)', fontStyle: 'italic' },
  speechBubble: {
    padding: '12px 14px', background: 'var(--bg)', borderRadius: '2px',
    border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)',
  },
  speechText: { fontSize: '12px', color: 'var(--text)', lineHeight: 1.5 },
  timerRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  choiceTimerBar: {
    flex: 1, height: '4px', background: 'var(--panel-light)', borderRadius: '1px', overflow: 'hidden',
  },
  choiceTimerFill: { height: '100%', transition: 'width 1s linear' },
  options: { display: 'flex', flexDirection: 'column', gap: '6px' },
  optionBtn: {
    textAlign: 'left', padding: '10px 12px', fontSize: '11px',
    background: 'var(--panel-light)', border: '1px solid var(--border)',
    color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-body)',
    borderRadius: '2px', transition: 'border-color 0.2s',
  },
  feedback: { textAlign: 'center', fontSize: '11px', padding: '8px' },
  progress: { display: 'flex', gap: '4px', justifyContent: 'center' },
  progressDot: { width: '20px', height: '4px', borderRadius: '1px' },
}
