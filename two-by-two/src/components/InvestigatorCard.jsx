import { INVESTIGATOR_STAGES } from '../data/investigators'

export default function InvestigatorCard({ investigator }) {
  const { name, personality, stage, warmth, isActive, description } = investigator

  return (
    <div
      className="panel"
      style={{
        ...styles.container,
        opacity: isActive ? 1 : 0.4,
      }}
    >
      <div style={styles.header}>
        <div style={styles.info}>
          <span className="pixel-font" style={styles.name}>{name}</span>
          <span style={styles.personality}>{personality}</span>
        </div>
        {!isActive && (
          <span className="pixel-font" style={styles.dropped}>GONE</span>
        )}
      </div>

      {/* Stage pipeline */}
      <div style={styles.pipeline}>
        {INVESTIGATOR_STAGES.map((stageName, i) => (
          <div
            key={i}
            style={{
              ...styles.stageBox,
              background: i <= stage ? 'var(--accent)' : 'var(--panel-light)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: i <= stage ? 'var(--accent)' : 'var(--border)',
              opacity: i <= stage ? 1 : 0.4,
            }}
            title={stageName}
          >
            <span style={styles.stageNum}>{i}</span>
          </div>
        ))}
      </div>
      <div style={styles.stageLabel}>
        {stage >= 7 ? 'Baptized!' : INVESTIGATOR_STAGES[stage]}
      </div>

      {/* Warmth */}
      <div style={styles.warmthRow}>
        <span className="pixel-font" style={styles.warmthLabel}>Warmth</span>
        <div style={styles.warmthBar}>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} style={{
              ...styles.heart,
              color: i < warmth ? 'var(--danger)' : 'var(--panel-light)',
            }}>
              {i < warmth ? '♥' : '♡'}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '10px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  name: {
    fontSize: '11px',
    color: 'var(--text)',
  },
  personality: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  dropped: {
    fontSize: '9px',
    color: 'var(--danger)',
  },
  pipeline: {
    display: 'flex',
    gap: '2px',
  },
  stageBox: {
    flex: 1,
    height: '8px',
    borderRadius: '1px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageNum: {
    fontSize: '0px',
    visibility: 'hidden',
  },
  stageLabel: {
    fontSize: '9px',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-pixel)',
  },
  warmthRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  warmthLabel: {
    fontSize: '9px',
    color: 'var(--danger)',
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  warmthBar: {
    display: 'flex',
    gap: '1px',
  },
  heart: {
    fontSize: '10px',
    lineHeight: 1,
  },
}
