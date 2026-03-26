import { useGameStore } from '../store/gameStore'

export default function SentHomeScreen() {
  const week = useGameStore((s) => s.week)
  const baptisms = useGameStore((s) => s.baptisms)
  const stats = useGameStore((s) => s.stats)
  const goToScreen = useGameStore((s) => s.goToScreen)

  const weeksServed = week
  const monthsServed = Math.floor(weeksServed / 4.3)

  return (
    <div style={styles.container}>
      <div className="panel" style={styles.panel}>
        <h2 className="pixel-font" style={styles.title}>SENT HOME EARLY</h2>

        <div style={styles.narrative}>
          <p style={styles.text}>
            The mission president's office. A phone call to your parents. A one-way ticket home.
          </p>
          <p style={styles.text}>
            You served {monthsServed} months of your 24-month mission. The elders in your district
            will whisper about it for a few weeks. Then they'll forget. The work goes on.
          </p>
          <p style={styles.text}>
            The hardest part won't be the flight home. It'll be the homecoming you won't have —
            no packed chapel, no proud parents in the front row, no talk about "what you learned."
          </p>
          <p style={styles.textDim}>
            Just a quiet return, and a lot of questions you'll answer for years.
          </p>
        </div>

        <div style={styles.statsSection}>
          <h3 style={styles.statsTitle}>Final Record</h3>
          <div style={styles.statRow}>
            <span className="pixel-font" style={styles.statLabel}>Weeks Served</span>
            <span style={styles.statVal}>{weeksServed} / 104</span>
          </div>
          <div style={styles.statRow}>
            <span className="pixel-font" style={styles.statLabel}>Baptisms</span>
            <span style={styles.statVal}>{baptisms}</span>
          </div>
          <div style={styles.statRow}>
            <span className="pixel-font" style={styles.statLabel}>Language</span>
            <span style={styles.statVal}>{stats.language}/100</span>
          </div>
          <div style={styles.statRow}>
            <span className="pixel-font" style={styles.statLabel}>Final Spirit</span>
            <span style={styles.statVal}>{stats.spirit}/100</span>
          </div>
        </div>

        <button
          className="primary"
          onClick={() => goToScreen('title')}
          style={styles.btn}
        >
          Return to Title
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '40px',
  },
  panel: {
    maxWidth: '480px',
    width: '100%',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    borderColor: 'var(--danger)',
  },
  title: {
    fontSize: '16px',
    color: 'var(--danger)',
    textAlign: 'center',
    letterSpacing: '2px',
  },
  narrative: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    borderLeft: '3px solid var(--danger)',
    paddingLeft: '12px',
  },
  text: {
    fontSize: '12px',
    lineHeight: 1.7,
    color: 'var(--text)',
  },
  textDim: {
    fontSize: '12px',
    lineHeight: 1.7,
    color: 'var(--text-dim)',
    fontStyle: 'italic',
  },
  statsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    borderTop: '1px solid var(--border)',
    paddingTop: '12px',
  },
  statsTitle: {
    fontSize: '10px',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
  },
  statLabel: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: '11px',
    color: 'var(--text)',
  },
  btn: {
    alignSelf: 'center',
    padding: '10px 28px',
    fontSize: '12px',
  },
}
