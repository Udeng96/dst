import styled from 'styled-components'
import { Scrollbar } from 'react-scrollbars-custom'
import LiveMobileListItem from '@/widgets/map-viewer/Mobile/LiveMobileListItem'
import { Mobile } from '@/entities/mobile/MobileType'

interface ICctvSearchList {
  isActive: boolean
  mobiles: Mobile[]
  onFlyTo: (locX: number, locY: number) => void
  onCloseList: (isOpen: boolean) => void
}

/**
 * 모바일 실시간 영상 목록 영역.
 * isActive가 false이면 display: none으로 숨긴다.
 */
const CctvSearchList = ({ isActive, mobiles, onFlyTo, onCloseList }: ICctvSearchList) => {
  return (
    <StyledMobileSelectPopup isActive={isActive}>
      <StyledLiveMobileListBox>
        <header>실시간 촬영중인 영상 목록</header>
        <Scrollbar style={{ width: '420px', height: '100%' }} noScrollX={true} permanentTrackY={true}>
          {mobiles && mobiles.length > 0
            ? mobiles.map((mobile) => (
                <LiveMobileListItem
                  key={mobile.id}
                  mobile={mobile}
                  onClick={onFlyTo}
                  closeList={onCloseList}
                />
              ))
            : <LiveMobileListItem mobile={null} />
          }
        </Scrollbar>
      </StyledLiveMobileListBox>
    </StyledMobileSelectPopup>
  )
}

export default CctvSearchList

// ─── Styled Components ──────────────────────────────────────────────────────

const StyledMobileSelectPopup = styled.div<{ isActive: boolean }>`
  width: 420px;
  height: 260px;
  display: ${({ isActive }) => (isActive ? 'inline-block' : 'none')};
  margin-top: 168px;
  margin-left: 12px;
  position: absolute;
  padding: 2px 2px 11px;
  z-index: 999;
  background-color: #23223b;
  border-radius: 8px;
  border: solid 2px #7a45ff;
`

const StyledLiveMobileListBox = styled.ul`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #23223b;
  display: flex;
  flex-direction: column;

  & > header {
    background-color: #392b6c;
    width: 416px;
    height: 33px;
    line-height: 27px;
    border-radius: 7px;
    padding-left: 11.3px;
    position: relative;
    font-size: 10px;
    font-weight: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: -0.33px;
    overflow: hidden;
    color: #cbcdf2;
  }
`
