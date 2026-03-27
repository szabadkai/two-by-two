import { useState, useEffect, useCallback, useMemo } from 'react'
import { FILL_BLANKS } from '../../data/minigameData'
import FocusableButtonGroup from '../FocusableButtonGroup'
import { useNumberKeySelect } from '../../utils/focusManager'

/**
 * English Class Minigame: Fill in missing words in English sentences.
 */
export default function FillBlanks({ difficulty, onScore, finishEarly, isActive }) {
  const numQuestions = Math.min(4 + difficulty, 7)
  const [questions] = useState(() => shuffle(FILL_BLANKS).slice(0, numQuestions))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState(null)

  const current = questions[currentIndex]

  // Shuffle options once per question (not on every render!)
  const shuffledOptions = useMemo(
    () => current ? shuffle(current.options) : [],
    [currentIndex] // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(() => {
    onScore(correct, numQuestions)
  }, [correct, numQuestions, onScore])

  const handleChoice = useCallback((option) => {
    if (!isActive || feedback) return

    const isCorrect = option === current.blank

    if (isCorrect) {
      setCorrect(c => c + 1)
      setFeedback({ type: 'correct', text: 'Correct!' })
    } else {
      setFeedback({ type: 'wrong', text: `Answer: "${current.blank}"` })
    }

    setTimeout(() => {
      setFeedback(null)
      if (currentIndex + 1 >= numQuestions) {
        const final = isCorrect ? correct + 1 : correct
        finishEarly(final, numQuestions)
      } else {
        setCurrentIndex(i => i + 1)
      }
    }, 800)
  }, [isActive, feedback, current, currentIndex, numQuestions, correct, finishEarly])

  useNumberKeySelect(
    shuffledOptions.length,
    (index) => handleChoice(shuffledOptions[index]),
    isActive && !feedback
  )

  if (!current) return null

  // Render sentence with blank highlighted
  const parts = current.sentence.split('___')

  return (
    <div style={styles.container}>
      <div style={styles.progress}>
        <span className="pixel-font" style={styles.label}>
          QUESTION {currentIndex + 1}/{numQuestions}
        </span>
      </div>

      {/* Sentence */}
      <div style={styles.sentence}>
        <span style={styles.sentenceText}>
          {parts[0]}
          <span style={styles.blank}>______</span>
          {parts[1]}
        </span>
      </div>

      {/* Options */}
      <div style={styles.options}>
        <FocusableButtonGroup
          buttons={shuffledOptions.map((opt, i) => ({ id: `opt-${i}`, label: opt }))}
          onSelect={(index) => handleChoice(shuffledOptions[index])}
          orientation="horizontal"
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
  container: { display: 'flex', flexDirection: 'column', gap: '14px' },
  progress: { textAlign: 'center' },
  label: { fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '1px' },
  sentence: {
    padding: '16px', background: 'var(--bg)', borderRadius: '2px',
    border: '1px solid var(--border)', textAlign: 'center',
  },
  sentenceText: { fontSize: '14px', color: 'var(--text)', lineHeight: 1.6 },
  blank: {
    color: 'var(--accent-bright)', borderBottom: '2px solid var(--accent)',
    fontFamily: 'var(--font-pixel)', padding: '0 4px',
  },
  options: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  optionBtn: {
    padding: '10px', background: 'var(--panel-light)', border: '2px solid',
    borderRadius: '2px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
  },
  optionText: { fontSize: '11px', color: 'var(--text)' },
  feedback: { textAlign: 'center', fontSize: '11px' },
}
