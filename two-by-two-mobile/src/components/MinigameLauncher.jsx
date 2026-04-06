import { useEffect } from 'react'
import MinigameWrapper from './MinigameWrapper'
import FlashCards from './minigames/FlashCards'
import ConcernMatch from './minigames/ConcernMatch'
import DialogueSwipe from './minigames/DialogueSwipe'
import MemoryTap from './minigames/MemoryTap'
import ServiceSlider from './minigames/ServiceSlider'
import WordPick from './minigames/WordPick'
import ScriptureQuiz from './minigames/ScriptureQuiz'
import { ACTIVITY_MINIGAME_MAP, getDifficulty, getMinigameDuration } from '../engine/minigameEngine'

const MINIGAME_COMPONENTS = {
  flashcards: { component: FlashCards, title: 'Language Study' },
  concern: { component: ConcernMatch, title: 'Teach Investigator' },
  dialogue: { component: DialogueSwipe, title: 'Street Contacting' },
  memory: { component: MemoryTap, title: 'Companion Study' },
  service: { component: ServiceSlider, title: 'Service Project' },
  wordpick: { component: WordPick, title: 'English Class' },
  scripture: { component: ScriptureQuiz, title: 'Personal Study' },
}

export default function MinigameLauncher({ activityId, stats, onComplete, onCancel }) {
  const minigameType = ACTIVITY_MINIGAME_MAP[activityId]
  const config = minigameType ? MINIGAME_COMPONENTS[minigameType] : null
  const shouldAutoResolve = !minigameType || !config

  useEffect(() => {
    if (shouldAutoResolve) {
      onComplete(0.6)
    }
  }, [shouldAutoResolve, onComplete])

  if (shouldAutoResolve) return null

  const { component: MinigameComponent, title } = config
  const difficulty = getDifficulty(activityId, stats)
  const duration = getMinigameDuration(difficulty, minigameType)

  return (
    <MinigameWrapper
      title={title}
      duration={duration}
      onComplete={onComplete}
      onCancel={onCancel}
    >
      {({ onScore, finishEarly, timeLeft, isActive }) => (
        <MinigameComponent
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
