import { useGameStore } from './store/gameStore'
import TitleScreen from './screens/TitleScreen'
import DailyView from './screens/DailyView'
import PDayView from './screens/PDayView'
import WeeklySummary from './screens/WeeklySummary'
import EventModal from './components/EventModal'

function App() {
  const screen = useGameStore((s) => s.screen)
  const pendingEvent = useGameStore((s) => s.pendingEvent)

  const renderScreen = () => {
    switch (screen) {
      case 'title': return <TitleScreen />
      case 'game': return <DailyView />
      case 'pday': return <PDayView />
      case 'summary': return <WeeklySummary />
      default: return <TitleScreen />
    }
  }

  return (
    <div className="game-container">
      {renderScreen()}
      {pendingEvent && <EventModal />}
    </div>
  )
}

export default App
