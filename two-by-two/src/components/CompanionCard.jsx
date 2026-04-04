import { useState, useEffect, useMemo } from 'react'
import { getCompanionMood, getCompanionQuote } from '../engine/companionEngine'
import PixelPortrait from './PixelPortrait'
import { getCompanionPortrait } from '../data/portraits'

export default function CompanionCard({ companion }) {
  const [quote, setQuote] = useState('')
  const mood = getCompanionMood(companion.rapport)
  const portraitData = useMemo(() => getCompanionPortrait(companion), [companion.id, companion.name])

  useEffect(() => {
    setQuote(getCompanionQuote(companion))
  }, [companion.rapport])

  const moodColors = {
    happy: 'var(--success)',
    neutral: 'var(--budget)',
    unhappy: 'var(--danger)',
  }

  const moodEmoji = {
    happy: ':)',
    neutral: ':|',
    unhappy: ':(',
  }

  return (
    <div className="panel" data-card tabIndex={0} style={styles.container}>
      <div style={styles.header}>
        <div style={styles.portrait}>
          <PixelPortrait data={portraitData} size={40} />
        </div>
        <div style={styles.info}>
          <div className="pixel-font" style={styles.name}>{companion.name}</div>
          <div style={styles.archetype}>{companion.archetype}</div>
          <div style={{ ...styles.mood, color: moodColors[mood] }}>
            <span className="pixel-font">{moodEmoji[mood]}</span>
          </div>
        </div>
      </div>
      <div style={styles.rapportRow}>
        <span className="pixel-font" style={styles.rapportLabel}>Rapport</span>
        <div style={styles.rapportBar}>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              style={{
                ...styles.rapportDot,
                background: i < companion.rapport ? 'var(--rapport)' : 'var(--panel-light)',
              }}
            />
          ))}
        </div>
      </div>
      {quote && (
        <div style={styles.quoteBox}>
          <span style={styles.quote}>"{quote}"</span>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '10px',
  },
  header: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  portrait: {
    width: '40px',
    height: '40px',
    flexShrink: 0,
  },
  portraitPlaceholder: {
    width: '40px',
    height: '40px',
    background: 'var(--panel-light)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    imageRendering: 'pixelated',
  },
  portraitInitials: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '16px',
    color: 'var(--text-dim)',
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
  archetype: {
    fontSize: '10px',
    color: 'var(--text-muted)',
  },
  mood: {
    fontSize: '10px',
  },
  rapportRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  rapportLabel: {
    fontSize: '9px',
    color: 'var(--rapport)',
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  rapportBar: {
    display: 'flex',
    gap: '2px',
    flex: 1,
  },
  rapportDot: {
    width: '100%',
    height: '6px',
    borderRadius: '1px',
  },
  quoteBox: {
    background: 'var(--bg-dark)',
    padding: '6px 8px',
    borderRadius: '2px',
    borderLeft: '2px solid var(--border-light)',
  },
  quote: {
    fontSize: '10px',
    color: 'var(--text-dim)',
    fontStyle: 'italic',
    lineHeight: 1.4,
  },
}
