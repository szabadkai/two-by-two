import { DAY_NAMES } from '../data/constants'

export default function WeekProgress({ currentDay }) {
  return (
    <div style={styles.container}>
      {DAY_NAMES.map((name, i) => (
        <div
          key={i}
          style={{
            ...styles.dot,
            ...(i < currentDay ? styles.past : {}),
            ...(i === currentDay ? styles.current : {}),
            ...(i > currentDay ? styles.future : {}),
          }}
          title={name}
        >
          <span className="pixel-font" style={styles.label}>
            {i === 6 ? 'P' : name.charAt(0)}
          </span>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  dot: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    borderRadius: '2px',
  },
  label: {
    fontSize: '9px',
    lineHeight: 1,
  },
  past: {
    background: 'var(--panel-light)',
    borderColor: 'var(--border)',
    color: 'var(--text-muted)',
  },
  current: {
    background: 'var(--accent)',
    borderColor: 'var(--accent-bright)',
    color: 'var(--bg-dark)',
  },
  future: {
    background: 'transparent',
    borderColor: 'var(--border)',
    color: 'var(--text-dim)',
  },
}
