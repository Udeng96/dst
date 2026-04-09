import { create } from 'zustand'
import { Cctv } from './CctvType'

/**
 * Cctv 도메인 클라이언트 상태.
 *
 * 서버 목록 조회는 React-Query(useCctvs 훅)에서 관리하고,
 * 로컬 캐시 역할의 cctvs 배열은 이 store에서 관리한다.
 */
interface CctvState {
  cctvs: Cctv[]
  setCctvs: (cctvs: Cctv[]) => void
}

const useCctvStore = create<CctvState>((set) => ({
  cctvs: [],
  setCctvs: (cctvs) => set(() => ({ cctvs: Array.isArray(cctvs) ? cctvs : [] })),
}))

export default useCctvStore
