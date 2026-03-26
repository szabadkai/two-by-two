import { useGameStore } from '../store/gameStore'

export default function TitleScreen() {
  const startMTC = useGameStore((s) => s.startMTC)
  const startGame = useGameStore((s) => s.startGame)

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>TWO BY TWO</h1>
        <p style={styles.subtitle}>A Mormon Missionary Management Sim</p>
        <div style={styles.divider} />
        <p style={styles.flavor}>Budapest, Hungary — 2004</p>
        <p style={styles.tagline}>
          24 months. One name tag. Zero Hungarian vocabulary.
        </p>
        <button
          className="primary"
          style={styles.startBtn}
          onClick={startMTC}
        >
          New Mission
        </button>
        <p style={styles.hint}>
          Allocate your time. Manage your companion. Baptize the willing.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '32px',
    color: 'var(--accent-bright)',
    letterSpacing: '4px',
    lineHeight: 1.2,
  },
  subtitle: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '11px',
    color: 'var(--text-dim)',
    letterSpacing: '1px',
  },
  divider: {
    width: '60px',
    height: '2px',
    background: 'var(--border)',
    margin: '8px 0',
  },
  flavor: {
    fontSize: '13px',
    color: 'var(--text)',
    fontWeight: 500,
  },
  tagline: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    maxWidth: '300px',
  },
  startBtn: {
    marginTop: '16px',
    padding: '12px 32px',
    fontSize: '13px',
  },
  hint: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    marginTop: '8px',
    maxWidth: '280px',
  },
}
