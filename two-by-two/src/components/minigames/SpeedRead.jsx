import { useState, useEffect, useCallback } from 'react'
import { SCRIPTURE_PASSAGES } from '../../data/minigameData'

/**
 * Personal Study Minigame: Read a scripture passage, then answer comprehension questions.
 */
export default function SpeedRead({ difficulty, onScore, finishEarly, isActive }) {
  const [passage] = useState(() =>
    SCRIPTURE_PASSAGES[Math.floor(Math.random() * SCRIPTURE_PASSAGES.length)]
  )
  const [phase, setPhase] = useState('reading') // 'reading' | 'questions'
  const [questionIndex, setQuestionIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [readTimer, setReadTimer] = useState(Math.max(6, 10 - difficulty * 2))

  const total = passage.questions.length
  const currentQ = passage.questions[questionIndex]

  // Reading countdown
  useEffect(() => {
    if (phase !== 'reading' || !isActive) return
    if (readTimer <= 0) {
      setPhase('questions')
      return
    }
    const timer = setInterval(() => setReadTimer(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [phase, readTimer, isActive])

  useEffect(() => {
    onScore(correct, total)
  }, [correct, total, onScore])

  const skipToQuestions = useCallback(() => {
    setPhase('questions')
  }, [])

  const handleAnswer = useCallback((answer) => {
    if (!isActive || feedback) return

    const isCorrect = answer === currentQ.a

    if (isCorrect) {
      setCorrect(c => c + 1)
      setFeedback({ type: 'correct', text: 'Correct!' })
    } else {
      setFeedback({ type: 'wrong', text: `Answer: ${currentQ.a}` })
    }

    setTimeout(() => {
      setFeedback(null)
      if (questionIndex + 1 >= total) {
        const final = isCorrect ? correct + 1 : correct
        finishEarly(final, total)
      } else {
        setQuestionIndex(i => i + 1)
      }
    }, 800)
  }, [isActive, feedback, currentQ, questionIndex, total, correct, finishEarly])

  return (
    <div style={styles.container}>
      {phase === 'reading' && (
        <>
          <div style={styles.readHeader}>
            <span className="pixel-font" style={styles.readLabel}>READ CAREFULLY</span>
            <span className="pixel-font" style={{
              ...styles.readTimer,
              color: readTimer > 3 ? 'var(--accent)' : 'var(--danger)',
            }}>
              {readTimer}s
            </span>
          </div>
          <div style={styles.passage}>
            <p style={styles.passageText}>{passage.text}</p>
          </div>
          <button onClick={skipToQuestions} style={styles.skipBtn}>
            <span className="pixel-font">I'm ready — ask me</span>
          </button>
        </>
      )}

      {phase === 'questions' && currentQ && (
        <>
          <div style={styles.questionHeader}>
            <span className="pixel-font" style={styles.questionLabel}>
              QUESTION {questionIndex + 1}/{total}
            </span>
          </div>

          <div style={styles.question}>
            <p style={styles.questionText}>{currentQ.q}</p>
          </div>

          {!feedback && (
            <div style={styles.answers}>
              {currentQ.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  style={styles.answerBtn}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {feedback && (
            <div style={{
              ...styles.feedback,
              color: feedback.type === 'correct' ? 'var(--success)' : 'var(--danger)',
            }}>
              <span className="pixel-font">{feedback.text}</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '12px' },
  readHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  readLabel: { fontSize: '10px', color: 'var(--accent)', letterSpacing: '1px' },
  readTimer: { fontSize: '12px' },
  passage: {
    padding: '14px', background: 'var(--bg)', borderRadius: '2px',
    border: '1px solid var(--border)', maxHeight: '180px', overflow: 'auto',
  },
  passageText: { fontSize: '12px', color: 'var(--text)', lineHeight: 1.7 },
  skipBtn: {
    alignSelf: 'center', padding: '6px 16px', background: 'var(--panel-light)',
    border: '1px solid var(--accent)', color: 'var(--accent)', cursor: 'pointer',
    borderRadius: '2px', fontSize: '9px',
  },
  questionHeader: { textAlign: 'center' },
  questionLabel: { fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1px' },
  question: {
    padding: '14px', background: 'var(--bg)', borderRadius: '2px',
    border: '1px solid var(--border)', textAlign: 'center',
  },
  questionText: { fontSize: '14px', color: 'var(--text)' },
  answers: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  answerBtn: {
    padding: '10px', background: 'var(--panel-light)', border: '1px solid var(--border)',
    color: 'var(--text)', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-body)',
    borderRadius: '2px', textAlign: 'center',
  },
  feedback: { textAlign: 'center', fontSize: '11px', padding: '8px' },
}
