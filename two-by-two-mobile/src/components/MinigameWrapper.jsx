import { useState, useEffect, useCallback } from 'react'

export default function MinigameWrapper({
  title,
  duration,
  children,
  onComplete,
  onCancel,
}) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(1)
  const [isActive, setIsActive] = useState(true)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsActive(false)
          setShowResult(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isActive, timeLeft])

  const reportScore = useCallback((earned, total) => {
    setScore(earned)
    setMaxScore(total)
  }, [])

  const finishEarly = useCallback((earned, total) => {
    setScore(earned)
    setMaxScore(total)
    setIsActive(false)
    setShowResult(true)
  }, [])

  const finalScore = maxScore > 0 ? Math.min(1, score / maxScore) : 0

  const getRating = (s) => {
    if (s >= 0.9) return { text: 'EXCELLENT', cls: 'excellent' }
    if (s >= 0.7) return { text: 'GOOD', cls: 'good' }
    if (s >= 0.4) return { text: 'OKAY', cls: 'okay' }
    if (s >= 0.2) return { text: 'POOR', cls: 'poor' }
    return { text: 'FUMBLE', cls: 'fumble' }
  }

  const rating = getRating(finalScore)
  const timerPct = (timeLeft / duration) * 100
  const timerCls = timeLeft > duration * 0.5 ? 'high' : timeLeft > duration * 0.25 ? 'mid' : 'low'

  return (
    <div className="minigame-overlay">
      <div className="minigame-sheet">
        {/* Header with timer */}
        <div className="mg-header">
          <span className="mg-title">{title}</span>
          {onCancel && isActive && (
            <button className="mg-cancel" onClick={onCancel}>✕</button>
          )}
        </div>

        <div className="mg-timer-row">
          <div className="mg-timer-bar">
            <div
              className={`mg-timer-fill ${timerCls}`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
          <span className={`mg-timer-text ${timerCls}`}>{timeLeft}s</span>
        </div>

        {/* Game area */}
        {!showResult && (
          <div className="mg-body">
            {typeof children === 'function'
              ? children({ onScore: reportScore, finishEarly, timeLeft, isActive })
              : children}
          </div>
        )}

        {/* Result screen */}
        {showResult && (
          <div className="mg-result">
            <div className={`mg-rating ${rating.cls}`}>{rating.text}</div>
            <div className="mg-score-display">
              {score} / {maxScore}
            </div>
            <div className="mg-score-bar">
              <div className="mg-score-fill" style={{ width: `${finalScore * 100}%` }} />
            </div>
            <button
              className="btn btn-primary"
              style={{ marginTop: 'var(--space-lg)', width: '100%' }}
              onClick={() => onComplete(finalScore)}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
