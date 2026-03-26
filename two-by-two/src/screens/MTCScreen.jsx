import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import TypingDrill from '../components/minigames/TypingDrill'
import TeachingCards from '../components/minigames/TeachingCards'

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

  // Fire onDone exactly once when done transitions to true
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

// Renders a sequence of typewriter lines, advancing one at a time
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

// ============ STEP 0: ARRIVAL ============
function StepArrival({ onNext }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)

  const lines = [
    'The Missionary Training Center. Provo, Utah.',
    "Six weeks ago, you were a normal college kid. Now you're Elder.",
    'Your assignment: Budapest, Hungary.',
    'This is your companion, Elder Thompson. You\'ll be together 24/7 for the next six weeks. Get used to it.',
    'Keep your companion happy. An unhappy companion makes everything harder.',
  ]

  const showCompanionCard = lineIndex >= 3

  return (
    <div style={styles.container}>
      <div className="fade-in" style={styles.content}>
        <span className="pixel-font" style={styles.stepLabel}>MTC — DAY 1</span>

        <TypewriterBlock
          lines={lines}
          lineIndex={lineIndex}
          onLineDone={() => setLineIndex(i => i + 1)}
          onAllDone={() => setShowButton(true)}
        />

        {showCompanionCard && (
          <div className="fade-in" style={styles.companionCard}>
            <span className="pixel-font" style={styles.companionName}>Elder Thompson</span>
            <span style={styles.companionArchetype}>The Greenie</span>
            <span style={styles.companionDesc}>
              Fresh from Provo, UT. Memorized every discussion in English but panics when Hungarians talk to him. Brought three jars of peanut butter.
            </span>
            <div style={styles.rapportBar}>
              <span className="pixel-font" style={styles.rapportLabel}>RAPPORT</span>
              <div style={styles.rapportTrack}>
                <div style={{ ...styles.rapportFill, width: '50%' }} />
              </div>
              <span className="pixel-font" style={styles.rapportValue}>5/10</span>
            </div>
          </div>
        )}

        {showButton && (
          <button className="primary fade-in" style={styles.nextBtn} onClick={onNext}>
            <span className="pixel-font">Next</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ============ STEP 1: FIRST HUNGARIAN LESSON ============
function StepLanguage({ onNext }) {
  const [phase, setPhase] = useState('intro') // 'intro' | 'minigame' | 'outro'
  const [lineIndex, setLineIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)

  const introLines = ["Your first Hungarian lesson. Don't panic."]
  const outroLines = [
    "That's the easy part. In Hungary, they talk back.",
    'Your Language skill affects everything — teaching, contacting, even buying groceries.',
  ]

  const handleIntrosDone = useCallback(() => setPhase('minigame'), [])
  const handleScore = useCallback(() => {}, [])
  const handleFinish = useCallback(() => {
    setPhase('outro')
    setLineIndex(0)
  }, [])

  return (
    <div style={styles.container}>
      <div className="fade-in" style={styles.content}>
        <span className="pixel-font" style={styles.stepLabel}>MTC — WEEK 2</span>

        {phase === 'intro' && (
          <TypewriterBlock
            lines={introLines}
            lineIndex={lineIndex}
            onLineDone={() => setLineIndex(i => i + 1)}
            onAllDone={handleIntrosDone}
          />
        )}

        {phase === 'minigame' && (
          <div className="fade-in" style={styles.miniGameBox}>
            <TypingDrill
              difficulty={0}
              onScore={handleScore}
              finishEarly={handleFinish}
              isActive={true}
            />
          </div>
        )}

        {phase === 'outro' && (
          <TypewriterBlock
            lines={outroLines}
            lineIndex={lineIndex}
            onLineDone={() => setLineIndex(i => i + 1)}
            onAllDone={() => setShowButton(true)}
          />
        )}

        {showButton && (
          <button className="primary fade-in" style={styles.nextBtn} onClick={onNext}>
            <span className="pixel-font">Next</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ============ STEP 2: FIRST MOCK LESSON ============
function StepTeaching({ onNext }) {
  const [phase, setPhase] = useState('intro') // 'intro' | 'minigame' | 'outro'
  const [lineIndex, setLineIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)

  const introLines = ['Time to practice teaching. An actor plays an investigator with a concern.']
  const outroLines = [
    'In the field, real people have real doubts. Pick the wrong response and they may stop meeting with you.',
    'Your Skills stat grows with practice. Higher warmth means an investigator trusts you more.',
  ]

  const handleIntrosDone = useCallback(() => setPhase('minigame'), [])
  const handleScore = useCallback(() => {}, [])
  const handleFinish = useCallback(() => {
    setPhase('outro')
    setLineIndex(0)
  }, [])

  return (
    <div style={styles.container}>
      <div className="fade-in" style={styles.content}>
        <span className="pixel-font" style={styles.stepLabel}>MTC — WEEK 4</span>

        {phase === 'intro' && (
          <TypewriterBlock
            lines={introLines}
            lineIndex={lineIndex}
            onLineDone={() => setLineIndex(i => i + 1)}
            onAllDone={handleIntrosDone}
          />
        )}

        {phase === 'minigame' && (
          <div className="fade-in" style={styles.miniGameBox}>
            <TeachingCards
              difficulty={0}
              onScore={handleScore}
              finishEarly={handleFinish}
              isActive={true}
            />
          </div>
        )}

        {phase === 'outro' && (
          <TypewriterBlock
            lines={outroLines}
            lineIndex={lineIndex}
            onLineDone={() => setLineIndex(i => i + 1)}
            onAllDone={() => setShowButton(true)}
          />
        )}

        {showButton && (
          <button className="primary fade-in" style={styles.nextBtn} onClick={onNext}>
            <span className="pixel-font">Next</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ============ STEP 3: YOUR ASSIGNMENT ============
function StepAssignment({ onBegin }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)

  const lines = [
    'You have 104 weeks. Every day, you choose how to spend your morning, afternoon, and evening.',
    "Walk around. Talk to people. Study hard. Don't get sent home.",
  ]

  const statInfo = [
    { key: 'language', label: 'Language', desc: 'How well you speak Hungarian', color: 'var(--accent-bright)' },
    { key: 'spirit', label: 'Spirit', desc: 'Your morale. Drops every day from homesickness.', color: '#c084fc' },
    { key: 'skills', label: 'Skills', desc: 'Your teaching and contacting ability', color: '#60a5fa' },
    { key: 'obedience', label: 'Obedience', desc: 'How well you follow the rules', color: '#34d399' },
    { key: 'budget', label: 'Budget', desc: '45,000 Ft/month. Spend wisely.', color: '#fbbf24' },
  ]

  return (
    <div style={styles.container}>
      <div className="fade-in" style={styles.content}>
        <div style={styles.assignmentReveal}>
          <span className="pixel-font" style={styles.assignmentLabel}>YOUR ASSIGNMENT</span>
          <h2 className="pixel-font" style={styles.assignmentCity}>BUDAPEST, HUNGARY</h2>
          <span style={styles.assignmentFlavor}>
            The Pearl of the Danube. Population: 1.7 million souls, mostly uninterested.
          </span>
        </div>

        <TypewriterBlock
          lines={lines}
          lineIndex={lineIndex}
          onLineDone={() => setLineIndex(i => i + 1)}
          onAllDone={() => setShowButton(true)}
        />

        {lineIndex >= 1 && (
          <div className="fade-in" style={styles.statsGrid}>
            {statInfo.map((stat) => (
              <div key={stat.key} style={styles.statRow}>
                <span className="pixel-font" style={{ ...styles.statLabel, color: stat.color }}>
                  {stat.label}
                </span>
                <span style={styles.statDesc}>{stat.desc}</span>
              </div>
            ))}
          </div>
        )}

        {showButton && (
          <button className="primary fade-in" style={styles.beginBtn} onClick={onBegin}>
            <span className="pixel-font">Begin Mission</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ============ MAIN MTC SCREEN ============
export default function MTCScreen() {
  const startGame = useGameStore((s) => s.startGame)
  const [step, setStep] = useState(0)

  const nextStep = useCallback(() => setStep(s => s + 1), [])

  switch (step) {
    case 0: return <StepArrival onNext={nextStep} />
    case 1: return <StepLanguage onNext={nextStep} />
    case 2: return <StepTeaching onNext={nextStep} />
    case 3: return <StepAssignment onBegin={startGame} />
    default: return null
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '24px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    maxWidth: '480px',
    width: '100%',
  },
  stepLabel: {
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

  // Companion card
  companionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '16px',
    background: 'var(--panel)',
    border: '2px solid var(--accent)',
    borderRadius: '2px',
    width: '100%',
  },
  companionName: {
    fontSize: '14px',
    color: 'var(--accent-bright)',
    letterSpacing: '1px',
  },
  companionArchetype: {
    fontSize: '10px',
    color: 'var(--text-dim)',
    fontStyle: 'italic',
  },
  companionDesc: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
  },
  rapportBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  rapportLabel: {
    fontSize: '8px',
    color: 'var(--text-dim)',
    letterSpacing: '1px',
    flexShrink: 0,
  },
  rapportTrack: {
    flex: 1,
    height: '6px',
    background: 'var(--bg)',
    borderRadius: '1px',
    overflow: 'hidden',
  },
  rapportFill: {
    height: '100%',
    background: 'var(--accent)',
    transition: 'width 0.5s',
  },
  rapportValue: {
    fontSize: '9px',
    color: 'var(--accent)',
    flexShrink: 0,
  },

  // Mini-game wrapper
  miniGameBox: {
    width: '100%',
    padding: '16px',
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '2px',
  },

  // Buttons
  nextBtn: {
    marginTop: '8px',
    padding: '10px 28px',
    fontSize: '12px',
  },
  beginBtn: {
    marginTop: '12px',
    padding: '14px 36px',
    fontSize: '13px',
  },

  // Assignment reveal
  assignmentReveal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'center',
    marginBottom: '8px',
  },
  assignmentLabel: {
    fontSize: '9px',
    color: 'var(--text-dim)',
    letterSpacing: '3px',
  },
  assignmentCity: {
    fontSize: '24px',
    color: 'var(--accent-bright)',
    letterSpacing: '4px',
    lineHeight: 1.2,
  },
  assignmentFlavor: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    maxWidth: '320px',
  },

  // Stats grid
  statsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    padding: '12px',
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '2px',
  },
  statRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
  },
  statLabel: {
    fontSize: '10px',
    letterSpacing: '1px',
    flexShrink: 0,
    width: '80px',
  },
  statDesc: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
  },
}
