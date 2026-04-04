import { useGameStore } from './store/gameStore'
import TitleScreen from './screens/TitleScreen'
import MTCScreen from './screens/MTCScreen'
import DailyView from './screens/DailyView'
import PDayView from './screens/PDayView'
import WeeklySummary from './screens/WeeklySummary'
import TransferScreen from './screens/TransferScreen'
import SentHomeScreen from './screens/SentHomeScreen'
import EndgameScreen from './screens/EndgameScreen'
import EventModal from './components/EventModal'
import ObjectionModal from './components/ObjectionModal'
import ToastContainer from './components/ToastContainer'

function App() {
  const screen = useGameStore((s) => s.screen)
  const pendingEvent = useGameStore((s) => s.pendingEvent)
  const pendingObjection = useGameStore((s) => s.pendingObjection)

  const renderScreen = () => {
    switch (screen) {
      case 'title': return <TitleScreen />
      case 'mtc': return <MTCScreen />
      case 'game': return <DailyView />
      case 'pday': return <PDayView />
      case 'summary': return <WeeklySummary />
      case 'transfer': return <TransferScreen />
      case 'sent_home': return <SentHomeScreen />
      case 'endgame': return <EndgameScreen />
      default: return <TitleScreen />
    }
  }

  return (
    <>
      {renderScreen()}
      {pendingEvent && <EventModal />}
      {pendingObjection && <ObjectionModal />}
      <ToastContainer />
    </>
  )
}

export default App
