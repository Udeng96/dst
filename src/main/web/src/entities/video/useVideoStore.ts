import { create } from 'zustand'
import { Video } from './VideoType'

/**
 * Video 도메인 클라이언트 상태.
 */
interface VideoState {
  videos: Video[]
  setVideos: (videos: Video[]) => void
}

const useVideoStore = create<VideoState>((set) => ({
  videos: [],
  setVideos: (videos) => set(() => ({ videos: Array.isArray(videos) ? videos : [] })),
}))

export default useVideoStore
