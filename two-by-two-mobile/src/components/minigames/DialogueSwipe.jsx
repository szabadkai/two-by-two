import { useState, useEffect, useCallback } from 'react'
import { CONTACT_DIALOGUES } from '../../data/minigameData'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function DialogueSwipe({ difficulty, onScore, finishEarly, isActive }) {
  const [dialogue] = useState(() => {
    const pool = shuffleArray([...CONTACT_DIALOGUES])
    return pool[0]
  })

  const baseTime = Math.max(3, 6 - difficulty)
  const [exchangeIdx, setExchangeIdx] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [countdown, setCountdown] = useState(baseTime)
  const [phase, setPhase] = useState('choose') // 'choose' | 'feedback'
  const [selected, setSelected] = useState(null)
  const totalExchanges = dialogue.exchanges.length

  // Countdown timer per exchange
  useEffect(() => {
    if (phase !== 'choose' || !isActive) return
    if (countdown <= 0) {
      // Time's up, worst option auto-selected
      handleTap(-1)
      return
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown, phase, isActive]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTap = (optionIdx) => {
    if (phase !== 'choose' || selected !== null) return
    setSelected(optionIdx)

    const exchange = dialogue.exchanges[exchangeIdx]
    const score = optionIdx >= 0 ? exchange.options[optionIdx].score : 0
    const newTotal = totalScore + score
    setTotalScore(newTotal)
    setPhase('feedback')

    const maxPossible = totalExchanges // max 1 per exchange
    onScore(newTotal, maxPossible)

    setTimeout(() => {
      const nextIdx = exchangeIdx + 1
      if (nextIdx >= totalExchanges) {
        finishEarly(newTotal, maxPossible)
      } else {
        setExchangeIdx(nextIdx)
        setCountdown(baseTime)
        setPhase('choose')
        setSelected(null)
      }
    }, 1000)
  }

  const exchange = dialogue.exchanges[exchangeIdx]
  if (!exchange) return null

  return (
    <div className="dialogue-game">
      <div className="mg-progress">
        {Array.from({ length: totalExchanges }).map((_, i) => (
          <div
            key={i}
            className={`mg-dot ${i < exchangeIdx ? 'done' : ''} ${i === exchangeIdx ? 'current' : ''}`}
          />
        ))}
      </div>

      {/* NPC info */}
      <div className="dialogue-npc">
        <div className="dialogue-npc-name">{dialogue.npcName}</div>
        <div className="dialogue-npc-mood">{dialogue.npcMood}</div>
      </div>

      {/* NPC speech bubble */}
      <div className="dialogue-bubble">
        <div className="dialogue-text">{exchange.npcText}</div>
      </div>

      {/* Countdown */}
      {phase === 'choose' && (
        <div className="dialogue-countdown">
          <div
            className="dialogue-countdown-bar"
            style={{
              width: `${(countdown / baseTime) * 100}%`,
              background: countdown <= 2 ? 'var(--danger)' : 'var(--accent)',
            }}
          />
        </div>
      )}

      {/* Response options */}
      <div className="dialogue-options">
        {exchange.options.map((opt, i) => {
          let cls = 'dialogue-option'
          if (phase === 'feedback') {
            if (opt.score === 1) cls += ' best'
            else if (i === selected && opt.score === 0) cls += ' worst'
            else if (i === selected) cls += ' mid'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleTap(i)}
              disabled={phase === 'feedback'}
            >
              {opt.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
