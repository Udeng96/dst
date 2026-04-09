import { useQuery } from '@tanstack/react-query'
import { getUsers, getCurrentUser } from '@/entities/user/UserApi'
import { User } from '@/entities/user/UserType'
import useUserStore from '@/entities/user/useUserStore'

export const USER_QUERY_KEY = {
  list: () => ['users'] as const,
  current: () => ['users', 'current'] as const,
}

/**
 * 전체 사용자 목록을 조회하는 React-Query 훅.
 */
export const useUsers = () => {
  const { setUsers } = useUserStore()

  return useQuery({
    queryKey: USER_QUERY_KEY.list(),
    queryFn: async () => {
      const response = await getUsers()
      const users = response.data as User[]
      setUsers(users)
      return users
    },
    staleTime: 1000 * 60 * 5, // 5분
  })
}

/**
 * 현재 로그인한 사용자를 조회하는 React-Query 훅.
 */
export const useCurrentUser = () => {
  const { setCurrentUser } = useUserStore()

  return useQuery({
    queryKey: USER_QUERY_KEY.current(),
    queryFn: async () => {
      const response = await getCurrentUser()
      const user = response.data as User
      setCurrentUser(user)
      return user
    },
    staleTime: 1000 * 60 * 10, // 10분
  })
}
