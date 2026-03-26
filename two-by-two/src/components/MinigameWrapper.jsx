import { useState, useEffect, useCallback } from 'react'

/**
 * Shared wrapper for all minigames.
 * Provides timer, score display, and result screen.
 */
export default function MinigameWrapper({
  title,
  duration, // seconds
  children, // render prop: (onScore, timeLeft, isActive) => JSX
  onComplete, // called with final score 0.0-1.0
  onCancel,
}) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(1)
  const [isActive, setIsActive] = useState(true)
  const [showResult, setShowResult] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (!isActive) return
    if (timeLeft <= 0) {
      setIsActive(false)
      setShowResult(true)
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(t => {
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

  // Score reporting from minigame child
  const reportScore = useCallback((earned, total) => {
    setScore(earned)
    setMaxScore(total)
  }, [])

  // Early finish (minigame completed before timer)
  const finishEarly = useCallback((earned, total) => {
    setScore(earned)
    setMaxScore(total)
    setIsActive(false)
    setShowResult(true)
  }, [])

  const finalScore = maxScore > 0 ? Math.min(1, score / maxScore) : 0

  // Rating
  const getRating = (s) => {
    if (s >= 0.9) return { text: 'EXCELLENT', color: 'var(--success)' }
    if (s >= 0.7) return { text: 'GOOD', color: 'var(--accent-bright)' }
    if (s >= 0.4) return { text: 'OKAY', color: 'var(--budget)' }
    if (s >= 0.2) return { text: 'POOR', color: 'var(--danger)' }
    return { text: 'FUMBLE', color: 'var(--danger)' }
  }

  const rating = getRating(finalScore)

  // Timer bar color
  const timerColor = timeLeft > duration * 0.5
    ? 'var(--success)'
    : timeLeft > duration * 0.25
      ? 'var(--budget)'
      : 'var(--danger)'

  return (
    <div data-overlay style={styles.overlay}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <span className="pixel-font" style={styles.title}>{title}</span>
          <div style={styles.timerContainer}>
            <div style={styles.timerBar}>
              <div style={{
                ...styles.timerFill,
                width: `${(timeLeft / duration) * 100}%`,
                background: timerColor,
              }} />
            </div>
            <span className="pixel-font" style={{ ...styles.timerText, color: timerColor }}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Minigame Content */}
        {!showResult && (
          <div style={styles.gameArea}>
            {children({ onScore: reportScore, finishEarly, timeLeft, isActive })}
          </div>
        )}

        {/* Result Screen */}
        {showResult && (
          <div className="fade-in" style={styles.result}>
            <span className="pixel-font" style={{ ...styles.ratingText, color: rating.color }}>
              {rating.text}
            </span>
            <div style={styles.scoreBar}>
              <div style={{
                ...styles.scoreFill,
                width: `${finalScore * 100}%`,
                background: rating.color,
              }} />
            </div>
            <span style={styles.scoreText}>
              Score: {score}/{maxScore} ({Math.round(finalScore * 100)}%)
            </span>
            <button
              className="primary"
              onClick={() => onComplete(finalScore)}
              style={styles.doneBtn}
            >
              Continue
            </button>
          </div>
        )}

        {/* Cancel button (only during gameplay) */}
        {!showResult && (
          <button onClick={onCancel} style={styles.cancelBtn}>
            <span className="pixel-font">Skip (score 0)</span>
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: '16px',
  },
  container: {
    maxWidth: '520px',
    width: '100%',
    background: 'var(--panel)',
    border: '2px solid var(--border-light)',
    borderRadius: '2px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--panel-light)',
  },
  title: {
    fontSize: '11px',
    color: 'var(--accent-bright)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  timerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  timerBar: {
    width: '60px',
    height: '6px',
    background: 'var(--bg)',
    borderRadius: '1px',
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    transition: 'width 1s linear',
    borderRadius: '1px',
  },
  timerText: {
    fontSize: '10px',
  },
  gameArea: {
    padding: '16px',
    minHeight: '250px',
    display: 'flex',
    flexDirection: 'column',
  },
  result: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  ratingText: {
    fontSize: '18px',
    letterSpacing: '3px',
  },
  scoreBar: {
    width: '100%',
    height: '8px',
    background: 'var(--bg)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.5s',
  },
  scoreText: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  doneBtn: {
    marginTop: '8px',
    padding: '8px 32px',
    fontSize: '12px',
  },
  cancelBtn: {
    alignSelf: 'center',
    padding: '6px 16px',
    margin: '8px',
    background: 'none',
    border: '1px solid var(--border)',
    color: 'var(--text-dim)',
    cursor: 'pointer',
    fontSize: '9px',
    borderRadius: '2px',
  },
}
