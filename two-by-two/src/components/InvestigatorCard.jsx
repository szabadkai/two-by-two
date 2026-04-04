import { useState, useMemo } from 'react'
import { INVESTIGATOR_STAGES } from '../data/investigators'
import PixelPortrait from './PixelPortrait'
import { getInvestigatorPortrait } from '../data/portraits'

export default function InvestigatorCard({ investigator, onClick }) {
  const { name, personality, stage, warmth, isActive, description } = investigator
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const portraitData = useMemo(() => getInvestigatorPortrait(investigator), [name, personality])

  const handleClick = () => {
    if (onClick) onClick(investigator)
    if (isActive && stage < 7) {
      setExpanded((prev) => !prev)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className="panel"
      data-card
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
      style={{
        ...styles.container,
        opacity: isActive ? 1 : 0.4,
        cursor: 'pointer',
        border: hovered ? '1px solid var(--accent)' : '1px solid transparent',
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.header}>
        <div style={styles.portrait}>
          <PixelPortrait data={portraitData} size={32} />
        </div>
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
              {i < warmth ? '\u2665' : '\u2661'}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded info */}
      {expanded && isActive && stage < 7 && (
        <div style={styles.expandedInfo}>
          {description && <p style={styles.description}>{description}</p>}
          <p style={styles.stageInfo}>Stage: {INVESTIGATOR_STAGES[stage]}</p>
          <p style={styles.hint}>Find them on the street to teach</p>
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
    padding: '10px',
  },
  header: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  portrait: {
    flexShrink: 0,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    flex: 1,
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
  expandedInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    paddingTop: '4px',
    borderTop: '1px solid var(--border)',
  },
  description: {
    fontSize: '10px',
    color: 'var(--text-dim)',
    margin: 0,
  },
  stageInfo: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-pixel)',
    margin: 0,
  },
  hint: {
    fontSize: '9px',
    color: 'var(--accent)',
    fontStyle: 'italic',
    margin: 0,
  },
}
