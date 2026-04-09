import { useQuery } from '@tanstack/react-query'
import { getVideos } from '@/entities/video/VideoApi'
import { Video } from '@/entities/video/VideoType'
import useVideoStore from '@/entities/video/useVideoStore'

export const VIDEO_QUERY_KEY = {
  list: (disasterHistoryId?: string | null) => ['videos', disasterHistoryId] as const,
}

/**
 * 비디오 목록을 조회하는 React-Query 훅.
 */
export const useVideos = (disasterHistoryId?: string | null) => {
  const { setVideos } = useVideoStore()

  return useQuery({
    queryKey: VIDEO_QUERY_KEY.list(disasterHistoryId),
    queryFn: async () => {
      const response = await getVideos(disasterHistoryId ?? undefined)
      const videos = response.data as Video[]
      setVideos(videos)
      return videos
    },
    enabled: !!disasterHistoryId,
    staleTime: 1000 * 30,
  })
}
