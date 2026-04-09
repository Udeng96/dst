import { create } from 'zustand'
import { Event, EventInfo, createTemplateEvent } from './EventType'

/**
 * Event 도메인 클라이언트 상태 (선택된 이벤트 등 UI 상태).
 *
 * 서버에서 패치하는 events 목록은 React-Query(useEvents 훅)에서 관리하고,
 * 현재 선택된 이벤트 및 UI 상태만 이 store에서 관리한다.
 */
interface EventState {
  selectedEvent: Event
  events: Event[]
  eventTypes: string[]
  eventInfos: EventInfo[]
  changeEventCoordinate: boolean
  newEventLocation: { lat: number; lng: number }

  setSelectedEvent: (event: Event) => void
  setEvents: (events: Event[]) => void
  setEventTypes: (types: string[]) => void
  setEventInfos: (infos: EventInfo[]) => void
  setChangeEventCoordinate: (value: boolean) => void
  setNewEventLocation: (location: { lat: number; lng: number }) => void
  updateEventCoordinates: (payload: { statEvetOutbSeqn: string; x: string; y: string; address: string }) => void
}

const useEventStore = create<EventState>((set) => ({
  selectedEvent: createTemplateEvent(0),
  events: Array.from({ length: 10 }).map((_, i) => createTemplateEvent(i)),
  eventTypes: [],
  eventInfos: [],
  changeEventCoordinate: true,
  newEventLocation: { lat: 0, lng: 0 },

  setSelectedEvent: (event) => set(() => ({ selectedEvent: event })),

  setEvents: (events) => set(() => ({ events: Array.isArray(events) ? events : [] })),

  setEventTypes: (types) => set(() => ({ eventTypes: Array.isArray(types) ? types : [] })),

  setEventInfos: (infos) => set(() => ({ eventInfos: Array.isArray(infos) ? infos : [] })),

  setChangeEventCoordinate: (value) => set(() => ({ changeEventCoordinate: value })),

  setNewEventLocation: (location) => set(() => ({ newEventLocation: location })),

  updateEventCoordinates: ({ statEvetOutbSeqn, x, y, address }) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.statEvetOutbSeqn === statEvetOutbSeqn
          ? { ...e, x, y, outbPlac: address }
          : e
      ),
      selectedEvent:
        state.selectedEvent.statEvetOutbSeqn === statEvetOutbSeqn
          ? { ...state.selectedEvent, x, y, outbPlac: address }
          : state.selectedEvent,
    })),
}))

export default useEventStore
