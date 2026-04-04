import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import FlashCards from '../components/minigames/FlashCards'
import ConcernMatch from '../components/minigames/ConcernMatch'

// ── Typewriter line — reveals text character by character ──
function TypewriterLine({ text, speed = 30, active = true, onDone }) {
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
    <p className="mtc-narrative" onClick={skip}>
      {displayed}
      {!done && <span className="mtc-cursor">|</span>}
    </p>
  )
}

// Renders a sequence of typewriter lines, advancing one at a time
function TypewriterBlock({ lines, lineIndex, onLineDone, onAllDone }) {
  return (
    <div className="mtc-text-block">
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

// ════════════ STEP 0: ARRIVAL ════════════
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
    <div className="mtc-container screen-enter">
      <div className="mtc-content">
        <span className="mtc-step-label">MTC — DAY 1</span>
        <TypewriterBlock
          lines={lines}
          lineIndex={lineIndex}
          onLineDone={() => setLineIndex(i => i + 1)}
          onAllDone={() => setShowButton(true)}
        />

        {showCompanionCard && (
          <div className="mtc-companion-card fade-in">
            <span className="mtc-companion-name">Elder Thompson</span>
            <span className="mtc-companion-archetype">The Greenie</span>
            <span className="mtc-companion-desc">
              Fresh from Provo, UT. Memorized every discussion in English but panics when Hungarians talk to him. Brought three jars of peanut butter.
            </span>
            <div className="mtc-rapport-bar">
              <span className="mtc-rapport-label">RAPPORT</span>
              <div className="mtc-rapport-track">
                <div className="mtc-rapport-fill" style={{ width: '50%' }} />
              </div>
              <span className="mtc-rapport-value">5/10</span>
            </div>
          </div>
        )}

        {showButton && (
          <button className="btn btn-primary fade-in mtc-next-btn" onClick={onNext}>
            Next
          </button>
        )}
      </div>
    </div>
  )
}

// ════════════ STEP 1: FIRST HUNGARIAN LESSON ════════════
function StepLanguage({ onNext }) {
  const [phase, setPhase] = useState('intro')
  const [lineIndex, setLineIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)

  const introLines = ["Your first Hungarian lesson. Don't panic."]
  const outroLines = [
    "That's the easy part. In Hungary, they talk back.",
    'Your Language skill affects everything — teaching, contacting, even buying groceries.',
  ]

  const handleIntrosDone = useCallback(() => setPhase('minigame'), [])
  const handleFinish = useCallback(() => {
    setPhase('outro')
    setLineIndex(0)
  }, [])

  return (
    <div className="mtc-container screen-enter">
      <div className="mtc-content">
        <span className="mtc-step-label">MTC — WEEK 2</span>

        {phase === 'intro' && (
          <TypewriterBlock
            lines={introLines}
            lineIndex={lineIndex}
            onLineDone={() => setLineIndex(i => i + 1)}
            onAllDone={handleIntrosDone}
          />
        )}

        {phase === 'minigame' && (
          <div className="mtc-minigame-box fade-in">
            <FlashCards
              difficulty={0}
              onScore={() => {}}
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
          <button className="btn btn-primary fade-in mtc-next-btn" onClick={onNext}>
            Next
          </button>
        )}
      </div>
    </div>
  )
}

// ════════════ STEP 2: FIRST MOCK LESSON ════════════
function StepTeaching({ onNext }) {
  const [phase, setPhase] = useState('intro')
  const [lineIndex, setLineIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)

  const introLines = ['Time to practice teaching. An actor plays an investigator with a concern.']
  const outroLines = [
    'In the field, real people have real doubts. Pick the wrong response and they may stop meeting with you.',
    'Your Skills stat grows with practice. Higher warmth means an investigator trusts you more.',
  ]

  const handleIntrosDone = useCallback(() => setPhase('minigame'), [])
  const handleFinish = useCallback(() => {
    setPhase('outro')
    setLineIndex(0)
  }, [])

  return (
    <div className="mtc-container screen-enter">
      <div className="mtc-content">
        <span className="mtc-step-label">MTC — WEEK 4</span>

        {phase === 'intro' && (
          <TypewriterBlock
            lines={introLines}
            lineIndex={lineIndex}
            onLineDone={() => setLineIndex(i => i + 1)}
            onAllDone={handleIntrosDone}
          />
        )}

        {phase === 'minigame' && (
          <div className="mtc-minigame-box fade-in">
            <ConcernMatch
              difficulty={0}
              onScore={() => {}}
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
          <button className="btn btn-primary fade-in mtc-next-btn" onClick={onNext}>
            Next
          </button>
        )}
      </div>
    </div>
  )
}

// ════════════ STEP 3: YOUR ASSIGNMENT ════════════
function StepAssignment({ onBegin }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)

  const lines = [
    'You have 104 weeks. Every day, you choose how to spend your morning, afternoon, and evening.',
    "Walk around. Talk to people. Study hard. Don't get sent home.",
  ]

  const statInfo = [
    { key: 'language', label: 'Language', desc: 'How well you speak Hungarian', color: 'var(--stat-language)' },
    { key: 'spirit', label: 'Spirit', desc: 'Your morale. Drops every day from homesickness.', color: 'var(--stat-spirit)' },
    { key: 'skills', label: 'Skills', desc: 'Your teaching and contacting ability', color: 'var(--stat-skills)' },
    { key: 'obedience', label: 'Obedience', desc: 'How well you follow the rules', color: 'var(--stat-obedience)' },
    { key: 'budget', label: 'Budget', desc: '45,000 Ft/month. Spend wisely.', color: 'var(--stat-budget)' },
  ]

  return (
    <div className="mtc-container screen-enter">
      <div className="mtc-content">
        <div className="mtc-assignment-reveal">
          <span className="mtc-step-label">YOUR ASSIGNMENT</span>
          <h2 className="mtc-assignment-city">BUDAPEST, HUNGARY</h2>
          <span className="mtc-assignment-flavor">
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
          <div className="mtc-stats-grid fade-in">
            {statInfo.map((stat) => (
              <div key={stat.key} className="mtc-stat-row">
                <span className="mtc-stat-label" style={{ color: stat.color }}>
                  {stat.label}
                </span>
                <span className="mtc-stat-desc">{stat.desc}</span>
              </div>
            ))}
          </div>
        )}

        {showButton && (
          <button className="btn btn-primary fade-in mtc-begin-btn" onClick={onBegin}>
            Begin Mission
          </button>
        )}
      </div>
    </div>
  )
}

// ════════════ MAIN MTC SCREEN ════════════
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
