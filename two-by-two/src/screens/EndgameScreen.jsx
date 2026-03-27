import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { useAutoFocus } from '../utils/focusManager'

// Typewriter line — reveals text character by character
function TypewriterLine({ text, speed = 30, active = true, onDone, style }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const firedRef = useRef(false)

  useEffect(() => {
    if (!active) return
    setDisplayed('')
    setDone(false)
    firedRef.current = false
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, active])

  useEffect(() => {
    if (done && !firedRef.current) {
      firedRef.current = true
      if (onDone) onDone()
    }
  }, [done, onDone])

  const skip = () => { setDisplayed(text); setDone(true) }

  return (
    <p style={{ ...styles.narrative, ...style }} onClick={skip}>
      {displayed}
      {!done && <span style={styles.cursor}>|</span>}
    </p>
  )
}

function TypewriterBlock({ lines, lineIndex, onLineDone, onAllDone }) {
  return (
    <div style={styles.textBlock}>
      {lines.map((line, i) => (
        i <= lineIndex && (
          <TypewriterLine
            key={i}
            text={line}
            active={i === lineIndex}
            onDone={i < lines.length - 1 ? onLineDone : onAllDone}
          />
        )
      ))}
    </div>
  )
}

function getArchetype(baptisms, language, spirit, skills, leadership) {
  if (baptisms >= 5 && language >= 60 && spirit >= 50) {
    return { title: 'The Apostle', desc: 'You changed lives. Including your own.' }
  }
  if (language >= 80) {
    return { title: 'The Scholar', desc: 'You may not have baptized many, but you speak Hungarian like a native.' }
  }
  if (leadership === 'ap' || leadership === 'zone_leader') {
    return { title: 'The Leader', desc: 'You ran the mission. The weight was heavy, but you carried it.' }
  }
  if (spirit < 30) {
    return { title: 'The Survivor', desc: 'You made it. Barely. But you made it.' }
  }
  if (baptisms >= 3 && skills >= 50) {
    return { title: 'The Builder', desc: 'Solid. Dependable. The kind of missionary every zone leader wants.' }
  }
  if (language < 20 && baptisms === 0) {
    return { title: 'The Tourist', desc: 'You spent two years in Budapest. You have the photos to prove it.' }
  }
  return { title: 'The Missionary', desc: 'Two years. One name tag. A lifetime of memories.' }
}

function getGrade(score) {
  if (score >= 500) return 'S'
  if (score >= 400) return 'A'
  if (score >= 300) return 'B'
  if (score >= 200) return 'C'
  if (score >= 100) return 'D'
  return 'F'
}

function getGradeColor(grade) {
  switch (grade) {
    case 'S': return '#fbbf24'
    case 'A': return '#34d399'
    case 'B': return '#60a5fa'
    case 'C': return 'var(--text)'
    case 'D': return 'var(--text-muted)'
    case 'F': return 'var(--danger)'
    default: return 'var(--text)'
  }
}

export default function EndgameScreen() {
  const week = useGameStore((s) => s.week)
  const baptisms = useGameStore((s) => s.baptisms)
  const stats = useGameStore((s) => s.stats)
  const leadership = useGameStore((s) => s.leadership)
  const companionHistory = useGameStore((s) => s.companionHistory)
  const investigators = useGameStore((s) => s.investigators)
  const goToScreen = useGameStore((s) => s.goToScreen)

  const [phase, setPhase] = useState('homecoming') // homecoming | stats | archetype | grade | button
  const [lineIndex, setLineIndex] = useState(0)

  const statsBtnRef = useRef(null)
  const archetypeBtnRef = useRef(null)
  const gradeBtnRef = useRef(null)
  const newMissionBtnRef = useRef(null)

  useAutoFocus(statsBtnRef, phase === 'stats')
  useAutoFocus(archetypeBtnRef, phase === 'archetype')
  useAutoFocus(gradeBtnRef, phase === 'grade')
  useAutoFocus(newMissionBtnRef, phase === 'button')

  const weeksServed = Math.min(week, 104)
  const { language, spirit, skills, obedience } = stats

  const companionCount = new Set(companionHistory || []).size
  const investigatorCount = (investigators || []).length

  const archetype = getArchetype(baptisms, language, spirit, skills, leadership)

  const score = Math.min(baptisms * 20, 200) + Math.min(language, 100) + Math.min(spirit, 100) + Math.min(skills, 100) + Math.min(obedience, 100)
  const grade = getGrade(score)

  const homecomingLines = [
    'The plane touches down. Two years, gone like a breath.',
    'Mom is crying before you clear the gate. Dad shakes your hand, then pulls you in.',
    'Sunday morning. The chapel is packed. They saved a spot at the pulpit for you.',
    'You open your mouth to speak, and for a moment, you are back on Vaci utca, rain on your face, companion at your side.',
  ]

  return (
    <div style={styles.container}>
      <div className="fade-in" style={styles.content}>
        <span className="pixel-font" style={styles.sectionLabel}>HOMECOMING</span>

        <div
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              e.currentTarget.querySelector('p')?.click()
            }
          }}
          style={{ outline: 'none' }}
        >
          <TypewriterBlock
            lines={homecomingLines}
            lineIndex={lineIndex}
            onLineDone={() => setLineIndex(i => i + 1)}
            onAllDone={() => setPhase('stats')}
          />
        </div>

        {phase !== 'homecoming' && (
          <div className="fade-in" style={styles.statsSection}>
            <span className="pixel-font" style={styles.sectionLabel}>MISSION STATS</span>
            <div style={styles.statsGrid}>
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
                <span style={styles.statVal}>{language} / 100</span>
              </div>
              <div style={styles.statRow}>
                <span className="pixel-font" style={styles.statLabel}>Spirit</span>
                <span style={styles.statVal}>{spirit} / 100</span>
              </div>
              <div style={styles.statRow}>
                <span className="pixel-font" style={styles.statLabel}>Skills</span>
                <span style={styles.statVal}>{skills} / 100</span>
              </div>
              <div style={styles.statRow}>
                <span className="pixel-font" style={styles.statLabel}>Obedience</span>
                <span style={styles.statVal}>{obedience} / 100</span>
              </div>
              <div style={styles.statRow}>
                <span className="pixel-font" style={styles.statLabel}>Companions</span>
                <span style={styles.statVal}>{companionCount}</span>
              </div>
              <div style={styles.statRow}>
                <span className="pixel-font" style={styles.statLabel}>Investigators</span>
                <span style={styles.statVal}>{investigatorCount}</span>
              </div>
            </div>
            {phase === 'stats' && (
              <button
                ref={statsBtnRef}
                className="primary fade-in"
                style={styles.continueBtn}
                onClick={() => setPhase('archetype')}
              >
                <span className="pixel-font">Continue</span>
              </button>
            )}
          </div>
        )}

        {(phase === 'archetype' || phase === 'grade' || phase === 'button') && (
          <div className="fade-in" style={styles.archetypeSection}>
            <span className="pixel-font" style={styles.sectionLabel}>YOUR LEGACY</span>
            <div style={styles.archetypeCard}>
              <span className="pixel-font" style={styles.archetypeTitle}>{archetype.title}</span>
              <span style={styles.archetypeDesc}>{archetype.desc}</span>
            </div>
            {phase === 'archetype' && (
              <button
                ref={archetypeBtnRef}
                className="primary fade-in"
                style={styles.continueBtn}
                onClick={() => setPhase('grade')}
              >
                <span className="pixel-font">Continue</span>
              </button>
            )}
          </div>
        )}

        {(phase === 'grade' || phase === 'button') && (
          <div className="fade-in" style={styles.gradeSection}>
            <span className="pixel-font" style={styles.sectionLabel}>FINAL GRADE</span>
            <span
              className="pixel-font"
              style={{ ...styles.gradeDisplay, color: getGradeColor(grade) }}
            >
              {grade}
            </span>
            <span style={styles.gradeScore}>{score} / 600</span>
            {phase === 'grade' && (
              <button
                ref={gradeBtnRef}
                className="primary fade-in"
                style={styles.continueBtn}
                onClick={() => setPhase('button')}
              >
                <span className="pixel-font">Continue</span>
              </button>
            )}
          </div>
        )}

        {phase === 'button' && (
          <button
            ref={newMissionBtnRef}
            className="primary fade-in"
            style={styles.newMissionBtn}
            onClick={() => goToScreen('title')}
          >
            <span className="pixel-font">Start New Mission</span>
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '40px 24px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    maxWidth: '480px',
    width: '100%',
  },
  sectionLabel: {
    fontSize: '9px',
    color: 'var(--text-dim)',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  textBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
  },
  narrative: {
    fontSize: '13px',
    color: 'var(--text)',
    lineHeight: 1.6,
    margin: 0,
    cursor: 'pointer',
  },
  cursor: {
    color: 'var(--accent)',
    fontWeight: 'bold',
  },

  // Stats
  statsSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '100%',
    padding: '12px',
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '2px',
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
    letterSpacing: '1px',
  },
  statVal: {
    fontSize: '11px',
    color: 'var(--text)',
  },

  // Archetype
  archetypeSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  },
  archetypeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px',
    background: 'var(--panel)',
    border: '2px solid var(--accent)',
    borderRadius: '2px',
    width: '100%',
    textAlign: 'center',
  },
  archetypeTitle: {
    fontSize: '16px',
    color: 'var(--accent-bright)',
    letterSpacing: '2px',
  },
  archetypeDesc: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },

  // Grade
  gradeSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  gradeDisplay: {
    fontSize: '64px',
    letterSpacing: '4px',
    lineHeight: 1,
  },
  gradeScore: {
    fontSize: '11px',
    color: 'var(--text-dim)',
  },

  // Buttons
  continueBtn: {
    marginTop: '4px',
    padding: '10px 28px',
    fontSize: '12px',
  },
  newMissionBtn: {
    marginTop: '8px',
    padding: '14px 36px',
    fontSize: '13px',
  },
}
