import { useGameStore } from '../store/gameStore'

let toastCounter = 0

export default function ToastContainer() {
  const toasts = useGameStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((t, i) => (
        <div key={`${t.id}-${i}`} className={`toast ${t.type}`}>
          {t.text}
        </div>
      ))}
    </div>
  )
}
