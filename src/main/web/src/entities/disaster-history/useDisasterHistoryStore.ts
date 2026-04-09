import { create } from 'zustand'
import {
  DisasterHistory,
  DisasterHistoryVideoMapping,
  createTemplateDisasterHistory,
} from './DisasterHistoryType'
import { Video } from '@/entities/video/VideoType'

/**
 * DisasterHistory 도메인 클라이언트 상태.
 *
 * 서버 목록 조회는 React-Query(useDisasterHistories 훅)에서 관리하고,
 * 선택된 항목 및 파생 상태만 이 store에서 관리한다.
 */
interface DisasterHistoryState {
  disasterHistories: DisasterHistory[]
  selectedDisasterHistory: DisasterHistory
  selectedDisasterHistoryVideos: Video[]
  selectedDisasterHistoryVideoMappings: DisasterHistoryVideoMapping[]
  chkDisasterHistory: boolean

  setDisasterHistories: (items: DisasterHistory[]) => void
  setSelectedDisasterHistory: (item: DisasterHistory | null) => void
  setDisasterHistoryVideos: (videos: Video[]) => void
  setDisasterHistoryVideoMappings: (mappings: DisasterHistoryVideoMapping[]) => void
  setChkDisasterHistory: (value: boolean) => void
}

const useDisasterHistoryStore = create<DisasterHistoryState>((set) => ({
  disasterHistories: Array.from({ length: 10 }).map((_, i) =>
    createTemplateDisasterHistory(i)
  ),
  selectedDisasterHistory: createTemplateDisasterHistory(0),
  selectedDisasterHistoryVideos: [],
  selectedDisasterHistoryVideoMappings: [],
  chkDisasterHistory: false,

  setDisasterHistories: (items) => set(() => ({ disasterHistories: Array.isArray(items) ? items : [] })),

  setSelectedDisasterHistory: (item) =>
    set(() => ({
      selectedDisasterHistory: item ?? null,
    })),

  setDisasterHistoryVideos: (videos) =>
    set(() => ({ selectedDisasterHistoryVideos: Array.isArray(videos) ? videos : [] })),

  setDisasterHistoryVideoMappings: (mappings) =>
    set(() => ({ selectedDisasterHistoryVideoMappings: Array.isArray(mappings) ? mappings : [] })),

  setChkDisasterHistory: (value) => set(() => ({ chkDisasterHistory: value })),
}))

export default useDisasterHistoryStore
