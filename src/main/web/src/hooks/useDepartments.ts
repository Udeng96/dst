import { useQuery } from '@tanstack/react-query'
import { getDepartments } from '@/entities/department/DepartmentApi'
import { Department } from '@/entities/department/DepartmentType'
import useDepartmentStore from '@/entities/department/useDepartmentStore'

export const DEPARTMENT_QUERY_KEY = {
  list: () => ['departments'] as const,
}

/**
 * 부서 목록을 조회하는 React-Query 훅.
 */
export const useDepartments = () => {
  const { setDepartments } = useDepartmentStore()

  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEY.list(),
    queryFn: async () => {
      const response = await getDepartments()
      const departments = response.data as Department[]
      setDepartments(departments)
      return departments
    },
    staleTime: 1000 * 60 * 10,
  })
}
