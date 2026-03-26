/**
 * Overlay prompt shown when player interacts with an activity spot.
 * Confirms the activity selection for the current time slot.
 */
export default function InteractionPrompt({ interaction, timeSlot, onConfirm, onCancel }) {
  if (!interaction) return null

  return (
    <div style={styles.overlay}>
      <div className="panel fade-in" style={styles.modal}>
        <div style={styles.header}>
          <span className="pixel-font" style={styles.slotLabel}>{timeSlot}</span>
          <span className="pixel-font" style={styles.typeLabel}>{interaction.type}</span>
        </div>

        <h3 style={styles.title}>{interaction.label}</h3>
        <p style={styles.description}>{interaction.prompt}</p>

        <div style={styles.actions}>
          <button onClick={onConfirm} style={styles.confirmBtn}>
            <span className="pixel-font">Yes</span>
          </button>
          <button onClick={onCancel} style={styles.cancelBtn}>
            <span className="pixel-font">Not now</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  modal: {
    maxWidth: '360px',
    width: '90%',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    borderColor: 'var(--accent)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  slotLabel: {
    fontSize: '9px',
    color: 'var(--accent)',
    textTransform: 'uppercase',
  },
  typeLabel: {
    fontSize: '9px',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '13px',
    color: 'var(--accent-bright)',
  },
  description: {
    fontSize: '11px',
    color: 'var(--text)',
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: '4px',
  },
  confirmBtn: {
    flex: 1,
    padding: '8px 16px',
    background: 'var(--accent)',
    border: 'none',
    color: 'var(--bg)',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  cancelBtn: {
    flex: 1,
    padding: '8px 16px',
    background: 'var(--panel-light)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '2px',
  },
}
