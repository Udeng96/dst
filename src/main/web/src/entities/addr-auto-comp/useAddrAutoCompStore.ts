import { create } from 'zustand'
import { AddrAutoCompData } from './AddrAutoCompType'

/**
 * 주소 자동완성 데이터 store.
 */
interface AddrAutoCompState {
  addressDatas: AddrAutoCompData[]
  setAddressDatas: (datas: AddrAutoCompData[]) => void
}

const useAddrAutoCompStore = create<AddrAutoCompState>((set) => ({
  addressDatas: [],
  setAddressDatas: (datas) => set(() => ({ addressDatas: Array.isArray(datas) ? datas : [] })),
}))

export default useAddrAutoCompStore
