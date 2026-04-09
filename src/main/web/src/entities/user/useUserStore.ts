import { create } from 'zustand'
import { User, createTemplateUser } from './UserType'

/**
 * User 도메인 클라이언트 상태.
 *
 * 서버 목록 조회는 React-Query(useUsers, useCurrentUser 훅)에서 관리하고,
 * 현재 로그인 사용자 및 전체 목록은 이 store에서 캐싱한다.
 */
interface UserState {
  users: User[]
  currentUser: User

  setUsers: (users: User[]) => void
  setCurrentUser: (user: User) => void
}

const useUserStore = create<UserState>((set) => ({
  users: [],
  currentUser: createTemplateUser(),

  setUsers: (users) => set(() => ({ users: Array.isArray(users) ? users : [] })),
  setCurrentUser: (user) => set(() => ({ currentUser: user })),
}))

export default useUserStore
