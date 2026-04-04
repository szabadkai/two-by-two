import { useState, useEffect, useCallback } from 'react'
import { INVESTIGATOR_CONCERNS, SCRIPTURE_CARDS } from '../../data/minigameData'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ConcernMatch({ difficulty, onScore, finishEarly, isActive }) {
  const totalRounds = difficulty >= 3 ? 5 : 3
  const numOptions = Math.min(4, 2 + difficulty)

  const [round, setRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [phase, setPhase] = useState('choose') // 'choose' | 'feedback'
  const [selected, setSelected] = useState(null)
  const [concerns] = useState(() => shuffleArray([...INVESTIGATOR_CONCERNS]).slice(0, totalRounds))
  const [options, setOptions] = useState([])

  const setupRound = useCallback(
    (idx) => {
      if (idx >= concerns.length) return
      const concern = concerns[idx]
      const correctKey = concern.correctCard
      const allKeys = Object.keys(SCRIPTURE_CARDS).filter((k) => k !== correctKey)
      const distractors = shuffleArray(allKeys).slice(0, numOptions - 1)
      setOptions(shuffleArray([correctKey, ...distractors]))
      setPhase('choose')
      setSelected(null)
    },
    [concerns, numOptions]
  )

  useEffect(() => {
    setupRound(0)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTap = (key) => {
    if (phase !== 'choose' || !isActive || selected !== null) return
    setSelected(key)

    const isCorrect = key === concerns[round].correctCard
    const newCorrect = isCorrect ? correct + 1 : correct
    setCorrect(newCorrect)
    setPhase('feedback')
    onScore(newCorrect, totalRounds)

    setTimeout(() => {
      const nextRound = round + 1
      if (nextRound >= totalRounds) {
        finishEarly(newCorrect, totalRounds)
      } else {
        setRound(nextRound)
        setupRound(nextRound)
      }
    }, 1000)
  }

  if (!concerns[round]) return null

  const currentConcern = concerns[round]

  return (
    <div className="concern-game">
      <div className="mg-progress">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div
            key={i}
            className={`mg-dot ${i < round ? 'done' : ''} ${i === round ? 'current' : ''}`}
          />
        ))}
      </div>

      {/* Investigator concern bubble */}
      <div className="concern-bubble">
        <div className="concern-speaker">Investigator</div>
        <div className="concern-text">"{currentConcern.concern}"</div>
      </div>

      {/* Response cards */}
      <div className="concern-options">
        {options.map((key) => {
          const card = SCRIPTURE_CARDS[key]
          let cls = 'concern-card'
          if (phase === 'feedback') {
            if (key === currentConcern.correctCard) cls += ' correct'
            else if (key === selected) cls += ' wrong'
          }
          return (
            <button
              key={key}
              className={cls}
              onClick={() => handleTap(key)}
              disabled={phase === 'feedback'}
            >
              <div className="concern-card-title">{card.label}</div>
              <div className="concern-card-desc">{card.description}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
