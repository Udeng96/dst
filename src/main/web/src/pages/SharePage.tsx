import ShareTemplate from './ShareTemplate'
import { useParams } from 'react-router'
import { useInitializeShare } from '@/app/useInitializeShare'
import { useVideos } from '@/entities/video/useVideos'
import useEventStore from '@/entities/event/useEventStore'
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore'
import useVideoStore from '@/entities/video/useVideoStore'

const SharePage = () => {
  const { disasterHistoryId } = useParams<{
    disasterHistoryId: string
  }>()

  // 공유 페이지 초기화 (disasterHistory + event 순차 조회 및 만료 검증)
  useInitializeShare(disasterHistoryId)

  // 비디오 목록 조회
  useVideos(disasterHistoryId)

  const selectedEvent = useEventStore((s) => s.selectedEvent)
  const selectedDisasterHistory = useDisasterHistoryStore((s) => s.selectedDisasterHistory)
  const videos = useVideoStore((s) => s.videos)

  return (
    <ShareTemplate
      event={selectedEvent}
      disasterHistory={selectedDisasterHistory}
      videos={videos}
    />
  )
}

export default SharePage
