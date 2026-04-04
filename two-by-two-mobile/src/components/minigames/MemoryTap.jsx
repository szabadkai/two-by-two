import { useState, useEffect, useCallback } from 'react'
import { MEMORY_PAIRS } from '../../data/minigameData'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MemoryTap({ difficulty, onScore, finishEarly, isActive }) {
  const numPairs = Math.min(difficulty >= 3 ? 8 : difficulty >= 1 ? 6 : 4, MEMORY_PAIRS.length)

  const [cards, setCards] = useState(() => {
    const pairs = shuffleArray([...MEMORY_PAIRS]).slice(0, numPairs)
    // Create two cards per pair: one with id, one with text
    const deck = pairs.flatMap((p) => [
      { uid: `${p.id}-a`, pairId: p.id, display: p.id.toUpperCase(), type: 'id' },
      { uid: `${p.id}-b`, pairId: p.id, display: p.text, type: 'text' },
    ])
    return shuffleArray(deck)
  })

  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [matchCount, setMatchCount] = useState(0)
  const [locked, setLocked] = useState(false)

  const handleTap = useCallback(
    (uid) => {
      if (!isActive || locked) return
      if (matched.has(uid)) return
      if (flipped.includes(uid)) return
      if (flipped.length >= 2) return

      const newFlipped = [...flipped, uid]
      setFlipped(newFlipped)

      if (newFlipped.length === 2) {
        setLocked(true)
        const [first, second] = newFlipped
        const cardA = cards.find((c) => c.uid === first)
        const cardB = cards.find((c) => c.uid === second)

        if (cardA.pairId === cardB.pairId && cardA.type !== cardB.type) {
          // Match!
          const newMatchCount = matchCount + 1
          setMatchCount(newMatchCount)
          setMatched((prev) => new Set([...prev, first, second]))
          onScore(newMatchCount, numPairs)

          setTimeout(() => {
            setFlipped([])
            setLocked(false)
            if (newMatchCount >= numPairs) {
              finishEarly(newMatchCount, numPairs)
            }
          }, 400)
        } else {
          // No match — flip back
          setTimeout(() => {
            setFlipped([])
            setLocked(false)
          }, 800)
        }
      }
    },
    [isActive, locked, flipped, matched, cards, matchCount, numPairs, onScore, finishEarly]
  )

  // Grid layout: 3 columns for ≤6 pairs (12 cards), 4 columns for 8 pairs (16 cards)
  const cols = numPairs > 6 ? 4 : 3

  return (
    <div className="memory-game">
      <div className="mg-progress-text">
        {matchCount} / {numPairs} pairs
      </div>

      <div className="memory-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.uid)
          const isMatched = matched.has(card.uid)
          const cls = `memory-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`
          return (
            <button
              key={card.uid}
              className={cls}
              onClick={() => handleTap(card.uid)}
              disabled={isMatched}
            >
              <div className="memory-card-inner">
                <div className="memory-card-front">✟</div>
                <div className="memory-card-back">{card.display}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
