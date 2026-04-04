import { useState, useEffect } from 'react'
import { SCRIPTURE_PASSAGES } from '../../data/minigameData'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ScriptureQuiz({ difficulty, onScore, finishEarly, isActive }) {
  const readTime = Math.max(6, 10 - difficulty * 2)
  const [passage] = useState(() => {
    return shuffleArray([...SCRIPTURE_PASSAGES])[0]
  })

  const [phase, setPhase] = useState('read') // 'read' | 'quiz'
  const [readTimer, setReadTimer] = useState(readTime)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState([])

  const totalQuestions = passage.questions.length

  // Read phase countdown
  useEffect(() => {
    if (phase !== 'read' || !isActive) return
    if (readTimer <= 0) {
      setPhase('quiz')
      return
    }
    const timer = setInterval(() => setReadTimer((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [phase, readTimer, isActive])

  // Shuffle options when question changes
  useEffect(() => {
    if (phase === 'quiz' && passage.questions[questionIdx]) {
      setShuffledOptions(shuffleArray([...passage.questions[questionIdx].options]))
    }
  }, [phase, questionIdx, passage.questions])

  const handleReady = () => {
    setPhase('quiz')
  }

  const handleTap = (answer) => {
    if (feedback || !isActive || selected !== null) return
    setSelected(answer)

    const isCorrect = answer === passage.questions[questionIdx].a
    const newCorrect = isCorrect ? correct + 1 : correct
    setCorrect(newCorrect)
    setFeedback(true)
    onScore(newCorrect, totalQuestions)

    setTimeout(() => {
      const nextQ = questionIdx + 1
      if (nextQ >= totalQuestions) {
        finishEarly(newCorrect, totalQuestions)
      } else {
        setQuestionIdx(nextQ)
        setSelected(null)
        setFeedback(false)
      }
    }, 800)
  }

  return (
    <div className="scripture-game">
      {phase === 'read' && (
        <>
          <div className="scripture-passage">{passage.text}</div>
          <div className="scripture-read-timer">
            {readTimer > 0 ? `${readTimer}s to read` : 'Time\'s up!'}
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-md)' }}
            onClick={handleReady}
          >
            I'm Ready
          </button>
        </>
      )}

      {phase === 'quiz' && passage.questions[questionIdx] && (
        <>
          <div className="mg-progress">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`mg-dot ${i < questionIdx ? 'done' : ''} ${i === questionIdx ? 'current' : ''}`}
              />
            ))}
          </div>

          <div className="scripture-question">
            {passage.questions[questionIdx].q}
          </div>

          <div className="scripture-options">
            {shuffledOptions.map((opt) => {
              let cls = 'scripture-option'
              if (feedback) {
                if (opt === passage.questions[questionIdx].a) cls += ' correct'
                else if (opt === selected) cls += ' wrong'
              }
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => handleTap(opt)}
                  disabled={feedback}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
