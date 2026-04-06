import { useState, useEffect, useCallback, useRef } from 'react'
import { SCRIPTURE_PASSAGES } from '../../data/minigameData'
import { useGameStore } from '../../store/gameStore'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Generates a flat list of question exercises from random passages.
 * Higher difficulty → more questions pulled from more passages.
 */
function generateQuestions(difficulty, seenPassages = []) {
  const numPassages = difficulty >= 3 ? 3 : 2
  const seenSet = new Set(seenPassages)
  // Sort unseen passages first, then shuffle within each group
  const unseen = shuffleArray(SCRIPTURE_PASSAGES.filter((p) => !seenSet.has(p.ref)))
  const seen = shuffleArray(SCRIPTURE_PASSAGES.filter((p) => seenSet.has(p.ref)))
  const pool = [...unseen, ...seen].slice(0, numPassages)

  const exercises = []
  for (const passage of pool) {
    const qs = shuffleArray([...passage.questions])
    const take = Math.min(qs.length, difficulty >= 2 ? 3 : 2)
    for (let i = 0; i < take; i++) {
      exercises.push({
        passage: passage.text,
        ref: passage.ref,
        question: qs[i].q,
        answer: qs[i].a,
        options: shuffleArray([...qs[i].options]),
      })
    }
  }
  return exercises
}

export default function ScriptureQuiz({ difficulty, onScore, finishEarly, isActive }) {
  const seenPassages = useGameStore((s) => s.seenPassages)
  const markPassageSeen = useGameStore((s) => s.markPassageSeen)
  const [exercises] = useState(() => generateQuestions(difficulty, seenPassages))
  const total = exercises.length
  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [phase, setPhase] = useState('read') // 'read' | 'quiz' | 'feedback'
  const [selected, setSelected] = useState(null)
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false)
  const timer = useRef(null)

  const ex = exercises[idx]

  // Auto-advance from read → quiz after 4s, or user can tap
  useEffect(() => {
    if (phase !== 'read' || !isActive) return
    const t = setTimeout(() => setPhase('quiz'), 4000)
    return () => clearTimeout(t)
  }, [phase, isActive, idx])

  const advance = useCallback((wasCorrect) => {
    const newCorrect = wasCorrect ? correct + 1 : correct
    const newStreak = wasCorrect ? streak + 1 : 0
    setCorrect(newCorrect)
    setStreak(newStreak)
    setIsCorrectAnswer(wasCorrect)
    setPhase('feedback')
    onScore(newCorrect, total)
    markPassageSeen(exercises[idx].ref)

    timer.current = setTimeout(() => {
      const next = idx + 1
      if (next >= total) {
        finishEarly(newCorrect, total)
      } else {
        setIdx(next)
        setPhase('read')
        setSelected(null)
      }
    }, 700)
  }, [correct, streak, idx, total, onScore, finishEarly, exercises, markPassageSeen])

  useEffect(() => {
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [])

  const handleTap = (option) => {
    if (phase !== 'quiz' || !isActive || selected !== null) return
    setSelected(option)
    advance(option === ex.answer)
  }

  if (!ex) return null

  return (
    <div className="scripture-drill">
      {/* Progress bar */}
      <div className="lang-progress-bar">
        <div
          className="lang-progress-fill scripture"
          style={{ width: `${(idx / total) * 100}%` }}
        />
      </div>

      {streak >= 2 && (
        <div className="lang-streak">{streak} in a row!</div>
      )}

      {/* Passage snippet — always visible so there's no slow read phase */}
      <div className="scripture-passage-card" onClick={() => phase === 'read' && setPhase('quiz')}>
        <div className="scripture-text">{ex.passage}</div>
        <div className="scripture-ref">{ex.ref}</div>
        {phase === 'read' && (
          <div className="scripture-tap-hint">Tap when ready</div>
        )}
      </div>

      {/* Question + options */}
      {phase !== 'read' && (
        <>
          <div className="scripture-question-text">{ex.question}</div>
          <div className="lang-options">
            {ex.options.map((opt) => {
              let cls = 'lang-option'
              if (phase === 'feedback') {
                if (opt === ex.answer) cls += ' correct'
                else if (opt === selected) cls += ' wrong'
              }
              return (
                <button key={opt} className={cls} onClick={() => handleTap(opt)} disabled={phase === 'feedback'}>
                  {opt}
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* Feedback banner */}
      {phase === 'feedback' && (
        <div className={`lang-feedback ${isCorrectAnswer ? 'correct' : 'wrong'}`}>
          {isCorrectAnswer ? 'Correct!' : `Answer: ${ex.answer}`}
        </div>
      )}
    </div>
  )
}
