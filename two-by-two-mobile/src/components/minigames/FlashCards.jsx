import { useState, useEffect, useCallback, useRef } from 'react'
import { HUNGARIAN_WORDS, ARRANGE_SENTENCES, FILL_HUNGARIAN } from '../../data/minigameData'
import { useGameStore } from '../../store/gameStore'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistractors(correct, pool, count = 3) {
  const filtered = pool.filter((w) => w.en !== correct.en)
  return shuffleArray(filtered).slice(0, count).map((w) => w.en)
}

function pickReverseDistractors(correct, pool, count = 3) {
  const filtered = pool.filter((w) => w.hu !== correct.hu)
  return shuffleArray(filtered).slice(0, count).map((w) => w.hu)
}

/**
 * Pick words prioritizing mastery progression:
 * ~60% new/seen (mastery 0-1), ~30% learning (2), ~10% review (3)
 * Falls back to whatever is available if a bucket is empty.
 */
function pickWordsByMastery(allWords, mastery, count) {
  const buckets = { fresh: [], learning: [], mastered: [] }
  for (const w of allWords) {
    const m = mastery[w.hu] || 0
    if (m <= 1) buckets.fresh.push(w)
    else if (m === 2) buckets.learning.push(w)
    else buckets.mastered.push(w)
  }
  // Shuffle each bucket
  for (const k of Object.keys(buckets)) buckets[k] = shuffleArray(buckets[k])

  const targets = { fresh: Math.ceil(count * 0.6), learning: Math.ceil(count * 0.3), mastered: count }
  const result = []

  // Pull from each bucket up to target, then fill from others
  for (const key of ['fresh', 'learning', 'mastered']) {
    const take = Math.min(targets[key] - result.length, buckets[key].length)
    if (take > 0) result.push(...buckets[key].splice(0, take))
    if (result.length >= count) break
  }
  // If still short, pull from any bucket
  if (result.length < count) {
    const remainder = [...buckets.fresh, ...buckets.learning, ...buckets.mastered]
    result.push(...remainder.slice(0, count - result.length))
  }
  return shuffleArray(result.slice(0, count))
}

/**
 * Exercise types:
 * 'translate'     → Show Hungarian, pick English (MCQ)
 * 'reverse'       → Show English, pick Hungarian (MCQ)
 * 'arrange'       → Show English, tap Hungarian words in order
 * 'fill'          → Fill in the blank in Hungarian sentence
 */
function generateExercises(difficulty, mastery) {
  const tier = Math.min(difficulty, HUNGARIAN_WORDS.length - 1)
  const allWords = HUNGARIAN_WORDS.slice(0, tier + 1).flat()
  const totalRounds = difficulty >= 3 ? 10 : 8

  const wordPool = pickWordsByMastery(allWords, mastery, totalRounds)
  const arrangeSentences = shuffleArray(ARRANGE_SENTENCES.filter((s) => s.diff <= tier))
  const fillSentences = shuffleArray(FILL_HUNGARIAN.filter((s) => s.diff <= tier))

  const exercises = []
  let wi = 0, ai = 0, fi = 0

  for (let r = 0; r < totalRounds; r++) {
    const typeRoll = r % 4

    if (typeRoll === 0 && wi < wordPool.length) {
      const word = wordPool[wi++]
      const distractors = pickDistractors(word, allWords)
      exercises.push({
        type: 'translate', hu: word.hu,
        prompt: word.hu, answer: word.en,
        options: shuffleArray([word.en, ...distractors]),
      })
    } else if (typeRoll === 1 && wi < wordPool.length) {
      const word = wordPool[wi++]
      const distractors = pickReverseDistractors(word, allWords)
      exercises.push({
        type: 'reverse', hu: word.hu,
        prompt: word.en, answer: word.hu,
        options: shuffleArray([word.hu, ...distractors]),
      })
    } else if (typeRoll === 2 && ai < arrangeSentences.length) {
      const sent = arrangeSentences[ai++]
      exercises.push({
        type: 'arrange', hu: sent.hu[0],
        prompt: sent.en, words: shuffleArray([...sent.hu]), answer: sent.hu,
      })
    } else if (typeRoll === 3 && fi < fillSentences.length) {
      const fill = fillSentences[fi++]
      exercises.push({
        type: 'fill', hu: fill.blank,
        sentence: fill.sentence, answer: fill.blank,
        options: shuffleArray([...fill.options]), hint: fill.en,
      })
    } else {
      const word = allWords[Math.floor(Math.random() * allWords.length)]
      const distractors = pickDistractors(word, allWords)
      exercises.push({
        type: 'translate', hu: word.hu,
        prompt: word.hu, answer: word.en,
        options: shuffleArray([word.en, ...distractors]),
      })
    }
  }

  return exercises
}

export default function FlashCards({ difficulty, onScore, finishEarly, isActive }) {
  const wordMastery = useGameStore((s) => s.wordMastery)
  const updateWordMastery = useGameStore((s) => s.updateWordMastery)
  const [exercises] = useState(() => generateExercises(difficulty, wordMastery))
  const totalRounds = exercises.length
  const [round, setRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [phase, setPhase] = useState('active') // 'active' | 'feedback'
  const [selected, setSelected] = useState(null)
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false)
  // Arrange-specific state
  const [arrangeSelected, setArrangeSelected] = useState([])
  const feedbackTimer = useRef(null)

  const ex = exercises[round]

  const advance = useCallback((wasCorrect) => {
    const newCorrect = wasCorrect ? correct + 1 : correct
    const newStreak = wasCorrect ? streak + 1 : 0
    setCorrect(newCorrect)
    setStreak(newStreak)
    setIsCorrectAnswer(wasCorrect)
    setPhase('feedback')
    onScore(newCorrect, totalRounds)
    updateWordMastery([{ hu: exercises[round].hu, correct: wasCorrect }])

    feedbackTimer.current = setTimeout(() => {
      const nextRound = round + 1
      if (nextRound >= totalRounds) {
        finishEarly(newCorrect, totalRounds)
      } else {
        setRound(nextRound)
        setPhase('active')
        setSelected(null)
        setArrangeSelected([])
      }
    }, 600)
  }, [correct, streak, round, totalRounds, onScore, finishEarly, exercises, updateWordMastery])

  useEffect(() => {
    return () => { if (feedbackTimer.current) clearTimeout(feedbackTimer.current) }
  }, [])

  // ── MCQ tap (translate / reverse / fill) ──
  const handleOptionTap = (option) => {
    if (phase !== 'active' || !isActive || selected !== null) return
    setSelected(option)
    advance(option === ex.answer)
  }

  // ── Arrange tap ──
  const handleArrangeTap = (word, idx) => {
    if (phase !== 'active' || !isActive) return
    const next = [...arrangeSelected, { word, idx }]
    setArrangeSelected(next)

    if (next.length === ex.words.length) {
      const built = next.map((w) => w.word)
      const isRight = built.join(' ') === ex.answer.join(' ')
      advance(isRight)
    }
  }

  const handleArrangeUndo = () => {
    if (phase !== 'active' || arrangeSelected.length === 0) return
    setArrangeSelected(arrangeSelected.slice(0, -1))
  }

  if (!ex) return null

  const usedArrangeIndices = new Set(arrangeSelected.map((w) => w.idx))

  return (
    <div className="lang-drill">
      {/* Progress bar (Duolingo-style) */}
      <div className="lang-progress-bar">
        <div
          className="lang-progress-fill"
          style={{ width: `${(round / totalRounds) * 100}%` }}
        />
      </div>

      {/* Streak indicator */}
      {streak >= 2 && (
        <div className="lang-streak">
          {streak} in a row!
        </div>
      )}

      {/* ── TRANSLATE: hu → en ── */}
      {ex.type === 'translate' && (
        <>
          <div className="lang-instruction">What does this mean?</div>
          <div className="lang-prompt-card">{ex.prompt}</div>
          <div className="lang-options">
            {ex.options.map((opt) => {
              let cls = 'lang-option'
              if (phase === 'feedback') {
                if (opt === ex.answer) cls += ' correct'
                else if (opt === selected) cls += ' wrong'
              }
              return (
                <button key={opt} className={cls} onClick={() => handleOptionTap(opt)} disabled={phase === 'feedback'}>
                  {opt}
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* ── REVERSE: en → hu ── */}
      {ex.type === 'reverse' && (
        <>
          <div className="lang-instruction">How do you say this in Hungarian?</div>
          <div className="lang-prompt-card en">{ex.prompt}</div>
          <div className="lang-options">
            {ex.options.map((opt) => {
              let cls = 'lang-option'
              if (phase === 'feedback') {
                if (opt === ex.answer) cls += ' correct'
                else if (opt === selected) cls += ' wrong'
              }
              return (
                <button key={opt} className={cls} onClick={() => handleOptionTap(opt)} disabled={phase === 'feedback'}>
                  {opt}
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* ── ARRANGE: tap words in order ── */}
      {ex.type === 'arrange' && (
        <>
          <div className="lang-instruction">Put the words in order</div>
          <div className="lang-prompt-card en">{ex.prompt}</div>

          {/* Built sentence area */}
          <div className="lang-arrange-built" onClick={handleArrangeUndo}>
            {arrangeSelected.length === 0
              ? <span className="lang-arrange-placeholder">Tap the words below...</span>
              : arrangeSelected.map((w, i) => (
                  <span key={i} className={`lang-arrange-word placed ${
                    phase === 'feedback' ? (isCorrectAnswer ? 'correct' : 'wrong') : ''
                  }`}>
                    {w.word}
                  </span>
                ))
            }
          </div>

          {/* Word bank */}
          <div className="lang-arrange-bank">
            {ex.words.map((word, idx) => (
              <button
                key={idx}
                className={`lang-arrange-word ${usedArrangeIndices.has(idx) ? 'used' : ''}`}
                onClick={() => handleArrangeTap(word, idx)}
                disabled={usedArrangeIndices.has(idx) || phase === 'feedback'}
              >
                {word}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── FILL: fill in the blank ── */}
      {ex.type === 'fill' && (
        <>
          <div className="lang-instruction">Complete the sentence</div>
          <div className="lang-fill-sentence">{ex.sentence}</div>
          <div className="lang-fill-hint">{ex.hint}</div>
          <div className="lang-options">
            {ex.options.map((opt) => {
              let cls = 'lang-option'
              if (phase === 'feedback') {
                if (opt === ex.answer) cls += ' correct'
                else if (opt === selected) cls += ' wrong'
              }
              return (
                <button key={opt} className={cls} onClick={() => handleOptionTap(opt)} disabled={phase === 'feedback'}>
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
          {isCorrectAnswer ? 'Correct!' : `Answer: ${ex.answer}${Array.isArray(ex.answer) ? '' : ''}`}
        </div>
      )}
    </div>
  )
}
