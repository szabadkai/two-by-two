import { useState, useMemo } from 'react'
import { SERVICE_TASKS } from '../../data/minigameData'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ServiceSlider({ difficulty, onScore, finishEarly, isActive }) {
  const maxHours = difficulty >= 3 ? 6 : difficulty >= 1 ? 5 : 4
  const numTasks = 5

  const [tasks] = useState(() => shuffleArray([...SERVICE_TASKS]).slice(0, numTasks))
  const [allocations, setAllocations] = useState(() => tasks.map(() => 0))

  const totalUsed = allocations.reduce((sum, h) => sum + h, 0)
  const remaining = maxHours - totalUsed

  const totalImpact = useMemo(() => {
    return tasks.reduce((sum, task, i) => {
      if (allocations[i] >= task.hours) return sum + task.impact
      return sum + (task.impact * allocations[i]) / task.hours * 0.5
    }, 0)
  }, [tasks, allocations])

  const maxPossibleImpact = useMemo(() => {
    // Greedy: sort by impact/hour ratio, fill
    const sorted = tasks
      .map((t, i) => ({ ...t, idx: i }))
      .sort((a, b) => b.impact / b.hours - a.impact / a.hours)
    let hoursLeft = maxHours
    let impact = 0
    for (const t of sorted) {
      if (hoursLeft >= t.hours) {
        impact += t.impact
        hoursLeft -= t.hours
      }
    }
    return Math.max(impact, 1)
  }, [tasks, maxHours])

  const handleSlider = (idx, value) => {
    if (!isActive) return
    const newVal = parseInt(value)
    const diff = newVal - allocations[idx]
    if (diff > remaining && diff > 0) return // Can't exceed budget

    const next = [...allocations]
    next[idx] = Math.min(newVal, allocations[idx] + remaining)
    setAllocations(next)

    const newImpact = tasks.reduce((sum, task, i) => {
      const hrs = next[i]
      if (hrs >= task.hours) return sum + task.impact
      return sum + (task.impact * hrs) / task.hours * 0.5
    }, 0)
    onScore(Math.round(newImpact * 10), Math.round(maxPossibleImpact * 10))
  }

  const handleSubmit = () => {
    finishEarly(Math.round(totalImpact * 10), Math.round(maxPossibleImpact * 10))
  }

  return (
    <div className="service-game">
      <div className="service-budget">
        <span className="service-budget-label">Hours remaining</span>
        <span className="service-budget-value">{remaining} / {maxHours}</span>
      </div>

      <div className="service-tasks">
        {tasks.map((task, i) => {
          const complete = allocations[i] >= task.hours
          return (
            <div key={task.name} className={`service-task ${complete ? 'complete' : ''}`}>
              <div className="service-task-header">
                <span className="service-task-icon">{task.icon}</span>
                <span className="service-task-name">{task.name}</span>
                <span className="service-task-meta">
                  {task.hours}h · ★{task.impact}
                </span>
              </div>
              <div className="service-slider-row">
                <input
                  type="range"
                  min="0"
                  max={task.hours}
                  value={allocations[i]}
                  onChange={(e) => handleSlider(i, e.target.value)}
                  className="service-slider"
                  disabled={!isActive}
                />
                <span className="service-hours">{allocations[i]}h</span>
              </div>
            </div>
          )
        })}
      </div>

      {isActive && (
        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 'var(--space-md)' }}
          onClick={handleSubmit}
        >
          Submit Plan
        </button>
      )}
    </div>
  )
}
