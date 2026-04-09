import { useQuery } from '@tanstack/react-query'
import { getCctvs } from '@/entities/cctv/CctvApi'
import { Cctv } from '@/entities/cctv/CctvType'
import useCctvStore from '@/entities/cctv/useCctvStore'

export const CCTV_QUERY_KEY = {
  list: (disasterHistoryId?: string) => ['cctvs', disasterHistoryId] as const,
}

/**
 * CCTV 목록을 조회하는 React-Query 훅.
 * 각 CCTV 항목에 type: 'cctv' 를 추가하고 store에 반영한다.
 */
export const useCctvs = (disasterHistoryId?: string) => {
  const { setCctvs } = useCctvStore()

  return useQuery({
    queryKey: CCTV_QUERY_KEY.list(disasterHistoryId),
    queryFn: async () => {
      const response = await getCctvs(disasterHistoryId)
      const cctvs: Cctv[] = response.data.map((cctv: Cctv) => ({
        ...cctv,
        type: 'cctv',
      }))
      setCctvs(cctvs)
      return cctvs
    },
    staleTime: 1000 * 60 * 5, // 5분
  })
}
