import { useGameStore } from '../store/gameStore'
import { TOTAL_WEEKS } from '../data/constants'
import { PDAY_ACTIVITY_LIST } from '../data/activities'
import StatBar from '../components/StatBar'
import ActivitySelector from '../components/ActivitySelector'
import CompanionCard from '../components/CompanionCard'
import InvestigatorCard from '../components/InvestigatorCard'
import WeekProgress from '../components/WeekProgress'

export default function PDayView() {
  const stats = useGameStore((s) => s.stats)
  const companion = useGameStore((s) => s.companion)
  const investigators = useGameStore((s) => s.investigators)
  const schedule = useGameStore((s) => s.schedule)
  const week = useGameStore((s) => s.week)
  const lastDayResult = useGameStore((s) => s.lastDayResult)
  const setActivity = useGameStore((s) => s.setActivity)
  const endDay = useGameStore((s) => s.endDay)

  const allSlotsFilled = schedule.morning && schedule.afternoon && schedule.evening
  const deltas = lastDayResult?.statDeltas || {}

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

      {/* Stat Bars */}
      <div className="stats-grid" style={styles.statsGrid}>
        <StatBar stat="language" value={stats.language} delta={deltas.language} />
        <StatBar stat="spirit" value={stats.spirit} delta={deltas.spirit} />
        <StatBar stat="skills" value={stats.skills} delta={deltas.skills} />
        <StatBar stat="obedience" value={stats.obedience} delta={deltas.obedience} />
        <StatBar stat="budget" value={stats.budget} delta={deltas.budget} />
        <StatBar stat="rapport" value={companion.rapport} max={10} delta={lastDayResult?.rapportDelta} />
      </div>

      {/* Main Area */}
      <div className="main-area" style={styles.mainArea}>
        <div style={styles.schedulePanel}>
          <div className="panel" style={styles.schedulePanelInner}>
            <h2 style={styles.sectionTitle}>P-Day Activities</h2>
            <p style={styles.pdayNote}>
              Take a breath. Do your laundry. Write home. You've earned it.
            </p>
            <div style={styles.slots}>
              {['morning', 'afternoon', 'evening'].map((slot) => (
                <ActivitySelector
                  key={slot}
                  slot={slot}
                  activities={PDAY_ACTIVITY_LIST}
                  selectedId={schedule[slot]}
                  onSelect={setActivity}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar" style={styles.sidebar}>
          <CompanionCard companion={companion} />
          {investigators.map((inv) => (
            <InvestigatorCard key={inv.id} investigator={inv} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <WeekProgress currentDay={6} />
        <button
          className="primary"
          disabled={!allSlotsFilled}
          onClick={endDay}
          style={styles.endDayBtn}
        >
          End P-Day
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--border)',
  },
  logo: {
    fontSize: '14px',
    color: 'var(--accent)',
    letterSpacing: '2px',
  },
  timeInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  pday: {
    fontSize: '12px',
    color: 'var(--spirit)',
  },
  pdayFull: {
    fontSize: '10px',
    color: 'var(--text-muted)',
  },
  weekNum: {
    fontSize: '10px',
    color: 'var(--text-dim)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  mainArea: {
    display: 'flex',
    gap: '12px',
  },
  schedulePanel: {
    flex: 1,
  },
  schedulePanelInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '11px',
    color: 'var(--spirit)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  pdayNote: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    fontStyle: 'italic',
  },
  slots: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  sidebar: {
    width: '200px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '8px',
    borderTop: '1px solid var(--border)',
  },
  endDayBtn: {
    padding: '8px 24px',
    fontSize: '12px',
  },
}
