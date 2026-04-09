import MainTemplate from './MainTemplate'
import { useInitializeMain } from '@/app/useInitializeMain'
import useEventStore from '@/entities/event/useEventStore'

const MainPage = () => {
  useInitializeMain()
  const events = useEventStore((s) => s.events)

  return <MainTemplate events={events} />
}

export default MainPage
