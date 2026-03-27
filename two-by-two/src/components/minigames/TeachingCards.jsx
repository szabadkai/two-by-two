import { useState, useEffect, useCallback } from 'react'
import { INVESTIGATOR_CONCERNS, SCRIPTURE_CARDS } from '../../data/minigameData'
import FocusableButtonGroup from '../FocusableButtonGroup'
import { useNumberKeySelect } from '../../utils/focusManager'

/**
 * Teaching Minigame: Match scripture cards to investigator concerns.
 */
export default function TeachingCards({ difficulty, onScore, finishEarly, isActive }) {
  const numRounds = Math.min(3 + difficulty, 5)
  const [rounds] = useState(() => shuffle(INVESTIGATOR_CONCERNS).slice(0, numRounds))
  const [currentRound, setCurrentRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [cardOptions, setCardOptions] = useState([])

  const current = rounds[currentRound]

  // Generate card options for current round
  useEffect(() => {
    if (!current) return
    const correctCard = current.correctCard
    const allKeys = Object.keys(SCRIPTURE_CARDS).filter(k => k !== correctCard)
    const wrongCards = shuffle(allKeys).slice(0, 3)
    const options = shuffle([correctCard, ...wrongCards])
    setCardOptions(options)
  }, [currentRound, current])

  useEffect(() => {
    onScore(correct, numRounds)
  }, [correct, numRounds, onScore])

  const handleCardClick = useCallback((cardId) => {
    if (!isActive || feedback) return

    const isCorrect = cardId === current.correctCard

    if (isCorrect) {
      setCorrect(c => c + 1)
      setFeedback({ type: 'correct', text: 'Perfect response!' })
    } else {
      setFeedback({
        type: 'wrong',
        text: `Better: ${SCRIPTURE_CARDS[current.correctCard].label}`,
      })
    }

    setTimeout(() => {
      setFeedback(null)
      if (currentRound + 1 >= numRounds) {
        const finalCorrect = isCorrect ? correct + 1 : correct
        finishEarly(finalCorrect, numRounds)
      } else {
        setCurrentRound(r => r + 1)
      }
    }, 1000)
  }, [isActive, feedback, current, currentRound, numRounds, correct, finishEarly])

  useNumberKeySelect(
    cardOptions.length,
    (index) => handleCardClick(cardOptions[index]),
    isActive && !feedback
  )

  if (!current) return null

  return (
    <div style={styles.container}>
      {/* Progress */}
      <div style={styles.progress}>
        <span className="pixel-font" style={styles.label}>LESSON {currentRound + 1}/{numRounds}</span>
      </div>

      {/* Investigator concern */}
      <div style={styles.concernCard}>
        <span className="pixel-font" style={styles.concernLabel}>INVESTIGATOR SAYS:</span>
        <p style={styles.concernText}>"{current.concern}"</p>
      </div>

      {/* Card options */}
      <div style={styles.cardsGrid}>
        <FocusableButtonGroup
          buttons={cardOptions.map((cardId) => {
            const card = SCRIPTURE_CARDS[cardId]
            return { id: cardId, label: `${card.label} - ${card.description}` }
          })}
          onSelect={(index) => handleCardClick(cardOptions[index])}
          orientation="vertical"
          disabled={!!feedback}
          autoFocus
        />
      </div>

      {/* Feedback */}
      {feedback && (
        <div style={{
          ...styles.feedback,
          color: feedback.type === 'correct' ? 'var(--success)' : 'var(--danger)',
        }}>
          <span className="pixel-font">{feedback.text}</span>
        </div>
      )}
    </div>
  )
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '12px' },
  progress: { display: 'flex', justifyContent: 'center' },
  label: { fontSize: '9px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' },
  concernCard: {
    padding: '14px', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: '2px', textAlign: 'center',
  },
  concernLabel: { fontSize: '8px', color: 'var(--accent)', display: 'block', marginBottom: '6px' },
  concernText: { fontSize: '13px', color: 'var(--text)', lineHeight: 1.5, fontStyle: 'italic' },
  cardsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px',
  },
  card: {
    padding: '10px', background: 'var(--panel-light)', border: '2px solid',
    borderRadius: '2px', cursor: 'pointer', textAlign: 'left',
    display: 'flex', flexDirection: 'column', gap: '4px', transition: 'all 0.2s',
  },
  cardTitle: { fontSize: '10px', color: 'var(--accent-bright)' },
  cardDesc: { fontSize: '9px', color: 'var(--text-dim)', lineHeight: 1.4 },
  feedback: { textAlign: 'center', fontSize: '11px', minHeight: '16px' },
}
