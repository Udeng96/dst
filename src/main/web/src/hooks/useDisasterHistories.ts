import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDisasterHistories,
  getDisasterHistory,
  saveDisasterHistory,
  getDisasterHistoryVideoMappings,
  chkPwd,
  saveDisasterHistoryFileMappings,
  saveDisasterHistoryVideoMappings,
} from '@/entities/disaster-history/DisasterHistoryApi'
import { getVideos } from '@/entities/video/VideoApi'
import { DisasterHistory } from '@/entities/disaster-history/DisasterHistoryType'
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore'
import useVideoStore from '@/entities/video/useVideoStore'
import useLoadingStore from '@/entities/event/useLoadingStore'
import usePopupStore from '@/entities/event/usePopupStore'
import useEventStore from '@/entities/event/useEventStore'

export const DISASTER_HISTORY_QUERY_KEY = {
  list: (statEvetOutbSeqn: string) => ['disasterHistories', statEvetOutbSeqn] as const,
  detail: (disasterHistoryId: string) => ['disasterHistories', 'detail', disasterHistoryId] as const,
  videoMappings: (disasterHistoryId: string) => ['disasterHistories', 'videoMappings', disasterHistoryId] as const,
}

/**
 * 재난 전파 내역 목록을 조회하는 React-Query 훅.
 */
export const useDisasterHistories = (statEvetOutbSeqn: string) => {
  const { setDisasterHistories } = useDisasterHistoryStore()

  const query = useQuery({
    queryKey: DISASTER_HISTORY_QUERY_KEY.list(statEvetOutbSeqn),
    queryFn: async () => {
      const response = await getDisasterHistories(statEvetOutbSeqn)
      return response.data as DisasterHistory[]
    },
    enabled: !!statEvetOutbSeqn,
    staleTime: 1000 * 30,
  })

  // 캐시 데이터든 새 데이터든 store에 동기화
  useEffect(() => {
    if (query.data) {
      setDisasterHistories(query.data)
    }
  }, [query.data, statEvetOutbSeqn])

  return query
}

/**
 * 단일 재난 전파 내역을 조회하는 React-Query 훅.
 */
export const useDisasterHistory = (disasterHistoryId: string) => {
  const { setSelectedDisasterHistory } = useDisasterHistoryStore()

  return useQuery({
    queryKey: DISASTER_HISTORY_QUERY_KEY.detail(disasterHistoryId),
    queryFn: async () => {
      const response = await getDisasterHistory(disasterHistoryId)
      setSelectedDisasterHistory(response.data)
      return response.data as DisasterHistory
    },
    enabled: !!disasterHistoryId,
  })
}

/**
 * 재난 전파 내역 비디오 매핑을 조회하는 React-Query 훅.
 */
export const useDisasterHistoryVideoMappings = (disasterHistoryId: string) => {
  const { setDisasterHistoryVideos, setDisasterHistoryVideoMappings } = useDisasterHistoryStore()

  return useQuery({
    queryKey: DISASTER_HISTORY_QUERY_KEY.videoMappings(disasterHistoryId),
    queryFn: async () => {
      const [videoMappingsResponse, videosResponse] = await Promise.all([
        getDisasterHistoryVideoMappings(disasterHistoryId),
        getVideos(disasterHistoryId),
      ])
      setDisasterHistoryVideos(videosResponse.data)
      setDisasterHistoryVideoMappings(videoMappingsResponse.data)
      return videoMappingsResponse.data
    },
    enabled: !!disasterHistoryId,
  })
}

/**
 * 재난 전파 내역 저장 mutation.
 * 저장 완료 후 목록을 자동으로 갱신한다.
 */
export const useSaveDisasterHistory = () => {
  const queryClient = useQueryClient()
  const { showLoading, hideLoading } = useLoadingStore()
  const { showPopup } = usePopupStore()
  const { selectedEvent } = useEventStore()

  return useMutation({
    mutationFn: async (disasterHistory: DisasterHistory) => {
      const { disasterHistoryFileMappings, disasterHistoryVideoMappings } = disasterHistory

      // 공유 전달 내용만 저장 (파일/비디오 제외)
      const savedResponse = await saveDisasterHistory({
        ...disasterHistory,
        disasterHistoryVideoMappings: [],
        disasterHistoryFileMappings: [],
      })
      const saved: DisasterHistory = savedResponse.data

      // 첨부파일 저장
      if (disasterHistoryFileMappings && disasterHistoryFileMappings.length > 0) {
        await saveDisasterHistoryFileMappings(saved.disasterHistoryId, disasterHistoryFileMappings)
      }

      // 비디오 매핑 저장
      if (disasterHistoryVideoMappings && disasterHistoryVideoMappings.length > 0) {
        await saveDisasterHistoryVideoMappings(saved.disasterHistoryId, disasterHistoryVideoMappings)
      }

      return saved
    },
    onMutate: () => {
      showLoading({ id: 'saveDisasterHistory', text: '등록중입니다.' })
    },
    onSuccess: () => {
      if (selectedEvent) {
        queryClient.invalidateQueries({
          queryKey: DISASTER_HISTORY_QUERY_KEY.list(selectedEvent.statEvetOutbSeqn),
        })
      }
      hideLoading('saveDisasterHistory')
      showPopup({
        message: '등록에 성공했습니다.',
        type: 0, // EPopup.info
        buttonText: '확인',
        isCloseButtonShow: true,
        callback: () => {},
      })
    },
    onError: (error) => {
      console.error('[useSaveDisasterHistory] error:', error)
      hideLoading('saveDisasterHistory')
    },
  })
}

/**
 * 비밀번호 확인 mutation.
 */
export const useChkDisasterHistoryPwd = () => {
  const { setChkDisasterHistory } = useDisasterHistoryStore()

  return useMutation({
    mutationFn: async ({ disasterHistoryId, pwd }: { disasterHistoryId: string; pwd: string }) => {
      const response = await chkPwd(disasterHistoryId, pwd)
      return response.data as boolean
    },
    onSuccess: (result) => {
      setChkDisasterHistory(result)
    },
  })
}
