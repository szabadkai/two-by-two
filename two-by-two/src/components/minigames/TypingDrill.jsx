import { useState, useEffect, useRef, useCallback } from 'react'
import { HUNGARIAN_WORDS } from '../../data/minigameData'

/**
 * Language Study Minigame: See a Hungarian word and its meaning, then type it.
 * Teaches spelling and vocabulary through repetition.
 */
export default function TypingDrill({ difficulty, onScore, finishEarly, isActive }) {
  const wordPool = HUNGARIAN_WORDS[Math.min(difficulty, HUNGARIAN_WORDS.length - 1)]
  const numRounds = Math.min(6 + difficulty, 8)

  const [rounds] = useState(() => shuffle(wordPool).slice(0, numRounds))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [phase, setPhase] = useState('study') // 'study' | 'type'
  const [studyTimer, setStudyTimer] = useState(3)
  const inputRef = useRef(null)

  const total = rounds.length
  const current = rounds[currentIndex]

  // Study countdown
  useEffect(() => {
    if (phase !== 'study' || !isActive) return
    if (studyTimer <= 0) {
      setPhase('type')
      setTimeout(() => inputRef.current?.focus(), 50)
      return
    }
    const timer = setInterval(() => setStudyTimer(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [phase, studyTimer, isActive])

  useEffect(() => {
    onScore(correct, total)
  }, [correct, total, onScore])

  const skipToType = useCallback(() => {
    setPhase('type')
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!isActive || feedback || phase !== 'type') return

    const trimmed = input.trim().toLowerCase()
    const expected = current.hu.toLowerCase()

    // Accept answers with or without accent marks (not every keyboard has them)
    const strip = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const isCorrect = trimmed === expected || strip(trimmed) === strip(expected)

    if (isCorrect) {
      setCorrect(c => c + 1)
      setFeedback({ type: 'correct', text: 'Helyes! ✓' })
    } else {
      setFeedback({ type: 'wrong', text: `→ ${current.hu}` })
    }

    setInput('')

    setTimeout(() => {
      setFeedback(null)
      if (currentIndex + 1 >= total) {
        const finalCorrect = isCorrect ? correct + 1 : correct
        finishEarly(finalCorrect, total)
      } else {
        setCurrentIndex(i => i + 1)
        setPhase('study')
        setStudyTimer(2) // shorter after first round
      }
    }, 800)
  }, [input, current, isActive, feedback, phase, currentIndex, total, correct, finishEarly])

  if (!current) return null

  return (
    <div style={styles.container}>
      {/* Progress */}
      <div style={styles.progress}>
        <span className="pixel-font" style={styles.progressText}>
          {currentIndex + 1} / {total}
        </span>
        <div style={styles.dots}>
          {rounds.map((_, i) => (
            <div key={i} style={{
              ...styles.dot,
              background: i < currentIndex
                ? 'var(--success)'
                : i === currentIndex ? 'var(--accent)' : 'var(--panel-light)',
            }} />
          ))}
        </div>
      </div>

      {/* Study Phase: show both word and meaning */}
      {phase === 'study' && (
        <div style={styles.studyCard}>
          <span className="pixel-font" style={styles.studyLabel}>MEMORIZE THIS WORD</span>
          <div style={styles.wordDisplay}>
            <span style={styles.hungarianBig}>{current.hu}</span>
            <span style={styles.equals}>=</span>
            <span style={styles.englishBig}>{current.en}</span>
          </div>
          <div style={styles.studyFooter}>
            <span className="pixel-font" style={{
              ...styles.timer,
              color: studyTimer > 1 ? 'var(--accent)' : 'var(--danger)',
            }}>
              {studyTimer}s
            </span>
            <button onClick={skipToType} style={styles.skipBtn}>
              <span className="pixel-font">I got it →</span>
            </button>
          </div>
        </div>
      )}

      {/* Type Phase: type the word from memory */}
      {phase === 'type' && (
        <>
          <div style={styles.typeCard}>
            <span className="pixel-font" style={styles.typeLabel}>TYPE IN HUNGARIAN</span>
            <span style={styles.englishPrompt}>{current.en}</span>
            <span style={styles.hint}>
              {current.hu.charAt(0)}{'_'.repeat(current.hu.length - 1)}
            </span>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
              placeholder="Type the Hungarian word..."
              autoComplete="off"
              autoFocus
              disabled={!isActive || !!feedback}
            />
            <button type="submit" style={styles.submitBtn}>
              <span className="pixel-font">↵</span>
            </button>
          </form>
        </>
      )}

      {/* Feedback */}
      {feedback && (
        <div style={{
          ...styles.feedback,
          background: feedback.type === 'correct'
            ? 'rgba(100, 180, 100, 0.1)'
            : 'rgba(200, 60, 60, 0.1)',
          borderColor: feedback.type === 'correct' ? 'var(--success)' : 'var(--danger)',
        }}>
          <span className="pixel-font" style={{
            color: feedback.type === 'correct' ? 'var(--success)' : 'var(--danger)',
            fontSize: '13px',
          }}>
            {feedback.text}
          </span>
        </div>
      )}

      {/* Score */}
      <div style={styles.score}>
        <span className="pixel-font" style={{ color: 'var(--success)', fontSize: '10px' }}>
          {correct} correct
        </span>
      </div>
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
  progress: { display: 'flex', alignItems: 'center', gap: '8px' },
  progressText: { fontSize: '10px', color: 'var(--text-dim)', flexShrink: 0 },
  dots: { display: 'flex', gap: '3px', flex: 1 },
  dot: { flex: 1, height: '4px', borderRadius: '1px' },

  // Study phase
  studyCard: {
    textAlign: 'center', padding: '20px', background: 'var(--bg)',
    borderRadius: '2px', border: '2px solid var(--accent)',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  studyLabel: { fontSize: '9px', color: 'var(--accent)', letterSpacing: '2px' },
  wordDisplay: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '12px', padding: '8px 0',
  },
  hungarianBig: {
    fontSize: '24px', color: 'var(--accent-bright)', fontFamily: 'var(--font-body)',
    fontWeight: 'bold',
  },
  equals: { fontSize: '16px', color: 'var(--text-dim)' },
  englishBig: { fontSize: '20px', color: 'var(--text)', fontFamily: 'var(--font-body)' },
  studyFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  timer: { fontSize: '11px' },
  skipBtn: {
    padding: '4px 12px', background: 'var(--panel-light)',
    border: '1px solid var(--border)', color: 'var(--text-dim)',
    cursor: 'pointer', borderRadius: '2px', fontSize: '9px',
  },

  // Type phase
  typeCard: {
    textAlign: 'center', padding: '16px', background: 'var(--bg)',
    borderRadius: '2px', border: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  typeLabel: { fontSize: '9px', color: 'var(--accent)', letterSpacing: '2px' },
  englishPrompt: { fontSize: '20px', color: 'var(--text)' },
  hint: {
    fontSize: '14px', color: 'var(--text-dim)', fontFamily: 'monospace',
    letterSpacing: '2px',
  },
  form: { display: 'flex', gap: '6px' },
  input: {
    flex: 1, padding: '10px 14px', fontSize: '16px', fontFamily: 'var(--font-body)',
    background: 'var(--bg)', border: '2px solid var(--accent)', color: 'var(--text)',
    borderRadius: '2px', outline: 'none',
  },
  submitBtn: {
    padding: '10px 14px', background: 'var(--accent)', border: 'none',
    color: 'var(--bg)', cursor: 'pointer', borderRadius: '2px', fontSize: '16px',
  },

  feedback: {
    padding: '12px', borderRadius: '2px', border: '1px solid',
    textAlign: 'center',
  },
  score: { textAlign: 'center' },
}
