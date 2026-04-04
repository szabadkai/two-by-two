import { useGameStore } from '../store/gameStore'

export default function EndgameScreen() {
  const stats = useGameStore((s) => s.stats)
  const baptisms = useGameStore((s) => s.baptisms)
  const goToScreen = useGameStore((s) => s.goToScreen)

  // Determine ending archetype
  let archetype = 'The Quiet Servant'
  if (baptisms >= 8 && stats.obedience >= 70) archetype = 'The Golden Missionary'
  else if (stats.language >= 80) archetype = 'The Cultural Ambassador'
  else if (stats.spirit < 30) archetype = 'The Burnout'
  else if (baptisms >= 5) archetype = 'The Rebel with a Cause'

  return (
    <div className="title-screen screen-enter">
      <div style={{ fontSize: '3rem', opacity: 0.5 }}>🏠</div>
      <h1>HOMECOMING</h1>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--accent)', marginBottom: 8 }}>
        {archetype}
      </div>
      <div className="subtitle" style={{ maxWidth: 320 }}>
        24 months in Budapest. {baptisms} baptism{baptisms !== 1 ? 's' : ''}.
        Language: {stats.language}. Spirit: {stats.spirit}.
        You did it, Elder.
      </div>
      <button className="btn btn-primary" onClick={() => goToScreen('title')}>
        New Game
      </button>
    </div>
  )
}
