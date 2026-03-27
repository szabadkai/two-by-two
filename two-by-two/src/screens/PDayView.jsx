import { useState, useCallback, useRef, useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { TOTAL_WEEKS, TIME_SLOTS } from '../data/constants'
import { PDAY_ACTIVITIES } from '../data/activities'
import StatBar from '../components/StatBar'
import CompanionCard from '../components/CompanionCard'
import InvestigatorCard from '../components/InvestigatorCard'
import WeekProgress from '../components/WeekProgress'
import GameCanvas from '../components/GameCanvas'
import InteractionPrompt from '../components/InteractionPrompt'
import MinigameLauncher from '../components/MinigameLauncher'
import { ACTIVITY_MINIGAME_MAP } from '../engine/minigameEngine'
import TouchControls from '../components/TouchControls'
import { useGameShortcuts } from '../utils/useShortcuts'

// P-Day maps certain locations to P-Day specific activities
const PDAY_ACTIVITY_MAP = {
  'study_language': 'pday_study',
  'personal_study': 'letters_home',
  'companion_study': 'companion_activity',
  'explore_city': 'explore_city',
  'member_visit': 'sports',
  'service_project': 'laundry',
  'english_class': 'shopping',
  'teach_lesson': 'letters_home',
  'street_contact': 'explore_city',
}

const TIME_SLOT_NAMES = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }

export default function PDayView() {
  const stats = useGameStore((s) => s.stats)
  const companion = useGameStore((s) => s.companion)
  const investigators = useGameStore((s) => s.investigators)
  const schedule = useGameStore((s) => s.schedule)
  const week = useGameStore((s) => s.week)
  const lastDayResult = useGameStore((s) => s.lastDayResult)
  const setActivity = useGameStore((s) => s.setActivity)
  const setMinigameScore = useGameStore((s) => s.setMinigameScore)
  const endDay = useGameStore((s) => s.endDay)

  const deltas = lastDayResult?.statDeltas || {}

  const [currentSlotIndex, setCurrentSlotIndex] = useState(0)
  const [pendingInteraction, setPendingInteraction] = useState(null)
  const [activeMinigame, setActiveMinigame] = useState(null)

  const currentSlot = TIME_SLOTS[currentSlotIndex]
  const allSlotsFilled = currentSlotIndex >= 3

  const handleInteraction = useCallback((interaction) => {
    if (allSlotsFilled) return
    if (interaction.type === 'activity') {
      // Map regular activities to P-Day equivalents
      const pdayActivityId = PDAY_ACTIVITY_MAP[interaction.activity] || 'explore_city'
      const pdayActivity = PDAY_ACTIVITIES[pdayActivityId]
      setPendingInteraction({
        ...interaction,
        activity: pdayActivityId,
        label: pdayActivity?.label || interaction.label,
        prompt: pdayActivity?.description || interaction.prompt,
      })
    }
  }, [allSlotsFilled])

  const confirmActivity = useCallback(() => {
    if (!pendingInteraction) return
    const activityId = pendingInteraction.activity
    const hasMinigame = ACTIVITY_MINIGAME_MAP[activityId]

    if (hasMinigame) {
      setActiveMinigame({ activityId, slot: currentSlot })
      setPendingInteraction(null)
    } else {
      setActivity(currentSlot, activityId)
      setMinigameScore(currentSlot, 0.6)
      setCurrentSlotIndex(prev => prev + 1)
      setPendingInteraction(null)
    }
  }, [pendingInteraction, currentSlot, setActivity, setMinigameScore])

  const handleMinigameComplete = useCallback((score) => {
    if (!activeMinigame) return
    const { activityId, slot } = activeMinigame
    setActivity(slot, activityId)
    setMinigameScore(slot, score)
    setActiveMinigame(null)
    setCurrentSlotIndex(prev => prev + 1)
    setTimeout(() => canvasContainerRef.current?.focus(), 0)
  }, [activeMinigame, setActivity, setMinigameScore])

  const handleMinigameCancel = useCallback(() => {
    if (!activeMinigame) return
    const { activityId, slot } = activeMinigame
    setActivity(slot, activityId)
    setMinigameScore(slot, 0)
    setActiveMinigame(null)
    setCurrentSlotIndex(prev => prev + 1)
    setTimeout(() => canvasContainerRef.current?.focus(), 0)
  }, [activeMinigame, setActivity, setMinigameScore])

  const cancelInteraction = useCallback(() => {
    setPendingInteraction(null)
  }, [])

  const handleEndDay = useCallback(() => {
    endDay()
    setCurrentSlotIndex(0)
    setPendingInteraction(null)
  }, [endDay])

  // Canvas container ref for focus return
  const canvasContainerRef = useRef(null)

  // Global shortcuts: E = End P-Day
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
        <span className="pixel-font" style={styles.logo}>TWO BY TWO</span>
        <div style={styles.timeInfo}>
          <span className="pixel-font" style={styles.pday}>P-Day</span>
          <span style={styles.pdayFull}>Preparation Day</span>
          <span style={styles.weekNum}>Week {week} / {TOTAL_WEEKS}</span>
        </div>
      </div>

      {/* Compact Stats */}
      <div style={styles.statsRow}>
        <StatBar stat="language" value={stats.language} delta={deltas.language} compact />
        <StatBar stat="spirit" value={stats.spirit} delta={deltas.spirit} compact />
        <StatBar stat="skills" value={stats.skills} delta={deltas.skills} compact />
        <StatBar stat="obedience" value={stats.obedience} delta={deltas.obedience} compact />
        <StatBar stat="budget" value={stats.budget} delta={deltas.budget} compact />
        <StatBar stat="rapport" value={companion.rapport} max={10} delta={lastDayResult?.rapportDelta} compact />
      </div>

      <p style={styles.pdayNote}>
        Take a breath. Explore the city. Write home. You've earned it.
      </p>

      {/* Main area */}
      <div className="main-area" style={styles.mainArea}>
        <div ref={canvasContainerRef} tabIndex={0} style={styles.canvasContainer}>
          {/* Slot indicator */}
          <div style={styles.slotIndicator}>
            {TIME_SLOTS.map((slot, i) => {
              const filled = !!schedule[slot]
              const isCurrent = i === currentSlotIndex && !allSlotsFilled
              return (
                <div key={slot} style={{
                  ...styles.slotChip,
                  borderColor: isCurrent ? 'var(--spirit)' : filled ? 'var(--success)' : 'var(--border)',
                  color: isCurrent ? 'var(--spirit)' : filled ? 'var(--success)' : 'var(--text-dim)',
                }}>
                  <span className="pixel-font" style={{ fontSize: '9px' }}>
                    {TIME_SLOT_NAMES[slot]}
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
                    {schedule[slot]?.replace(/_/g, ' ') || (isCurrent ? '← explore' : '—')}
                  </span>
                </div>
              )
            })}
          </div>

          <div style={styles.canvasWrapper}>
            <GameCanvas
              timeOfDay="morning"
              onInteraction={handleInteraction}
            />
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

          <div style={styles.controlsHint}>
            <span className="pixel-font" style={styles.hintText}>
              WASD/Arrows: Move · Space: Interact
            </span>
          </div>
        </div>

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

      {/* Footer */}
      <div style={styles.footer}>
        <WeekProgress currentDay={6} />
        <button
          className="primary"
          disabled={!allSlotsFilled}
          onClick={handleEndDay}
          style={styles.endDayBtn}
        >
          End P-Day {allSlotsFilled && <span className="shortcut-hint">[E]</span>}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '8px' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: '6px', borderBottom: '1px solid var(--border)',
  },
  logo: { fontSize: '14px', color: 'var(--accent)', letterSpacing: '2px' },
  timeInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' },
  pday: { fontSize: '12px', color: 'var(--spirit)' },
  pdayFull: { fontSize: '10px', color: 'var(--text-muted)' },
  weekNum: { fontSize: '10px', color: 'var(--text-dim)' },
  statsRow: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  pdayNote: { fontSize: '11px', color: 'var(--text-dim)', fontStyle: 'italic' },
  mainArea: { display: 'flex', gap: '10px' },
  canvasContainer: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  slotIndicator: { display: 'flex', gap: '4px' },
  slotChip: {
    flex: 1, padding: '4px 6px', border: '1px solid', borderRadius: '2px',
    display: 'flex', flexDirection: 'column', gap: '1px',
  },
  canvasWrapper: { position: 'relative', lineHeight: 0 },
  controlsHint: { textAlign: 'center', padding: '4px' },
  hintText: { fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '1px' },
  sidebar: {
    width: '180px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '6px',
    maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '4px',
  },
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: '6px', borderTop: '1px solid var(--border)',
  },
  endDayBtn: { padding: '8px 24px', fontSize: '12px' },
}
