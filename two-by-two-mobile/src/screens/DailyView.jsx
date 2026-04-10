import { useState, useCallback, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { DAY_NAMES, DAY_NAMES_EN, TIME_SLOTS, TIME_SLOT_LABELS } from '../data/constants'
import { ACTIVITIES, getActivityDescription } from '../data/activities'
import { ACTIVITY_MINIGAME_MAP } from '../engine/minigameEngine'
import { getCompanionDialogue } from '../data/companionDialogue'
import { getCompanionMood } from '../engine/companionEngine'
import { pickVignette } from '../data/vignettes'
import StatRow from '../components/StatRow'
import CompanionBanner from '../components/CompanionBanner'
import MinigameLauncher from '../components/MinigameLauncher'
import FreeStudyButton from '../components/FreeStudyButton'
import PixelIcon from '../components/PixelIcon'
import GameCanvas from '../components/GameCanvas'

export default function DailyView() {
  const day = useGameStore((s) => s.day)
  const week = useGameStore((s) => s.week)
  const schedule = useGameStore((s) => s.schedule)
  const setActivity = useGameStore((s) => s.setActivity)
  const endDay = useGameStore((s) => s.endDay)
  const mandatoryActivity = useGameStore((s) => s.mandatoryActivity)
  const acceptMandatory = useGameStore((s) => s.acceptMandatory)
  const refuseMandatory = useGameStore((s) => s.refuseMandatory)
  const lastDayResult = useGameStore((s) => s.lastDayResult)
  const investigators = useGameStore((s) => s.investigators)
  const setVisitTarget = useGameStore((s) => s.setVisitTarget)
  const stats = useGameStore((s) => s.stats)
  const minigameScores = useGameStore((s) => s.minigameScores)
  const setMinigameScore = useGameStore((s) => s.setMinigameScore)
  const startTracting = useGameStore((s) => s.startTracting)
  const companion = useGameStore((s) => s.companion)
  const addToast = useGameStore((s) => s.addToast)

  const [activeSlot, setActiveSlot] = useState('morning')
  const [pendingMinigame, setPendingMinigame] = useState(null)
  const [showInvestigatorPicker, setShowInvestigatorPicker] = useState(false)
  const [vignetteText, setVignetteText] = useState(null)

  // Pick a new vignette whenever the day/week changes
  useEffect(() => {
    const state = useGameStore.getState()
    setVignetteText(pickVignette(state))
  }, [day, week])

  const isSlotLocked = (slot) => {
    return mandatoryActivity && mandatoryActivity.slot === slot && mandatoryActivity.accepted
  }

  const allFilled = TIME_SLOTS.every((s) => schedule[s] !== null || isSlotLocked(s))

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

  // Handle interaction from GameCanvas (player tapped on an activity in the map)
  const triggerBishopEvent = useGameStore((s) => s.triggerBishopEvent)
  const triggerMemberChat = useGameStore((s) => s.triggerMemberChat)

  const handleMapInteraction = useCallback((interaction) => {
    if (!interaction) return

    // Tram stop → start tracting flow
    if (interaction.type === 'tram') {
      startTracting(activeSlot)
      return
    }

    // Bishop's office → trigger bishop dialogue event
    if (interaction.type === 'bishop') {
      triggerBishopEvent()
      return
    }

    // Ward member → small fellowship chat (no slot cost)
    if (interaction.type === 'member') {
      triggerMemberChat(interaction.memberId)
      return
    }

    const activityId = interaction.activity
    if (!activityId) return

    // If visiting an investigator, check if we need a picker
    if ((activityId === 'visit_investigator' || activityId === 'teach_lesson')) {
      if (interaction.investigatorId) {
        setVisitTarget(interaction.investigatorId)
      } else if (investigators.filter(i => i.isActive && i.stage < 7).length > 1) {
        setShowInvestigatorPicker(activityId)
        return
      }
    }

    setActivity(activeSlot, activityId)

    // Show activity flavor text
    const activityData = ACTIVITIES[activityId]
    if (activityData) {
      const desc = getActivityDescription(activityData)
      addToast(desc, 'flavor')
    }

    // Companion comments on the activity
    if (companion) {
      const mood = getCompanionMood(companion.rapport)
      const line = getCompanionDialogue(companion, activityId, mood)
      if (line) addToast(`${companion.name}: "${line}"`, 'info')
    }

    const hasMinigame = ACTIVITY_MINIGAME_MAP[activityId]
    if (hasMinigame) {
      setPendingMinigame({ slot: activeSlot, activityId })
    } else {
      setMinigameScore(activeSlot, 0.6)
    }

    // Auto-advance to next empty slot
    const next = TIME_SLOTS.find((s) => s !== activeSlot && !schedule[s] && !isSlotLocked(s))
    if (next) setActiveSlot(next)
  }, [activeSlot, schedule, investigators, companion, setActivity, setMinigameScore, setVisitTarget, startTracting, triggerBishopEvent, triggerMemberChat, addToast])

  const handlePickInvestigator = (invId, activityId) => {
    setVisitTarget(invId)
    setActivity(activeSlot, activityId)

    const hasMinigame = ACTIVITY_MINIGAME_MAP[activityId]
    if (hasMinigame) {
      setPendingMinigame({ slot: activeSlot, activityId })
    } else {
      setMinigameScore(activeSlot, 0.6)
    }

    setShowInvestigatorPicker(false)
    const next = TIME_SLOTS.find((s) => s !== activeSlot && !schedule[s] && !isSlotLocked(s))
    if (next) setActiveSlot(next)
  }

  return (
    <div className="screen-enter daily-view" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top bar */}
      <div className="top-bar">
        <h1>TWO BY TWO</h1>
        <div style={{ textAlign: 'right' }}>
          <div className="day-label">{DAY_NAMES[day]} · {DAY_NAMES_EN[day]}</div>
          <div className="day-label">Week {week}</div>
        </div>
      </div>

      {/* Stats */}
      <StatRow />

      {/* Day-start vignette */}
      {vignetteText && (
        <div className="vignette-banner" onClick={() => setVignetteText(null)}>
          <span className="vignette-text">{vignetteText}</span>
        </div>
      )}

      {/* Time slot tabs */}
      <div className="slot-tabs">
        {TIME_SLOTS.map((slot) => {
          const locked = isSlotLocked(slot)
          const filled = schedule[slot] || locked
          return (
            <div
              key={slot}
              className={`slot-tab ${activeSlot === slot ? 'active' : ''} ${filled ? 'filled' : ''}`}
              onClick={() => !locked && setActiveSlot(slot)}
            >
              <span className="label">{TIME_SLOT_LABELS[slot]}</span>
              <span className="chosen">
                {locked
                  ? mandatoryActivity.label
                  : schedule[slot]
                    ? ACTIVITIES[schedule[slot]]?.label || schedule[slot]
                    : '—'}
              </span>
            </div>
          )
        })}
      </div>

      {/* Last day delta chips */}
      {lastDayResult && lastDayResult.statDeltas && (
        <div className="delta-list">
          {Object.entries(lastDayResult.statDeltas).map(([stat, delta]) => {
            if (delta === 0) return null
            return (
              <span key={stat} className={`delta-chip ${delta > 0 ? 'positive' : 'negative'}`}>
                {stat} {delta > 0 ? `+${delta}` : delta}
              </span>
            )
          })}
          {lastDayResult.rapportDelta !== 0 && (
            <span className={`delta-chip ${lastDayResult.rapportDelta > 0 ? 'positive' : 'negative'}`}>
              rapport {lastDayResult.rapportDelta > 0 ? `+${lastDayResult.rapportDelta}` : lastDayResult.rapportDelta}
            </span>
          )}
        </div>
      )}

      {/* Mandatory activity alert */}
      {mandatoryActivity && !mandatoryActivity.accepted && !mandatoryActivity.refused && (
        <div className="mandatory-alert">
          <div className="title">⚠ {mandatoryActivity.label}</div>
          <div className="desc">{mandatoryActivity.description}</div>
          <div className="actions">
            <button className="btn" style={{ flex: 1 }} onClick={acceptMandatory}>Accept</button>
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={refuseMandatory}>Refuse</button>
          </div>
        </div>
      )}

      {/* Map Canvas — fills remaining space */}
      <GameCanvas activeSlot={activeSlot} onInteraction={handleMapInteraction} />

      {/* Investigator picker modal */}
      {showInvestigatorPicker && (
        <div className="modal-overlay" onClick={() => setShowInvestigatorPicker(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">Choose Investigator</div>
            <div className="modal-choices">
              {investigators.filter(i => i.isActive && i.stage < 7).map((inv) => (
                <button
                  key={inv.id}
                  className="btn"
                  onClick={() => handlePickInvestigator(inv.id, showInvestigatorPicker)}
                >
                  {inv.name} · Warmth {inv.warmth}/10
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="bottom-bar">
        <button
          className="btn btn-primary"
          disabled={!allFilled}
          onClick={endDay}
        >
          {allFilled ? 'End Day →' : `Fill ${TIME_SLOTS.filter(s => !schedule[s] && !isSlotLocked(s)).length} more slots`}
        </button>
      </div>

      {/* Phone FAB */}
      <button
        className="phone-fab"
        onClick={() => useGameStore.getState().openPhone()}
        aria-label="Open Phone"
      >
        <PixelIcon name="phone" size={24} color="#fff" />
      </button>

      {/* Free Study FAB */}
      <FreeStudyButton />

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
