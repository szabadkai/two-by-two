import { useGameStore } from '../store/gameStore'
import { hasLocalSave, getLocalSaveInfo } from '../utils/saveLoad'

export default function TitleScreen() {
  const startMTC = useGameStore((s) => s.startMTC)
  const startGame = useGameStore((s) => s.startGame)
  const loadAutoSave = useGameStore((s) => s.loadAutoSave)

  const hasSave = hasLocalSave()
  const saveInfo = hasSave ? getLocalSaveInfo() : null

  return (
    <div className="title-screen screen-enter">
      <svg width="64" height="96" viewBox="0 0 32 48" style={{ opacity: 0.35 }}>
        {/* Angel Moroni — robed figure, right arm raised with trumpet */}
        {/* Head */}
        <rect x="14" y="1" width="4" height="4" fill="#c4793c"/>
        {/* Neck */}
        <rect x="15" y="5" width="2" height="1" fill="#c4793c"/>
        {/* Shoulders + torso */}
        <rect x="12" y="6" width="8" height="3" fill="#c4793c"/>
        <rect x="13" y="9" width="6" height="4" fill="#c4793c"/>
        {/* Left arm down (holding plates) */}
        <rect x="10" y="7" width="2" height="5" fill="#c4793c"/>
        <rect x="9" y="11" width="3" height="2" fill="#c4793c"/>
        {/* Right arm raised */}
        <rect x="20" y="6" width="2" height="2" fill="#c4793c"/>
        <rect x="21" y="3" width="2" height="4" fill="#c4793c"/>
        <rect x="22" y="1" width="2" height="3" fill="#c4793c"/>
        {/* Trumpet extending right from raised hand */}
        <rect x="24" y="1" width="6" height="2" fill="#c4793c"/>
        <rect x="30" y="0" width="2" height="4" fill="#c4793c"/>
        {/* Robe / skirt flaring out */}
        <rect x="12" y="13" width="8" height="3" fill="#c4793c"/>
        <rect x="11" y="16" width="10" height="3" fill="#c4793c"/>
        <rect x="10" y="19" width="12" height="3" fill="#c4793c"/>
        <rect x="9" y="22" width="14" height="3" fill="#c4793c"/>
        <rect x="8" y="25" width="16" height="2" fill="#c4793c"/>
        {/* Feet */}
        <rect x="11" y="27" width="4" height="2" fill="#c4793c"/>
        <rect x="17" y="27" width="4" height="2" fill="#c4793c"/>
        {/* Pedestal / ball */}
        <rect x="10" y="29" width="12" height="2" fill="#8a6030"/>
        <rect x="8" y="31" width="16" height="2" fill="#8a6030"/>
        <rect x="6" y="33" width="20" height="1" fill="#8a6030"/>
      </svg>
      <h1>TWO BY TWO</h1>
      <div className="subtitle">
        A Mormon Missionary Management Sim.
        Budapest, Hungary. 24 months. One name tag.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', width: '100%', maxWidth: 280 }}>
        <button className="btn btn-primary" onClick={startMTC}>
          New Mission
        </button>
        {hasSave && (
          <button className="btn" onClick={loadAutoSave}>
            Continue {saveInfo ? `(Week ${saveInfo.week})` : ''}
          </button>
        )}
        <button className="btn" onClick={startGame}>
          Skip Tutorial
        </button>
      </div>

      <div className="version">v0.1.0 · Mobile MVP</div>
    </div>
  )
}
