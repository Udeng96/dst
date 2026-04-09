import { create } from 'zustand'

export interface Loading {
  id: string
  text: string
}

interface LoadingState {
  isShow: boolean
  loadings: Loading[]
  showLoading: (loading: Loading) => void
  hideLoading: (id: string) => void
}

const useLoadingStore = create<LoadingState>((set) => ({
  isShow: false,
  loadings: [],

  showLoading: (loading: Loading) =>
    set((state) => ({
      isShow: true,
      loadings: [...state.loadings, loading],
    })),

  hideLoading: (id: string) =>
    set((state) => {
      const filtered = state.loadings.filter((l) => l.id !== id)
      return {
        loadings: filtered,
        isShow: filtered.length > 0,
      }
    }),
}))

export default useLoadingStore
