import { useQuery } from '@tanstack/react-query'
import { getAutoAddrData } from '@/entities/addr-auto-comp/AddrAutoCompApi'
import { AddrAutoCompData } from '@/entities/addr-auto-comp/AddrAutoCompType'
import useAddrAutoCompStore from '@/entities/addr-auto-comp/useAddrAutoCompStore'

export const ADDR_AUTO_COMP_QUERY_KEY = {
  data: () => ['addressAutoComp'] as const,
}

/**
 * 주소 자동완성 데이터를 조회하는 React-Query 훅.
 */
export const useAddrAutoComp = () => {
  const { setAddressDatas } = useAddrAutoCompStore()

  return useQuery({
    queryKey: ADDR_AUTO_COMP_QUERY_KEY.data(),
    queryFn: async () => {
      const response = await getAutoAddrData()
      const datas = response.data as AddrAutoCompData[]
      setAddressDatas(datas)
      return datas
    },
    staleTime: 1000 * 60 * 60, // 1시간 (자주 바뀌지 않음)
  })
}
