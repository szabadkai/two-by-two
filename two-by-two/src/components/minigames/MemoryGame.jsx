import { useState, useEffect, useCallback, useRef } from 'react'
import { MEMORY_PAIRS } from '../../data/minigameData'
import { useFocusNavigation } from '../../utils/focusManager'

/**
 * Companion Study Minigame: Match pairs of scripture reference cards.
 */
export default function MemoryGame({ difficulty, onScore, finishEarly, isActive }) {
  const numPairs = Math.min(4 + difficulty, 8)
  const [cards, setCards] = useState(() => {
    const pairs = shuffle(MEMORY_PAIRS).slice(0, numPairs)
    const deck = pairs.flatMap(p => [
      { id: `${p.id}-a`, pairId: p.id, text: p.text, type: 'word' },
      { id: `${p.id}-b`, pairId: p.id, text: p.text, type: 'match' },
    ])
    return shuffle(deck).map(c => ({ ...c, revealed: false, matched: false }))
  })
  const [selected, setSelected] = useState([])
  const [matches, setMatches] = useState(0)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    onScore(matches, numPairs)
  }, [matches, numPairs, onScore])

  const handleCardClick = useCallback((index) => {
    if (!isActive) return
    if (selected.length >= 2) return
    if (cards[index].revealed || cards[index].matched) return

    const newCards = [...cards]
    newCards[index] = { ...newCards[index], revealed: true }
    setCards(newCards)

    const newSelected = [...selected, index]
    setSelected(newSelected)

    if (newSelected.length === 2) {
      setAttempts(a => a + 1)
      const [first, second] = newSelected
      const card1 = newCards[first]
      const card2 = newCards[second]

      if (card1.pairId === card2.pairId && first !== second) {
        // Match!
        setTimeout(() => {
          const matched = newCards.map((c, i) =>
            i === first || i === second ? { ...c, matched: true } : c
          )
          setCards(matched)
          setSelected([])
          const newMatches = matches + 1
          setMatches(newMatches)
          if (newMatches >= numPairs) {
            finishEarly(newMatches, numPairs)
          }
        }, 400)
      } else {
        // No match — flip back
        setTimeout(() => {
          const flipped = newCards.map((c, i) =>
            i === first || i === second ? { ...c, revealed: false } : c
          )
          setCards(flipped)
          setSelected([])
        }, 800)
      }
    }
  }, [isActive, cards, selected, matches, numPairs, finishEarly])

  const cardRefs = useRef([])
  const cols = numPairs <= 4 ? 4 : numPairs <= 6 ? 4 : 4
  const rows = Math.ceil(cards.length / cols)
  const { focusedIndex, handleKeyDown } = useFocusNavigation(
    cardRefs.current,
    'grid',
    { rows, cols }
  )

  return (
    <div style={styles.container}>
      <div style={styles.info}>
        <span className="pixel-font" style={styles.label}>
          PAIRS: {matches}/{numPairs}
        </span>
        <span style={styles.attempts}>
          Attempts: {attempts}
        </span>
      </div>

      <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${cols}, 1fr)` }} onKeyDown={handleKeyDown}>
        {cards.map((card, i) => (
          <button
            key={card.id}
            ref={el => cardRefs.current[i] = el}
            tabIndex={i === 0 ? 0 : -1}
            onClick={() => handleCardClick(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCardClick(i)
              }
            }}
            style={{
              ...styles.card,
              background: card.matched
                ? 'var(--success)'
                : card.revealed
                  ? 'var(--accent)'
                  : 'var(--panel-light)',
              color: card.matched || card.revealed ? 'var(--bg)' : 'var(--text-dim)',
              borderColor: card.matched
                ? 'var(--success)'
                : card.revealed
                  ? 'var(--accent-bright)'
                  : 'var(--border)',
              cursor: card.matched ? 'default' : 'pointer',
              opacity: card.matched ? 0.6 : 1,
            }}
          >
            <span className="pixel-font" style={styles.cardText}>
              {card.revealed || card.matched ? card.text : '?'}
            </span>
          </button>
        ))}
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
  info: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: '10px', color: 'var(--accent)' },
  attempts: { fontSize: '10px', color: 'var(--text-dim)' },
  grid: { display: 'grid', gap: '6px' },
  card: {
    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid', borderRadius: '2px', transition: 'all 0.2s',
    minHeight: '48px',
  },
  cardText: { fontSize: '9px', textAlign: 'center' },
}
