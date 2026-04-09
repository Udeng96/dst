import { create } from 'zustand'

/**
 * Share 뷰 상태를 관리하는 Zustand store.
 *
 * - isInitialized: 공유 페이지 초기화 완료 여부
 * - isExpired: 공유 링크 만료 여부
 * - error: 초기화 실패 시 오류 메시지
 */
interface ShareState {
  isInitialized: boolean
  isExpired: boolean
  error: string | null

  setInitialized: (value: boolean) => void
  setExpired: (value: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const useShareStore = create<ShareState>((set) => ({
  isInitialized: false,
  isExpired: false,
  error: null,

  setInitialized: (value: boolean) => set(() => ({ isInitialized: value })),

  setExpired: (value: boolean) => set(() => ({ isExpired: value })),

  setError: (error: string | null) => set(() => ({ error })),

  reset: () =>
    set(() => ({
      isInitialized: false,
      isExpired: false,
      error: null,
    })),
}))

export default useShareStore
