import { useGameStore } from '../store/gameStore'
import { INVESTIGATOR_STAGES } from '../data/investigators'
import { getCompanionMood } from '../engine/companionEngine'

export default function WeeklySummary() {
  const stats = useGameStore((s) => s.stats)
  const companion = useGameStore((s) => s.companion)
  const investigators = useGameStore((s) => s.investigators)
  const week = useGameStore((s) => s.week)
  const weekLog = useGameStore((s) => s.weekLog)
  const baptisms = useGameStore((s) => s.baptisms)
  const endWeek = useGameStore((s) => s.endWeek)

  const statDeltas = {}
  for (const stat of ['language', 'spirit', 'skills', 'obedience', 'budget']) {
    statDeltas[stat] = stats[stat] - (weekLog.startStats[stat] || 0)
  }
  const rapportDelta = companion.rapport - (weekLog.startRapport || 0)

  const mood = getCompanionMood(companion.rapport)

  return (
    <div style={styles.container}>
      <div className="panel" style={styles.panel}>
        <h2 style={styles.title}>Week {week} Summary</h2>

        {/* Stat Changes */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Stats</h3>
          <div style={styles.statGrid}>
            {Object.entries(statDeltas).map(([stat, delta]) => (
              <div key={stat} style={styles.statRow}>
                <span className="pixel-font" style={{
                  ...styles.statName,
                  color: `var(--${stat})`,
                }}>
                  {stat}
                </span>
                <span style={styles.statValue}>{stats[stat]}</span>
                <span className="pixel-font" style={{
                  ...styles.statDelta,
                  color: delta > 0 ? 'var(--success)' : delta < 0 ? 'var(--danger)' : 'var(--text-muted)',
                }}>
                  {delta === 0 ? '--' : stat === 'budget'
                    ? `${delta > 0 ? '+' : ''}${delta.toLocaleString()} Ft`
                    : `${delta > 0 ? '+' : ''}${delta}`}
                </span>
              </div>
            ))}
            <div style={styles.statRow}>
              <span className="pixel-font" style={{ ...styles.statName, color: 'var(--rapport)' }}>
                rapport
              </span>
              <span style={styles.statValue}>{companion.rapport}/10</span>
              <span className="pixel-font" style={{
                ...styles.statDelta,
                color: rapportDelta > 0 ? 'var(--success)' : rapportDelta < 0 ? 'var(--danger)' : 'var(--text-muted)',
              }}>
                {rapportDelta > 0 ? `+${rapportDelta}` : rapportDelta === 0 ? '--' : rapportDelta}
              </span>
            </div>
          </div>
        </div>

        {/* Companion */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Companion</h3>
          <p style={styles.companionInfo}>
            {companion.name} is feeling <span style={{
              color: mood === 'happy' ? 'var(--success)' : mood === 'unhappy' ? 'var(--danger)' : 'var(--budget)',
              fontFamily: 'var(--font-pixel)',
            }}>{mood}</span>
          </p>
        </div>

        {/* Investigators */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Investigator Pipeline</h3>
          {investigators.map((inv) => (
            <div key={inv.id} style={styles.investigatorRow}>
              <span style={{
                ...styles.invName,
                opacity: inv.isActive ? 1 : 0.4,
              }}>
                {inv.name}
              </span>
              <div style={styles.invPipeline}>
                {INVESTIGATOR_STAGES.map((_, i) => (
                  <div key={i} style={{
                    ...styles.pipelineDot,
                    background: i <= inv.stage ? 'var(--accent)' : 'var(--panel-light)',
                  }} />
                ))}
              </div>
              <span className="pixel-font" style={styles.invStage}>
                {inv.stage >= 7 ? 'BAPTIZED' : INVESTIGATOR_STAGES[inv.stage]}
              </span>
              {!inv.isActive && (
                <span className="pixel-font" style={styles.invGone}>GONE</span>
              )}
            </div>
          ))}
          {weekLog.investigatorChanges.length > 0 && (
            <div style={styles.changes}>
              {weekLog.investigatorChanges.map((text, i) => (
                <p key={i} style={styles.changeText}>{text}</p>
              ))}
            </div>
          )}
        </div>

        {/* Events */}
        {weekLog.events.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Notable Events</h3>
            {weekLog.events.map((event, i) => (
              <p key={i} style={styles.eventText}>{event}</p>
            ))}
          </div>
        )}

        {/* Notifications */}
        {weekLog.notifications.length > 0 && (
          <div style={styles.section}>
            {weekLog.notifications.map((note, i) => (
              <p key={i} style={styles.warningText}>{note}</p>
            ))}
          </div>
        )}

        {/* Baptisms */}
        {baptisms > 0 && (
          <div style={styles.baptismCount}>
            <span className="pixel-font" style={styles.baptismLabel}>
              Total Baptisms: {baptisms}
            </span>
          </div>
        )}

        <button className="primary" onClick={endWeek} style={styles.continueBtn}>
          Continue to Week {week + 1}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '16px',
  },
  panel: {
    maxWidth: '500px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px',
  },
  title: {
    fontSize: '16px',
    color: 'var(--accent-bright)',
    textAlign: 'center',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    borderTop: '1px solid var(--border)',
    paddingTop: '10px',
  },
  sectionTitle: {
    fontSize: '10px',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statName: {
    fontSize: '10px',
    textTransform: 'uppercase',
    width: '80px',
  },
  statValue: {
    fontSize: '11px',
    color: 'var(--text)',
    width: '80px',
  },
  statDelta: {
    fontSize: '10px',
  },
  companionInfo: {
    fontSize: '11px',
    color: 'var(--text)',
  },
  investigatorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
  },
  invName: {
    fontSize: '11px',
    color: 'var(--text)',
    width: '100px',
    flexShrink: 0,
  },
  invPipeline: {
    display: 'flex',
    gap: '2px',
    flex: 1,
  },
  pipelineDot: {
    flex: 1,
    height: '6px',
    borderRadius: '1px',
  },
  invStage: {
    fontSize: '9px',
    color: 'var(--text-dim)',
    width: '80px',
    textAlign: 'right',
    flexShrink: 0,
  },
  invGone: {
    fontSize: '9px',
    color: 'var(--danger)',
  },
  changes: {
    marginTop: '4px',
  },
  changeText: {
    fontSize: '10px',
    color: 'var(--text-dim)',
    fontStyle: 'italic',
    padding: '2px 0',
  },
  eventText: {
    fontSize: '11px',
    color: 'var(--text)',
    padding: '2px 0',
  },
  warningText: {
    fontSize: '11px',
    color: 'var(--danger)',
    fontFamily: 'var(--font-pixel)',
  },
  baptismCount: {
    textAlign: 'center',
    padding: '8px 0',
  },
  baptismLabel: {
    fontSize: '12px',
    color: 'var(--success)',
  },
  continueBtn: {
    alignSelf: 'center',
    padding: '10px 28px',
    fontSize: '12px',
    marginTop: '8px',
  },
}
