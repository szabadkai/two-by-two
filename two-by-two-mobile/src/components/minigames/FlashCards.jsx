import { useState, useEffect, useCallback } from 'react'
import { HUNGARIAN_WORDS } from '../../data/minigameData'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistractors(correct, allWords, count = 3) {
  const pool = allWords.filter((w) => w.en !== correct.en)
  const shuffled = shuffleArray(pool)
  return shuffled.slice(0, count).map((w) => w.en)
}

export default function FlashCards({ difficulty, onScore, finishEarly, isActive }) {
  const tier = Math.min(difficulty, HUNGARIAN_WORDS.length - 1)
  // Pull words from current tier and below for variety
  const allWords = HUNGARIAN_WORDS.slice(0, tier + 1).flat()
  const tierWords = HUNGARIAN_WORDS[tier]

  const totalRounds = difficulty >= 3 ? 8 : 6
  const [round, setRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [phase, setPhase] = useState('show') // 'show' | 'quiz' | 'feedback'
  const [currentWord, setCurrentWord] = useState(null)
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [words] = useState(() => shuffleArray(tierWords).slice(0, totalRounds))

  const setupRound = useCallback(
    (idx) => {
      if (idx >= words.length) return
      const word = words[idx]
      setCurrentWord(word)
      setPhase('show')
      setSelected(null)

      const distractors = pickDistractors(word, allWords)
      setOptions(shuffleArray([word.en, ...distractors]))
    },
    [words, allWords]
  )

  useEffect(() => {
    setupRound(0)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-flip from show → quiz after 2 seconds
  useEffect(() => {
    if (phase !== 'show' || !isActive) return
    const timer = setTimeout(() => setPhase('quiz'), 2000)
    return () => clearTimeout(timer)
  }, [phase, isActive])

  // Handle tap on option
  const handleTap = (option) => {
    if (phase !== 'quiz' || !isActive || selected !== null) return
    setSelected(option)

    const isCorrect = option === currentWord.en
    const newCorrect = isCorrect ? correct + 1 : correct
    setCorrect(newCorrect)
    setPhase('feedback')

    // Report running score
    onScore(newCorrect, totalRounds)

    setTimeout(() => {
      const nextRound = round + 1
      if (nextRound >= totalRounds) {
        finishEarly(newCorrect, totalRounds)
      } else {
        setRound(nextRound)
        setupRound(nextRound)
      }
    }, 800)
  }

  if (!currentWord) return null

  return (
    <div className="flashcards-game">
      {/* Progress */}
      <div className="mg-progress">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div
            key={i}
            className={`mg-dot ${i < round ? 'done' : ''} ${i === round ? 'current' : ''}`}
          />
        ))}
      </div>

      {/* Card */}
      <div className={`flash-card ${phase}`}>
        <div className="flash-hungarian">{currentWord.hu}</div>
        {phase === 'show' && (
          <div className="flash-hint">
            {currentWord.en}
          </div>
        )}
        {phase !== 'show' && (
          <div className="flash-prompt">What does this mean?</div>
        )}
      </div>

      {/* Options grid (only in quiz/feedback phase) */}
      {phase !== 'show' && (
        <div className="flash-options">
          {options.map((opt) => {
            let cls = 'flash-option'
            if (phase === 'feedback') {
              if (opt === currentWord.en) cls += ' correct'
              else if (opt === selected) cls += ' wrong'
            } else if (opt === selected) {
              cls += ' selected'
            }
            return (
              <button
                key={opt}
                className={cls}
                onClick={() => handleTap(opt)}
                disabled={phase === 'feedback'}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
