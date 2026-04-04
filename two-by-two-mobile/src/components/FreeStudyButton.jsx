import { useState } from 'react'
import MinigameWrapper from './MinigameWrapper'
import FlashCards from './minigames/FlashCards'
import ScriptureQuiz from './minigames/ScriptureQuiz'
import PixelIcon from './PixelIcon'
import { useGameStore } from '../store/gameStore'
import { getDifficulty, getMinigameDuration } from '../engine/minigameEngine'

const FREE_GAMES = {
  language: {
    component: FlashCards,
    title: 'Language Practice',
    activityId: 'study_language',
    stat: 'language',
    icon: '🇭🇺',
  },
  scripture: {
    component: ScriptureQuiz,
    title: 'Scripture Study',
    activityId: 'personal_study',
    stat: 'spirit',
    icon: '📖',
  },
}

export default function FreeStudyButton() {
  const [showPicker, setShowPicker] = useState(false)
  const [activeGame, setActiveGame] = useState(null)
  const stats = useGameStore((s) => s.stats)
  const addToast = useGameStore((s) => s.addToast)
  const applyFreeStudy = useGameStore((s) => s.applyFreeStudy)

  const handlePick = (type) => {
    setShowPicker(false)
    setActiveGame(type)
  }

  const handleComplete = (score) => {
    const game = FREE_GAMES[activeGame]
    if (game && applyFreeStudy) {
      applyFreeStudy(game.stat, score)
    }
    const label = activeGame === 'language' ? 'Language' : 'Spirit'
    const delta = Math.round(score * 3) // ×0.5 of normal ~6 max = ~3
    if (delta > 0) {
      addToast(`Free study: ${label} +${delta}`, 'good')
    } else {
      addToast('Keep practicing!', 'info')
    }
    setActiveGame(null)
  }

  const handleCancel = () => {
    setActiveGame(null)
  }

  // Active minigame
  if (activeGame) {
    const game = FREE_GAMES[activeGame]
    const Component = game.component
    const difficulty = getDifficulty(game.activityId, stats)
    const duration = getMinigameDuration(difficulty)

    return (
      <MinigameWrapper
        title={`${game.title} (Free)`}
        duration={duration}
        onComplete={handleComplete}
        onCancel={handleCancel}
      >
        {({ onScore, finishEarly, timeLeft, isActive }) => (
          <Component
            difficulty={difficulty}
            onScore={onScore}
            finishEarly={finishEarly}
            timeLeft={timeLeft}
            isActive={isActive}
          />
        )}
      </MinigameWrapper>
    )
  }

  return (
    <>
      {/* Floating study button */}
      <button
        className="free-study-fab"
        onClick={() => setShowPicker(true)}
        aria-label="Free Study"
      >
        <PixelIcon name="book" size={24} color="#fff" />
      </button>

      {/* Picker bottom sheet */}
      {showPicker && (
        <div className="modal-overlay" onClick={() => setShowPicker(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">Free Study</div>
            <div className="modal-text">
              Practice without using a time slot. Earn reduced stat bonuses.
            </div>
            <div className="modal-choices">
              {Object.entries(FREE_GAMES).map(([key, game]) => (
                <button
                  key={key}
                  className="btn"
                  onClick={() => handlePick(key)}
                >
                  <span style={{ marginRight: 8 }}>{game.icon}</span>
                  {game.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
