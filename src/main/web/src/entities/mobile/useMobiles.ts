import { useQuery } from '@tanstack/react-query'
import { getLiveMobiles, getAllMobiles } from '@/entities/mobile/MobileApi'
import { Mobile } from '@/entities/mobile/MobileType'
import useMobileStore from '@/entities/mobile/useMobileStore'

export const MOBILE_QUERY_KEY = {
  live: () => ['mobiles', 'live'] as const,
  all: () => ['mobiles', 'all'] as const,
}

/**
 * 실시간 촬영 중인 모바일 목록을 조회하는 React-Query 훅.
 */
export const useLiveMobiles = () => {
  const { setLiveMobiles } = useMobileStore()

  return useQuery({
    queryKey: MOBILE_QUERY_KEY.live(),
    queryFn: async () => {
      const response = await getLiveMobiles()
      const mobiles = response.data as Mobile[]
      setLiveMobiles(mobiles)
      return mobiles
    },
    staleTime: 1000 * 10, // 10초 (실시간 데이터)
  })
}

/**
 * 전체 모바일 목록을 조회하는 React-Query 훅.
 */
export const useAllMobiles = () => {
  return useQuery({
    queryKey: MOBILE_QUERY_KEY.all(),
    queryFn: async () => {
      const response = await getAllMobiles()
      return response.data as Mobile[]
    },
  })
}
