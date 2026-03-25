import { TIME_SLOT_LABELS } from '../data/constants'

export default function ActivitySelector({ slot, activities, selectedId, onSelect }) {
  const selected = activities.find((a) => a.id === selectedId)

  return (
    <div style={styles.container}>
      <div className="pixel-font" style={styles.slotLabel}>
        {TIME_SLOT_LABELS[slot]}
      </div>
      <div style={styles.grid}>
        {activities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => onSelect(slot, activity.id)}
            style={{
              ...styles.activityBtn,
              ...(selectedId === activity.id ? styles.selected : {}),
            }}
          >
            {activity.label}
          </button>
        ))}
      </div>
      {selected && (
        <div style={styles.description}>
          {selected.description}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  slotLabel: {
    fontSize: '10px',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  activityBtn: {
    fontSize: '10px',
    padding: '4px 8px',
    background: 'var(--panel)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    borderRadius: '2px',
    color: 'var(--text)',
    cursor: 'pointer',
    fontFamily: 'var(--font-pixel)',
    transition: 'border-color 0.15s, background 0.15s',
  },
  selected: {
    background: 'var(--panel-light)',
    borderColor: 'var(--accent)',
    color: 'var(--accent-bright)',
  },
  description: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    fontStyle: 'italic',
    lineHeight: 1.4,
    padding: '2px 0',
  },
}
