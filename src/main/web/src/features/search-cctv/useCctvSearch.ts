import { useState } from 'react'
import useCctvStore from '@/entities/cctv/useCctvStore'
import { Cctv } from '@/entities/cctv/CctvType'

/**
 * CCTV 검색 자동완성 훅.
 *
 * - 검색어와 prefix가 일치하는 CCTV 목록을 반환한다.
 * - showCctvResultPreviewArea: 결과 영역 표시 여부
 * - cctvPreviewResult: 검색 결과 목록
 * - findCctvAutoComp: 검색 실행 함수 (외부에서 주소 미리보기 영역 숨김 콜백 주입)
 */
interface UseCctvSearchOptions {
  onShowAddress?: (show: boolean) => void
}

const useCctvSearch = ({ onShowAddress }: UseCctvSearchOptions = {}) => {
  const cctvs = useCctvStore((s) => s.cctvs)

  const [cctvPreviewResult, setCctvPreviewResult] = useState<Cctv[]>([])
  const [showCctvResultPreviewArea, setShowCctvResultPreviewArea] = useState(false)

  const matchName = (item: string, keyword: string): boolean => {
    const keyLen = keyword.length
    item = item.toLowerCase().substring(0, keyLen)
    return item === keyword && keyLen !== 0
  }

  const findCctvAutoComp = (searchText: string) => {
    const result = cctvs.filter((item) => matchName(item.cctvNm, searchText))
    if (result.length !== 0) {
      onShowAddress?.(false)
      setShowCctvResultPreviewArea(true)
    } else {
      setShowCctvResultPreviewArea(false)
    }
    setCctvPreviewResult(result)
  }

  return {
    cctvPreviewResult,
    showCctvResultPreviewArea,
    setShowCctvResultPreviewArea,
    findCctvAutoComp,
  }
}

export default useCctvSearch
