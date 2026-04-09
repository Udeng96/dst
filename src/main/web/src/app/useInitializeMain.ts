import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import useLoadingStore from '@/app/useLoadingStore'
import usePopupStore from '@/app/usePopupStore'
import { useCurrentUser } from '@/entities/user/useUsers'
import { useGroups } from '@/entities/organization/useGroups'
import { useOrganizations } from '@/entities/organization/useOrganizations'
import { useDepartments } from '@/entities/department/useDepartments'
import { useUsers } from '@/entities/user/useUsers'
import { useAddrAutoComp } from '@/entities/addr-auto-comp/useAddrAutoComp'
import { useCctvs } from '@/entities/cctv/useCctvs'
import { useEvents } from '@/entities/event/useEvents'
import { useEventWebSocket } from './useWebSocket'

/**
 * 메인 페이지 초기화 훅.
 * 기존 MainSaga의 initializeMain 로직을 React-Query + Zustand 기반으로 대체한다.
 *
 * - 모든 초기 데이터를 병렬로 패치
 * - 로딩 상태를 useLoadingStore로 관리
 * - WebSocket 연결을 useEventWebSocket 훅에 위임
 */
export function useInitializeMain() {
  const { showLoading, hideLoading } = useLoadingStore()
  const { showPopup } = usePopupStore()

  const currentUserQuery = useCurrentUser()
  const groupsQuery = useGroups()
  const organizationsQuery = useOrganizations()
  const departmentsQuery = useDepartments()
  const usersQuery = useUsers()
  const addrQuery = useAddrAutoComp()
  const cctvsQuery = useCctvs()
  const eventsQuery = useEvents()

  // WebSocket 연결
  useEventWebSocket()

  const isLoading =
    currentUserQuery.isLoading ||
    groupsQuery.isLoading ||
    organizationsQuery.isLoading ||
    departmentsQuery.isLoading ||
    usersQuery.isLoading ||
    addrQuery.isLoading ||
    cctvsQuery.isLoading ||
    eventsQuery.isLoading

  const isError =
    currentUserQuery.isError ||
    groupsQuery.isError ||
    organizationsQuery.isError ||
    departmentsQuery.isError ||
    usersQuery.isError ||
    addrQuery.isError ||
    cctvsQuery.isError ||
    eventsQuery.isError

  useEffect(() => {
    if (isLoading) {
      showLoading({ id: 'main', text: 'Data loading' })
    } else {
      hideLoading('main')
    }
  }, [isLoading])

  useEffect(() => {
    if (isError) {
      console.error('[useInitializeMain] 초기화 중 오류 발생')
      hideLoading('main')
    }
  }, [isError])

  return { isLoading, isError }
}
