import { useState, useEffect, useCallback } from 'react'
import { FILL_BLANKS } from '../../data/minigameData'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function WordPick({ difficulty, onScore, finishEarly, isActive }) {
  const totalRounds = Math.min(difficulty >= 3 ? 8 : 6, FILL_BLANKS.length)

  const [round, setRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [phase, setPhase] = useState('choose') // 'choose' | 'feedback'
  const [selected, setSelected] = useState(null)
  const [questions] = useState(() => shuffleArray([...FILL_BLANKS]).slice(0, totalRounds))
  const [shuffledOptions, setShuffledOptions] = useState([])

  useEffect(() => {
    if (questions[round]) {
      setShuffledOptions(shuffleArray([...questions[round].options]))
    }
  }, [round, questions])

  const handleTap = (word) => {
    if (phase !== 'choose' || !isActive || selected !== null) return
    setSelected(word)

    const isCorrect = word === questions[round].blank
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
        setPhase('choose')
        setSelected(null)
      }
    }, 800)
  }

  const q = questions[round]
  if (!q) return null

  // Split sentence at blank
  const parts = q.sentence.split('___')

  return (
    <div className="wordpick-game">
      <div className="mg-progress">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div
            key={i}
            className={`mg-dot ${i < round ? 'done' : ''} ${i === round ? 'current' : ''}`}
          />
        ))}
      </div>

      {/* Sentence with blank */}
      <div className="wordpick-sentence">
        {parts[0]}
        <span className="wordpick-blank">
          {phase === 'feedback' ? questions[round].blank : '______'}
        </span>
        {parts[1]}
      </div>

      {/* Word options */}
      <div className="wordpick-options">
        {shuffledOptions.map((word) => {
          let cls = 'wordpick-option'
          if (phase === 'feedback') {
            if (word === q.blank) cls += ' correct'
            else if (word === selected) cls += ' wrong'
          }
          return (
            <button
              key={word}
              className={cls}
              onClick={() => handleTap(word)}
              disabled={phase === 'feedback'}
            >
              {word}
            </button>
          )
        })}
      </div>
    </div>
  )
}
