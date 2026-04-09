import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import useLoadingStore from '@/app/useLoadingStore'
import usePopupStore, { EPopup } from '@/app/usePopupStore'
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore'
import useEventStore from '@/entities/event/useEventStore'
import { parseDate } from '@/shared/lib/dateUtil'
import { DEFAULT_EXPIRE_TIME } from '@/shared/config/DstConstants'
import { getDisasterHistory } from '@/entities/disaster-history/DisasterHistoryApi'
import { getEvent } from '@/entities/event/EventApi'

/**
 * 공유 페이지 초기화 훅.
 * 기존 ShareSaga의 initializeShare 로직을 React-Query + Zustand 기반으로 대체한다.
 *
 * 처리 순서:
 * 1. disasterHistoryId로 재난 전파 내역 조회
 * 2. 해당 내역의 연결된 이벤트 조회
 * 3. 만료 시간 검증 (DEFAULT_EXPIRE_TIME 초과 또는 procSt === '5' 시 만료 처리)
 */
export function useInitializeShare(disasterHistoryId: string) {
  const { showLoading, hideLoading } = useLoadingStore()
  const { showPopup } = usePopupStore()
  const { setSelectedDisasterHistory } = useDisasterHistoryStore()
  const { setSelectedEvent } = useEventStore()

  const disasterHistoryQuery = useQuery({
    queryKey: ['share', 'disasterHistory', disasterHistoryId],
    queryFn: async () => {
      const response = await getDisasterHistory(disasterHistoryId)
      return response.data
    },
    enabled: !!disasterHistoryId,
    staleTime: 0, // 공유 페이지는 항상 최신 데이터 사용
  })

  const disasterHistory = disasterHistoryQuery.data

  const eventQuery = useQuery({
    queryKey: ['share', 'event', disasterHistory?.statEvetOutbSeqn],
    queryFn: async () => {
      const response = await getEvent(disasterHistory!.statEvetOutbSeqn)
      return response.data
    },
    enabled: !!disasterHistory?.statEvetOutbSeqn,
    staleTime: 0,
  })

  const event = eventQuery.data

  const isLoading = disasterHistoryQuery.isLoading || (!!disasterHistory && eventQuery.isLoading)

  useEffect(() => {
    if (isLoading) {
      showLoading({ id: 'share', text: 'Data loading' })
    }
  }, [isLoading])

  useEffect(() => {
    if (!disasterHistory || !event) return

    setSelectedDisasterHistory(disasterHistory)
    setSelectedEvent(event)

    const date = parseDate(disasterHistory.regDate)
    const now = new Date()

    const isExpired =
      now.getTime() - date.getTime() > DEFAULT_EXPIRE_TIME || event.procSt === '5'

    if (isExpired) {
      console.log('[useInitializeShare] 링크 만료됨')
      hideLoading('share')
      showPopup({
        message: '해당 링크는 만료됐습니다.',
        title: '만료된 링크',
        type: EPopup.delete,
        isCloseButtonShow: false,
        buttonText: '확인',
        callback: () => {},
      })
      return
    }

    hideLoading('share')
  }, [disasterHistory, event])

  useEffect(() => {
    if (disasterHistoryQuery.isError) {
      console.error('[useInitializeShare] 재난 전파 내역 조회 실패')
      hideLoading('share')
    }
  }, [disasterHistoryQuery.isError])

  return {
    isLoading,
    disasterHistory,
    event,
    isError: disasterHistoryQuery.isError || eventQuery.isError,
  }
}
