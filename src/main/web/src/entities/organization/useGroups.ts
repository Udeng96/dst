import { useQuery } from '@tanstack/react-query'
import { getGroups } from '@/entities/organization/GroupApi'
import { Group } from '@/entities/organization/GroupType'
import useGroupStore from '@/entities/organization/useGroupStore'

export const GROUP_QUERY_KEY = {
  list: () => ['groups'] as const,
}

/**
 * 그룹 목록을 조회하는 React-Query 훅.
 */
export const useGroups = () => {
  const { setGroups } = useGroupStore()

  return useQuery({
    queryKey: GROUP_QUERY_KEY.list(),
    queryFn: async () => {
      const response = await getGroups()
      const groups = response.data as Group[]
      setGroups(groups)
      return groups
    },
    staleTime: 1000 * 60 * 10, // 10분
  })
}
