import { useState, useCallback, useRef, useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { DAY_NAMES, DAY_NAMES_EN, TOTAL_WEEKS, WEEKS_PER_TRANSFER, TIME_SLOTS } from '../data/constants'
import StatBar from '../components/StatBar'
import CompanionCard from '../components/CompanionCard'
import InvestigatorCard from '../components/InvestigatorCard'
import WeekProgress from '../components/WeekProgress'
import GameCanvas from '../components/GameCanvas'
import InteractionPrompt from '../components/InteractionPrompt'
import MinigameLauncher from '../components/MinigameLauncher'
import TouchControls from '../components/TouchControls'
import FocusableButtonGroup from '../components/FocusableButtonGroup'
import { useNumberKeySelect } from '../utils/focusManager'
import { useGameShortcuts } from '../utils/useShortcuts'
import { ACTIVITY_MINIGAME_MAP } from '../engine/minigameEngine'

const TIME_SLOT_NAMES = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }

export default function DailyView() {
  const stats = useGameStore((s) => s.stats)
  const companion = useGameStore((s) => s.companion)
  const investigators = useGameStore((s) => s.investigators)
  const schedule = useGameStore((s) => s.schedule)
  const day = useGameStore((s) => s.day)
  const week = useGameStore((s) => s.week)
  const warnings = useGameStore((s) => s.warnings)
  const lastDayResult = useGameStore((s) => s.lastDayResult)
  const mandatoryActivity = useGameStore((s) => s.mandatoryActivity)
  const setActivity = useGameStore((s) => s.setActivity)
  const endDay = useGameStore((s) => s.endDay)
  const acceptMandatory = useGameStore((s) => s.acceptMandatory)
  const refuseMandatory = useGameStore((s) => s.refuseMandatory)
  const setVisitTarget = useGameStore((s) => s.setVisitTarget)

  const deltas = lastDayResult?.statDeltas || {}

  const setMinigameScore = useGameStore((s) => s.setMinigameScore)

  // Current time slot (which of the 3 slots we're filling)
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0)
  const [pendingInteraction, setPendingInteraction] = useState(null)
  const [activeMinigame, setActiveMinigame] = useState(null) // { activityId, slot }

  const currentSlot = TIME_SLOTS[currentSlotIndex] // 'morning', 'afternoon', 'evening'
  const allSlotsFilled = currentSlotIndex >= 3

  // Transfer progress
  const weeksIntoTransfer = ((week - 1) % WEEKS_PER_TRANSFER) + 1

  // Check if mandatory activity blocks current slot
  const acceptedMandatorySlot = mandatoryActivity?.accepted ? mandatoryActivity.slot : null
  const mandatoryPending = mandatoryActivity && !mandatoryActivity.refused && !mandatoryActivity.accepted

  // Time of day for lighting
  const timeOfDay = currentSlotIndex === 0 ? 'morning' : currentSlotIndex === 1 ? 'afternoon' : 'evening'

  // Handle interaction from the canvas
  const handleInteraction = useCallback((interaction) => {
    // Don't allow interactions if all slots are filled
    if (allSlotsFilled) return

    // Check if this interaction has an activity
    if (interaction.type === 'activity') {
      setPendingInteraction(interaction)
    }
  }, [allSlotsFilled])

  // Figure out which slot to fill (skipping mandatory slots)
  const getSlotToFill = useCallback(() => {
    let slotToFill = currentSlot
    if (acceptedMandatorySlot === slotToFill) {
      const nextIndex = currentSlotIndex + 1
      if (nextIndex < 3) {
        slotToFill = TIME_SLOTS[nextIndex]
      }
    }
    return slotToFill
  }, [currentSlot, currentSlotIndex, acceptedMandatorySlot])

  // Advance slot index after filling
  const advanceSlot = useCallback(() => {
    setCurrentSlotIndex(prev => {
      let next = prev + 1
      // Skip mandatory slot if it was accepted
      if (acceptedMandatorySlot === TIME_SLOTS[next]) {
        next++
      }
      // If mandatory was on current slot, skip one more
      if (acceptedMandatorySlot === TIME_SLOTS[prev]) {
        next++
      }
      return next
    })
  }, [acceptedMandatorySlot])

  // Confirm activity selection — launch minigame if applicable
  const confirmActivity = useCallback(() => {
    if (!pendingInteraction) return

    const activityId = pendingInteraction.activity
    const hasMinigame = ACTIVITY_MINIGAME_MAP[activityId]

    // Set visit target if this is a visit_investigator activity
    if (activityId === 'visit_investigator' && pendingInteraction.investigatorId) {
      setVisitTarget(pendingInteraction.investigatorId)
    }

    if (hasMinigame) {
      // Launch minigame
      setActiveMinigame({ activityId, slot: getSlotToFill() })
      setPendingInteraction(null)
    } else {
      // No minigame — set activity directly with default score
      const slotToFill = getSlotToFill()
      setActivity(slotToFill, activityId)
      setMinigameScore(slotToFill, 0.6) // default average score
      advanceSlot()
      setPendingInteraction(null)
    }
  }, [pendingInteraction, getSlotToFill, advanceSlot, setActivity, setMinigameScore, setVisitTarget])

  // Minigame completed
  const handleMinigameComplete = useCallback((score) => {
    if (!activeMinigame) return
    const { activityId, slot } = activeMinigame
    setActivity(slot, activityId)
    setMinigameScore(slot, score)
    setActiveMinigame(null)
    advanceSlot()
    setTimeout(() => canvasContainerRef.current?.focus(), 0)
  }, [activeMinigame, setActivity, setMinigameScore, advanceSlot])

  // Minigame cancelled (skip with score 0)
  const handleMinigameCancel = useCallback(() => {
    if (!activeMinigame) return
    const { activityId, slot } = activeMinigame
    setActivity(slot, activityId)
    setMinigameScore(slot, 0)
    setActiveMinigame(null)
    advanceSlot()
    setTimeout(() => canvasContainerRef.current?.focus(), 0)
  }, [activeMinigame, setActivity, setMinigameScore, advanceSlot])

  const cancelInteraction = useCallback(() => {
    setPendingInteraction(null)
  }, [])

  // Handle end day
  const handleEndDay = useCallback(() => {
    endDay()
    setCurrentSlotIndex(0)
    setPendingInteraction(null)
  }, [endDay])

  // Handle mandatory activity
  const handleAcceptMandatory = useCallback(() => {
    acceptMandatory()
    // If the mandatory is for the current slot, skip to next
    if (mandatoryActivity?.slot === currentSlot) {
      setCurrentSlotIndex(prev => prev + 1)
    }
  }, [acceptMandatory, mandatoryActivity, currentSlot])

  const handleRefuseMandatory = useCallback(() => {
    refuseMandatory()
  }, [refuseMandatory])

  // Number key support for mandatory activity: 1=Accept, 2=Refuse
  useNumberKeySelect(2, useCallback((index) => {
    if (index === 0) handleAcceptMandatory()
    else handleRefuseMandatory()
  }, [handleAcceptMandatory, handleRefuseMandatory]), mandatoryPending)

  // Canvas container ref for focus return
  const canvasContainerRef = useRef(null)

  // Global shortcuts: E = End Day
  const shortcutActions = useMemo(() => ({
    e: allSlotsFilled ? handleEndDay : undefined,
  }), [allSlotsFilled, handleEndDay])
  useGameShortcuts(shortcutActions, allSlotsFilled)

  // Sidebar arrow key navigation between cards
  const handleSidebarKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const cards = e.currentTarget.querySelectorAll('[data-card]')
      if (!cards.length) return
      const currentIndex = Array.from(cards).indexOf(document.activeElement)
      let nextIndex
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1
      }
      e.preventDefault()
      cards[nextIndex]?.focus()
    }
  }, [])

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <span className="pixel-font" style={styles.logo}>TWO BY TWO</span>
          {warnings > 0 && (
            <span className="pixel-font" style={styles.warningBadge}>
              {warnings}/3
            </span>
          )}
        </div>
        <div style={styles.timeInfo}>
          <span className="pixel-font" style={styles.dayName}>
            {DAY_NAMES[day]}
            <span style={styles.dayNameEn}> ({DAY_NAMES_EN[day]})</span>
          </span>
          <span style={styles.weekNum}>Week {week} / {TOTAL_WEEKS}</span>
          <span className="pixel-font" style={styles.transferInfo}>
            Transfer {Math.ceil(week / WEEKS_PER_TRANSFER)} — {weeksIntoTransfer}/{WEEKS_PER_TRANSFER}
          </span>
        </div>
      </div>

      {/* Stat Bars - compact row */}
      <div style={styles.statsRow}>
        <StatBar stat="language" value={stats.language} delta={deltas.language} compact />
        <StatBar stat="spirit" value={stats.spirit} delta={deltas.spirit} compact />
        <StatBar stat="skills" value={stats.skills} delta={deltas.skills} compact />
        <StatBar stat="obedience" value={stats.obedience} delta={deltas.obedience} compact />
        <StatBar stat="budget" value={stats.budget} delta={deltas.budget} compact />
        <StatBar stat="rapport" value={companion.rapport} max={10} delta={lastDayResult?.rapportDelta} compact />
      </div>

      {/* Mandatory Activity Alert */}
      {mandatoryPending && (
        <div style={styles.mandatoryAlert}>
          <span className="pixel-font" style={styles.mandatoryLabel}>
            MANDATORY ({mandatoryActivity.slot})
          </span>
          <span style={styles.mandatoryTitle}>{mandatoryActivity.label}</span>
          <span style={styles.mandatoryDesc}>{mandatoryActivity.description}</span>
          <FocusableButtonGroup
            buttons={[
              { id: 'accept', label: 'Accept' },
              { id: 'refuse', label: 'Refuse' },
            ]}
            onSelect={(index) => index === 0 ? handleAcceptMandatory() : handleRefuseMandatory()}
            orientation="horizontal"
            autoFocus
          />
        </div>
      )}

      {/* Main game area: canvas + sidebar */}
      <div className="main-area" style={styles.mainArea}>
        <div ref={canvasContainerRef} tabIndex={0} style={styles.canvasContainer}>
          {/* Time slot indicator */}
          <div style={styles.slotIndicator}>
            {TIME_SLOTS.map((slot, i) => {
              const filled = schedule[slot] || acceptedMandatorySlot === slot
              const isCurrent = i === currentSlotIndex && !allSlotsFilled
              return (
                <div key={slot} style={{
                  ...styles.slotChip,
                  borderColor: isCurrent ? 'var(--accent)' : filled ? 'var(--success)' : 'var(--border)',
                  color: isCurrent ? 'var(--accent-bright)' : filled ? 'var(--success)' : 'var(--text-dim)',
                  background: isCurrent ? 'rgba(196,121,60,0.1)' : 'transparent',
                }}>
                  <span className="pixel-font" style={{ fontSize: '9px' }}>
                    {TIME_SLOT_NAMES[slot]}
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
                    {acceptedMandatorySlot === slot
                      ? mandatoryActivity?.label
                      : schedule[slot]
                        ? schedule[slot].replace(/_/g, ' ')
                        : isCurrent ? '← explore' : '—'}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Canvas */}
          <div style={styles.canvasWrapper}>
            <GameCanvas
              timeOfDay={timeOfDay}
              onInteraction={handleInteraction}
            />

            {/* Interaction prompt overlay */}
            {pendingInteraction && (
              <InteractionPrompt
                interaction={pendingInteraction}
                timeSlot={TIME_SLOT_NAMES[currentSlot]}
                onConfirm={confirmActivity}
                onCancel={cancelInteraction}
              />
            )}
          </div>

          <TouchControls />

          {/* Controls hint */}
          <div style={styles.controlsHint}>
            <span className="pixel-font" style={styles.hintText}>
              WASD/Arrows: Move · Space: Interact
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar" tabIndex={0} onKeyDown={handleSidebarKeyDown} style={styles.sidebar}>
          <CompanionCard companion={companion} />
          {[...investigators].sort((a, b) => {
            if (a.isActive && !b.isActive) return -1
            if (!a.isActive && b.isActive) return 1
            return 0
          }).map((inv) => (
            <InvestigatorCard key={inv.id} investigator={inv} onClick={() => {}} />
          ))}
        </div>
      </div>

      {/* Minigame overlay */}
      {activeMinigame && (
        <MinigameLauncher
          activityId={activeMinigame.activityId}
          stats={stats}
          onComplete={handleMinigameComplete}
          onCancel={handleMinigameCancel}
        />
      )}

      {/* Day result notifications */}
      {lastDayResult?.investigatorChanges?.length > 0 && (
        <div className="panel" style={styles.notifications}>
          {lastDayResult.investigatorChanges.map((text, i) => (
            <p key={i} style={styles.notification}>{text}</p>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <WeekProgress currentDay={day} />
        <button
          className="primary"
          disabled={!allSlotsFilled}
          onClick={handleEndDay}
          style={styles.endDayBtn}
        >
          End Day {allSlotsFilled && <span className="shortcut-hint">[E]</span>}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '6px',
    borderBottom: '1px solid var(--border)',
  },
  logo: {
    fontSize: '14px',
    color: 'var(--accent)',
    letterSpacing: '2px',
  },
  warningBadge: {
    fontSize: '9px',
    color: 'var(--danger)',
    marginLeft: '8px',
    padding: '2px 4px',
    border: '1px solid var(--danger)',
    borderRadius: '2px',
  },
  timeInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '1px',
  },
  dayName: { fontSize: '12px', color: 'var(--text)' },
  dayNameEn: { fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' },
  weekNum: { fontSize: '10px', color: 'var(--text-dim)' },
  transferInfo: { fontSize: '9px', color: 'var(--accent)' },
  statsRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  // Mandatory
  mandatoryAlert: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 10px',
    background: 'var(--panel-light)',
    border: '1px solid var(--danger)',
    borderRadius: '2px',
  },
  mandatoryLabel: { fontSize: '9px', color: 'var(--danger)', textTransform: 'uppercase' },
  mandatoryTitle: { fontSize: '11px', color: 'var(--text)', fontFamily: 'var(--font-pixel)' },
  mandatoryDesc: { fontSize: '10px', color: 'var(--text-dim)', flex: '1 0 100%' },
  mandatoryActions: { display: 'flex', gap: '6px', marginTop: '2px' },
  mandatoryAccept: {
    padding: '4px 10px', fontSize: '9px', background: 'var(--panel)',
    border: '1px solid var(--accent)', color: 'var(--accent-bright)',
    cursor: 'pointer', fontFamily: 'var(--font-pixel)', borderRadius: '2px',
  },
  mandatoryRefuse: {
    padding: '4px 10px', fontSize: '9px', background: 'var(--panel)',
    border: '1px solid var(--danger)', color: 'var(--danger)',
    cursor: 'pointer', fontFamily: 'var(--font-pixel)', borderRadius: '2px',
  },
  // Main
  mainArea: {
    display: 'flex',
    gap: '10px',
  },
  canvasContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  slotIndicator: {
    display: 'flex',
    gap: '4px',
  },
  slotChip: {
    flex: 1,
    padding: '4px 6px',
    border: '1px solid',
    borderRadius: '2px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  canvasWrapper: {
    position: 'relative',
    lineHeight: 0,
  },
  controlsHint: {
    textAlign: 'center',
    padding: '4px',
  },
  hintText: {
    fontSize: '8px',
    color: 'var(--text-dim)',
    letterSpacing: '1px',
  },
  sidebar: {
    width: '180px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  notifications: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderLeft: '3px solid var(--accent)',
  },
  notification: { fontSize: '11px', color: 'var(--text-dim)' },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '6px',
    borderTop: '1px solid var(--border)',
  },
  endDayBtn: { padding: '8px 24px', fontSize: '12px' },
}
