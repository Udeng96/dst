import { useQuery } from '@tanstack/react-query'
import { getOrganizations } from '@/entities/organization/OrganizationApi'
import { Organization } from '@/entities/organization/OrganizationType'
import useOrganizationStore from '@/entities/organization/useOrganizationStore'

export const ORGANIZATION_QUERY_KEY = {
  list: () => ['organizations'] as const,
}

/**
 * 조직 목록을 조회하는 React-Query 훅.
 */
export const useOrganizations = () => {
  const { setOrganizations } = useOrganizationStore()

  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEY.list(),
    queryFn: async () => {
      const response = await getOrganizations()
      const organizations = response.data as Organization[]
      setOrganizations(organizations)
      return organizations
    },
    staleTime: 1000 * 60 * 10,
  })
}
