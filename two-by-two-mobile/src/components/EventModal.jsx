import { useGameStore } from '../store/gameStore'

export default function EventModal() {
  const event = useGameStore((s) => s.pendingEvent)
  const resolve = useGameStore((s) => s.resolveEventChoice)

  if (!event) return null

  return (
    <div className="modal-overlay">
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">{event.title}</div>
        <div className="modal-text">{event.description}</div>
        <div className="modal-choices">
          {event.choices.map((choice, i) => (
            <button
              key={i}
              className="btn"
              onClick={() => resolve(i)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
