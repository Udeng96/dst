import { create } from 'zustand'
import { Mobile } from './MobileType'

/**
 * Mobile 도메인 클라이언트 상태.
 *
 * - liveMobiles: WebSocket을 통해 실시간으로 업데이트되는 활성 모바일 목록
 * - activeMobile: GIS 지도에서 현재 재생 중인 모바일
 * - playMobileList: 동시 재생 목록
 */
interface MobileState {
  liveMobiles: Mobile[]
  activeMobile: Mobile | null
  playMobileList: Mobile[]

  setLiveMobiles: (mobiles: Mobile[]) => void
  setActiveMobile: (mobile: Mobile | null) => void
  setPlayMobileList: (mobiles: Mobile[]) => void
}

const useMobileStore = create<MobileState>((set) => ({
  liveMobiles: [],
  activeMobile: null,
  playMobileList: [],

  setLiveMobiles: (mobiles) => set(() => ({ liveMobiles: Array.isArray(mobiles) ? mobiles : [] })),
  setActiveMobile: (mobile) => set(() => ({ activeMobile: mobile })),
  setPlayMobileList: (mobiles) => set(() => ({ playMobileList: Array.isArray(mobiles) ? mobiles : [] })),
}))

export default useMobileStore
