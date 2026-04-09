import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEvents, getEvent, finishEventById, getEventTypes, getEventAllInfo } from '@/entities/event/EventApi'
import useEventStore from '@/entities/event/useEventStore'
import usePopupStore from '@/entities/event/usePopupStore'
import useLoadingStore from '@/entities/event/useLoadingStore'
import { EventSearchParam } from '@/entities/event/EventType'
import { xhr } from '@/shared/lib/xhrUtil'

export const EVENT_QUERY_KEY = {
  list: (param?: EventSearchParam | null) => ['events', param] as const,
  detail: (id: string) => ['events', id] as const,
  types: () => ['events', 'types'] as const,
  allInfo: () => ['events', 'allInfo'] as const,
}

/**
 * 이벤트 목록을 조회하는 React-Query 훅.
 * 데이터가 성공적으로 조회되면 useEventStore에 반영한다.
 */
export const useEvents = (param?: EventSearchParam | null) => {
  const { setEvents, setSelectedEvent, events: storedEvents } = useEventStore()

  return useQuery({
    queryKey: EVENT_QUERY_KEY.list(param),
    queryFn: async () => {
      const response = await getEvents(param ?? undefined)
      const events = response.data
      setEvents(events)
      if (events && events.length > 0) {
        setSelectedEvent(events[0])
      }
      return events
    },
    staleTime: 1000 * 30, // 30초
  })
}

/**
 * 단일 이벤트를 조회하는 React-Query 훅.
 */
export const useEvent = (statEvetOutbSeqn: string) => {
  const { setSelectedEvent } = useEventStore()

  return useQuery({
    queryKey: EVENT_QUERY_KEY.detail(statEvetOutbSeqn),
    queryFn: async () => {
      const response = await getEvent(statEvetOutbSeqn)
      const event = response.data
      setSelectedEvent(event)
      return event
    },
    enabled: !!statEvetOutbSeqn,
  })
}

/**
 * 이벤트 타입 목록을 조회하는 React-Query 훅.
 */
export const useEventTypes = () => {
  const { setEventTypes } = useEventStore()

  return useQuery({
    queryKey: EVENT_QUERY_KEY.types(),
    queryFn: async () => {
      const response = await getEventTypes()
      const types = response.data
      setEventTypes(types)
      return types
    },
    staleTime: 1000 * 60 * 10, // 10분 (자주 바뀌지 않음)
  })
}

/**
 * 이벤트 전체 정보를 조회하는 React-Query 훅.
 */
export const useEventAllInfo = () => {
  const { setEventInfos } = useEventStore()

  return useQuery({
    queryKey: EVENT_QUERY_KEY.allInfo(),
    queryFn: async () => {
      const response = await getEventAllInfo()
      const infos = response.data
      setEventInfos(infos)
      return infos
    },
  })
}

/**
 * 이벤트 종료(finish) mutation.
 */
export const useFinishEvent = () => {
  const queryClient = useQueryClient()
  const { showLoading, hideLoading } = useLoadingStore()
  const { showPopup } = usePopupStore()
  const { events, selectedEvent, setEvents, setSelectedEvent } = useEventStore()

  return useMutation({
    mutationFn: (statEvetOutbSeqn: string) => finishEventById(statEvetOutbSeqn),
    onMutate: () => {
      showLoading({ id: 'finishEvent', text: 'Finishing Event' })
    },
    onSuccess: (response, statEvetOutbSeqn) => {
      const finishedEvent = (response as any).data
      if (finishedEvent.procSt === '5') {
        const updated = events.map((e) =>
          e.statEvetOutbSeqn === statEvetOutbSeqn ? finishedEvent : e
        )
        setEvents(updated)
        if (selectedEvent.statEvetOutbSeqn === finishedEvent.statEvetOutbSeqn) {
          setSelectedEvent(finishedEvent)
        }
        queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY.list() })
      }
      hideLoading('finishEvent')
    },
    onError: (error) => {
      console.error('[useFinishEvent] error:', error)
      showPopup({
        title: '종료 실패',
        message: '이벤트 종료에 실패했습니다.',
        buttonText: '확인',
        type: 0, // EPopup.info
        callback: () => {},
      })
      hideLoading('finishEvent')
    },
  })
}

/**
 * 이벤트 좌표 수정 mutation.
 */
export const useModifyEventCoordinate = () => {
  const { updateEventCoordinates } = useEventStore()

  return useMutation({
    mutationFn: async ({
      statEvetOutbSeqn,
      x,
      y,
    }: {
      statEvetOutbSeqn: string
      x: string
      y: string
    }) => {
      const response = await xhr({
        url: `/dst/events/${statEvetOutbSeqn}/location`,
        method: 'POST',
        params: { locX: x, locY: y },
      })
      return { response, statEvetOutbSeqn, x, y }
    },
    onSuccess: ({ response, statEvetOutbSeqn, x, y }) => {
      if (response && response.data !== 'FAIL') {
        updateEventCoordinates({
          statEvetOutbSeqn,
          x,
          y,
          address: response.data,
        })
      }
    },
  })
}
