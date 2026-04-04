import { useState, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { PDAY_ACTIVITIES } from '../data/activities'
import { ACTIVITY_MINIGAME_MAP } from '../engine/minigameEngine'
import StatRow from '../components/StatRow'
import CompanionBanner from '../components/CompanionBanner'
import ActivityCard from '../components/ActivityCard'
import MinigameLauncher from '../components/MinigameLauncher'

export default function PDayView() {
  const week = useGameStore((s) => s.week)
  const schedule = useGameStore((s) => s.schedule)
  const setActivity = useGameStore((s) => s.setActivity)
  const endDay = useGameStore((s) => s.endDay)
  const stats = useGameStore((s) => s.stats)
  const setMinigameScore = useGameStore((s) => s.setMinigameScore)

  const [activeSlot, setActiveSlot] = useState('morning')
  const [pendingMinigame, setPendingMinigame] = useState(null)

  const SLOTS = ['morning', 'afternoon', 'evening']
  const SLOT_LABELS = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }
  const allFilled = SLOTS.every((s) => schedule[s] !== null)

  const handleMinigameComplete = useCallback((score) => {
    if (pendingMinigame) {
      setMinigameScore(pendingMinigame.slot, score)
      setPendingMinigame(null)
    }
  }, [pendingMinigame, setMinigameScore])

  const handleMinigameCancel = useCallback(() => {
    if (pendingMinigame) {
      setMinigameScore(pendingMinigame.slot, 0.4)
      setPendingMinigame(null)
    }
  }, [pendingMinigame, setMinigameScore])

  const handleSelect = (activityId) => {
    setActivity(activeSlot, activityId)

    const hasMinigame = ACTIVITY_MINIGAME_MAP[activityId]
    if (hasMinigame) {
      setPendingMinigame({ slot: activeSlot, activityId })
    } else {
      setMinigameScore(activeSlot, 0.6)
    }

    const next = SLOTS.find((s) => s !== activeSlot && !schedule[s])
    if (next) setActiveSlot(next)
  }

  const activities = Object.values(PDAY_ACTIVITIES)

  return (
    <div className="screen-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <h1>TWO BY TWO</h1>
        <div className="day-label">Week {week}</div>
      </div>

      <StatRow />

      <div className="pday-header">
        <h2>☀ P-Day</h2>
        <p>Your one free day. Choose wisely.</p>
      </div>

      {/* Slot tabs */}
      <div className="slot-tabs">
        {SLOTS.map((slot) => (
          <div
            key={slot}
            className={`slot-tab ${activeSlot === slot ? 'active' : ''} ${schedule[slot] ? 'filled' : ''}`}
            onClick={() => setActiveSlot(slot)}
          >
            <span className="label">{SLOT_LABELS[slot]}</span>
            <span className="chosen">
              {schedule[slot] ? PDAY_ACTIVITIES[schedule[slot]]?.label || '—' : '—'}
            </span>
          </div>
        ))}
      </div>

      <div className="scroll-area">
        <CompanionBanner />

        <div className="section-header">P-Day Activities · {SLOT_LABELS[activeSlot]}</div>
        <div className="activity-grid">
          {activities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              selected={schedule[activeSlot] === act.id}
              onSelect={() => handleSelect(act.id)}
            />
          ))}
        </div>
      </div>

      <div className="bottom-bar">
        <button
          className="btn btn-primary"
          disabled={!allFilled}
          onClick={endDay}
        >
          {allFilled ? 'End P-Day →' : `Fill ${SLOTS.filter(s => !schedule[s]).length} more slots`}
        </button>
      </div>

      {/* Minigame overlay */}
      {pendingMinigame && (
        <MinigameLauncher
          activityId={pendingMinigame.activityId}
          stats={stats}
          onComplete={handleMinigameComplete}
          onCancel={handleMinigameCancel}
        />
      )}
    </div>
  )
}
