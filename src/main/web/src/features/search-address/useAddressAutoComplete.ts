import { useState } from 'react'
import useAddrAutoCompStore from '@/entities/addr-auto-comp/useAddrAutoCompStore'
import { AddrAutoCompData } from '@/entities/addr-auto-comp/AddrAutoCompType'

/**
 * 주소 자동완성 훅.
 *
 * - 입력한 텍스트와 prefix가 일치하는 주소 목록을 반환한다.
 * - showAddressResultPreviewArea: 결과 영역 표시 여부
 * - addressPreviewResult: 검색 결과 목록
 * - findAddressAutoComp: 검색 실행 함수 (외부에서 CCTV 미리보기 영역 숨김 콜백 주입)
 */
interface UseAddressAutoCompleteOptions {
  onShowCctv?: (show: boolean) => void
}

const useAddressAutoComplete = ({ onShowCctv }: UseAddressAutoCompleteOptions = {}) => {
  const addressAutoCompData = useAddrAutoCompStore((s) => s.addressDatas)

  const [addressPreviewResult, setAddressPreviewResult] = useState<AddrAutoCompData[]>([])
  const [showAddressResultPreviewArea, setShowAddressResultPreviewArea] = useState(false)

  const matchName = (item: string, keyword: string): boolean => {
    const keyLen = keyword.length
    item = item.toLowerCase().substring(0, keyLen)
    return item === keyword && keyLen !== 0
  }

  const findAddressAutoComp = (searchText: string) => {
    const result = addressAutoCompData.filter((item) => matchName(item.address, searchText))
    if (result.length !== 0) {
      setShowAddressResultPreviewArea(true)
      onShowCctv?.(false)
    } else {
      setShowAddressResultPreviewArea(false)
    }
    setAddressPreviewResult(result)
  }

  return {
    addressPreviewResult,
    showAddressResultPreviewArea,
    setShowAddressResultPreviewArea,
    findAddressAutoComp,
  }
}

export default useAddressAutoComplete
