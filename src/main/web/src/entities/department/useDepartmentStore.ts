import { create } from 'zustand'
import { Department } from './DepartmentType'

/**
 * Department 도메인 클라이언트 상태.
 */
interface DepartmentState {
  departments: Department[]
  setDepartments: (departments: Department[]) => void
}

const useDepartmentStore = create<DepartmentState>((set) => ({
  departments: [],
  setDepartments: (departments) => set(() => ({ departments: Array.isArray(departments) ? departments : [] })),
}))

export default useDepartmentStore
