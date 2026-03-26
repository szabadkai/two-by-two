import MinigameWrapper from './MinigameWrapper'
import TypingDrill from './minigames/TypingDrill'
import TeachingCards from './minigames/TeachingCards'
import ContactDialogue from './minigames/ContactDialogue'
import MemoryGame from './minigames/MemoryGame'
import ServiceProject from './minigames/ServiceProject'
import FillBlanks from './minigames/FillBlanks'
import SpeedRead from './minigames/SpeedRead'
import { ACTIVITY_MINIGAME_MAP, getDifficulty, getMinigameDuration } from '../engine/minigameEngine'

const MINIGAME_COMPONENTS = {
  typing: { component: TypingDrill, title: 'Language Study' },
  cards: { component: TeachingCards, title: 'Teach Investigator' },
  dialogue: { component: ContactDialogue, title: 'Street Contacting' },
  memory: { component: MemoryGame, title: 'Companion Study' },
  service: { component: ServiceProject, title: 'Service Project' },
  fillblanks: { component: FillBlanks, title: 'English Class' },
  speedread: { component: SpeedRead, title: 'Personal Study' },
}

/**
 * Launches the appropriate minigame for an activity.
 * Returns null if the activity has no minigame (auto-resolves).
 */
export default function MinigameLauncher({ activityId, stats, onComplete, onCancel }) {
  const minigameType = ACTIVITY_MINIGAME_MAP[activityId]

  if (!minigameType) {
    // No minigame for this activity — auto-complete with average score
    onComplete(0.6)
    return null
  }

  const config = MINIGAME_COMPONENTS[minigameType]
  if (!config) {
    onComplete(0.6)
    return null
  }

  const { component: MinigameComponent, title } = config
  const difficulty = getDifficulty(activityId, stats)
  const duration = getMinigameDuration(difficulty)

  return (
    <MinigameWrapper
      title={title}
      duration={duration}
      onComplete={onComplete}
      onCancel={() => onCancel()}
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
