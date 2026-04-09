import { create } from 'zustand'
import { Group } from './GroupType'

/**
 * Group 도메인 클라이언트 상태.
 */
interface GroupState {
  groups: Group[]
  setGroups: (groups: Group[]) => void
}

const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  setGroups: (groups) => set(() => ({ groups: Array.isArray(groups) ? groups : [] })),
}))

export default useGroupStore
