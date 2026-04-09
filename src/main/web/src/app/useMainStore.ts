import { create } from 'zustand'
import { Event, createTemplateEvent } from '@/entities/event/EventType'
import { DisasterHistory, createTemplateDisasterHistory } from '@/entities/disaster-history/DisasterHistoryType'

/**
 * Main 뷰 상태를 관리하는 Zustand store.
 *
 * - selectedEvent: 현재 선택된 이벤트
 * - selectedDisasterHistory: 현재 선택된 재난 전파 내역
 * - changeEventCoordinate: 이벤트 좌표 변경 모드 여부
 * - newEventLocation: 새 이벤트 위치 좌표 (leaflet LatLng 대신 순수 객체로 관리)
 *
 * NOTE: leaflet 객체(LatLng, Map 인스턴스)는 직렬화가 불가능하므로
 *       Zustand store에 저장하지 않고 컴포넌트 로컬 상태로 관리한다.
 */
interface NewEventLocation {
  lat: number
  lng: number
}

interface MainState {
  selectedEvent: Event
  selectedDisasterHistory: DisasterHistory | null
  changeEventCoordinate: boolean
  newEventLocation: NewEventLocation

  setSelectedEvent: (event: Event) => void
  setSelectedDisasterHistory: (disasterHistory: DisasterHistory | null) => void
  setChangeEventCoordinate: (value: boolean) => void
  setNewEventLocation: (location: NewEventLocation) => void
}

const useMainStore = create<MainState>((set) => ({
  selectedEvent: createTemplateEvent(0),
  selectedDisasterHistory: null,
  changeEventCoordinate: true,
  newEventLocation: { lat: 0, lng: 0 },

  setSelectedEvent: (event: Event) => set(() => ({ selectedEvent: event })),

  setSelectedDisasterHistory: (disasterHistory: DisasterHistory | null) =>
    set(() => ({ selectedDisasterHistory: disasterHistory })),

  setChangeEventCoordinate: (value: boolean) =>
    set(() => ({ changeEventCoordinate: value })),

  setNewEventLocation: (location: NewEventLocation) =>
    set(() => ({ newEventLocation: location })),
}))

export default useMainStore
