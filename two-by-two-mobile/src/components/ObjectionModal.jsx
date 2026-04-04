import { useGameStore } from '../store/gameStore'

export default function ObjectionModal() {
  const objection = useGameStore((s) => s.pendingObjection)
  const resolve = useGameStore((s) => s.resolveObjectionChoice)

  if (!objection) return null

  const invName = objection.investigator?.name || 'They'
  const displayText = objection.text.replace(/\{name\}/g, invName)

  // Map quality to effect
  const qualityToEffect = (quality) => {
    switch (quality) {
      case 'good': return { advance: true, warmthDelta: 1 }
      case 'neutral': return { advance: true, warmthDelta: 0 }
      case 'weak': return { advance: false, warmthDelta: -1 }
      default: return { advance: true, warmthDelta: 0 }
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">{invName} has a concern</div>
        <div className="modal-text">{displayText}</div>
        <div className="modal-choices">
          {objection.options.map((option, i) => (
            <button
              key={i}
              className="btn"
              onClick={() => resolve(option.effect || qualityToEffect(option.quality))}
            >
              {option.label || option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
