import { useGameStore } from '../store/gameStore'

export default function SentHomeScreen() {
  const warnings = useGameStore((s) => s.warnings)
  const goToScreen = useGameStore((s) => s.goToScreen)

  return (
    <div className="title-screen screen-enter">
      <div style={{ fontSize: '3rem', opacity: 0.5 }}>✈️</div>
      <h1 style={{ color: 'var(--danger)' }}>SENT HOME</h1>
      <div className="subtitle">
        {warnings >= 3
          ? "Three strikes. President Kovács made the call. Your mission is over early. The plane ticket home was already booked."
          : "The mission office decided it was time. You're going home."}
      </div>
      <button className="btn" onClick={() => goToScreen('title')}>
        Return to Title
      </button>
    </div>
  )
}
