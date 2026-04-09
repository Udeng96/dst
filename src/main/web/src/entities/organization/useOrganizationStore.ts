import { create } from 'zustand'
import { Organization } from './OrganizationType'

/**
 * Organization 도메인 클라이언트 상태.
 */
interface OrganizationState {
  organizations: Organization[]
  setOrganizations: (organizations: Organization[]) => void
}

const useOrganizationStore = create<OrganizationState>((set) => ({
  organizations: [],
  setOrganizations: (organizations) => set(() => ({ organizations: Array.isArray(organizations) ? organizations : [] })),
}))

export default useOrganizationStore
