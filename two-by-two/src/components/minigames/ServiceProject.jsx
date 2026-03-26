import { useState, useEffect, useCallback } from 'react'
import { SERVICE_TASKS } from '../../data/minigameData'

/**
 * Service Project Minigame: Allocate limited hours to maximize community impact.
 */
export default function ServiceProject({ difficulty, onScore, finishEarly, isActive }) {
  const totalHours = Math.max(4, 6 - difficulty) // harder = fewer hours
  const [tasks] = useState(() => shuffle(SERVICE_TASKS).slice(0, 5))
  const [allocations, setAllocations] = useState({})
  const [hoursUsed, setHoursUsed] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const maxImpact = tasks.reduce((sum, t) => sum + t.impact, 0)
  const currentImpact = tasks.reduce((sum, t) => sum + (allocations[t.name] ? t.impact : 0), 0)

  useEffect(() => {
    onScore(currentImpact, maxImpact)
  }, [currentImpact, maxImpact, onScore])

  const toggleTask = useCallback((task) => {
    if (!isActive || submitted) return

    setAllocations(prev => {
      const newAlloc = { ...prev }
      if (newAlloc[task.name]) {
        // Remove
        delete newAlloc[task.name]
        setHoursUsed(h => h - task.hours)
      } else {
        // Add if enough hours
        const newHours = hoursUsed + task.hours
        if (newHours <= totalHours) {
          newAlloc[task.name] = true
          setHoursUsed(newHours)
        }
      }
      return newAlloc
    })
  }, [isActive, submitted, hoursUsed, totalHours])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    finishEarly(currentImpact, maxImpact)
  }, [currentImpact, maxImpact, finishEarly])

  return (
    <div style={styles.container}>
      {/* Hours budget */}
      <div style={styles.budget}>
        <span className="pixel-font" style={styles.budgetLabel}>HOURS AVAILABLE</span>
        <div style={styles.hoursBar}>
          {Array.from({ length: totalHours }).map((_, i) => (
            <div key={i} style={{
              ...styles.hourBlock,
              background: i < hoursUsed ? 'var(--accent)' : 'var(--panel-light)',
            }} />
          ))}
        </div>
        <span className="pixel-font" style={styles.hoursText}>
          {totalHours - hoursUsed} remaining
        </span>
      </div>

      {/* Tasks */}
      <div style={styles.tasks}>
        {tasks.map((task) => {
          const selected = !!allocations[task.name]
          const canAfford = hoursUsed + task.hours <= totalHours
          return (
            <button
              key={task.name}
              onClick={() => toggleTask(task)}
              disabled={submitted}
              style={{
                ...styles.taskBtn,
                borderColor: selected ? 'var(--success)' : 'var(--border)',
                background: selected ? 'rgba(100, 180, 100, 0.1)' : 'var(--panel-light)',
                opacity: !selected && !canAfford ? 0.4 : 1,
              }}
            >
              <div style={styles.taskHeader}>
                <span style={styles.taskIcon}>{task.icon}</span>
                <span style={styles.taskName}>{task.name}</span>
                {selected && <span className="pixel-font" style={styles.check}>✓</span>}
              </div>
              <div style={styles.taskMeta}>
                <span className="pixel-font" style={styles.taskHours}>{task.hours}h</span>
                <span className="pixel-font" style={styles.taskImpact}>
                  {'★'.repeat(task.impact)}{'☆'.repeat(4 - task.impact)}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Submit */}
      <button
        className="primary"
        onClick={handleSubmit}
        disabled={submitted || hoursUsed === 0}
        style={styles.submitBtn}
      >
        <span className="pixel-font">Finish Service ({currentImpact} impact)</span>
      </button>
    </div>
  )
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '12px' },
  budget: { display: 'flex', alignItems: 'center', gap: '8px' },
  budgetLabel: { fontSize: '9px', color: 'var(--text-dim)', flexShrink: 0 },
  hoursBar: { display: 'flex', gap: '3px', flex: 1 },
  hourBlock: { flex: 1, height: '12px', borderRadius: '1px', transition: 'background 0.2s' },
  hoursText: { fontSize: '9px', color: 'var(--accent)', flexShrink: 0 },
  tasks: { display: 'flex', flexDirection: 'column', gap: '6px' },
  taskBtn: {
    display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 10px',
    border: '1px solid', borderRadius: '2px', cursor: 'pointer', textAlign: 'left',
    background: 'var(--panel-light)',
  },
  taskHeader: { display: 'flex', alignItems: 'center', gap: '8px' },
  taskIcon: { fontSize: '14px' },
  taskName: { fontSize: '11px', color: 'var(--text)', flex: 1 },
  check: { fontSize: '10px', color: 'var(--success)' },
  taskMeta: { display: 'flex', justifyContent: 'space-between' },
  taskHours: { fontSize: '9px', color: 'var(--budget)' },
  taskImpact: { fontSize: '9px', color: 'var(--accent)' },
  submitBtn: { alignSelf: 'center', padding: '8px 20px', fontSize: '10px' },
}
