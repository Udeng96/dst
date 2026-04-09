import styled, { keyframes } from 'styled-components'
import { ChangeEvent } from 'react'
import Field from '@/shared/ui/Field/Field'
import { AddrAutoCompData } from '@/entities/addr-auto-comp/AddrAutoCompType'
import { Cctv } from '@/entities/cctv/CctvType'

interface ICctvSearchArea {
  cctvPreviewResult: Cctv[]
  showCctvResultPreviewArea: boolean
  addressPreviewResult: AddrAutoCompData[]
  showAddressResultPreviewArea: boolean
  isListOpen: boolean
  onCctvSearchChange: (searchText: string) => void
  onAddressSearchChange: (searchText: string) => void
  onFlyTo: (locX: number, locY: number) => void
  onToggleMobileList: () => void
}

const CctvSearchArea = ({
  cctvPreviewResult,
  showCctvResultPreviewArea,
  addressPreviewResult,
  showAddressResultPreviewArea,
  isListOpen,
  onCctvSearchChange,
  onAddressSearchChange,
  onFlyTo,
  onToggleMobileList,
}: ICctvSearchArea) => {
  return (
    <StyledMapSearchArea>
      <Field
        labelText={'CCTV 명칭'}
        inputText={null}
        labelWidth={'25%'}
        inputWidth={'70%'}
        readOnly={false}
        handleChange={(e: ChangeEvent<HTMLInputElement>) => onCctvSearchChange(e.target.value)}
      />
      <StyledSearchPreviewArea isShow={showCctvResultPreviewArea}>
        {cctvPreviewResult.map((cctvItem) => (
          <StyledSearchPreview
            key={cctvItem.deviceId}
            onClick={() => onFlyTo(cctvItem.x, cctvItem.y)}
          >
            {cctvItem.cctvNm}
          </StyledSearchPreview>
        ))}
      </StyledSearchPreviewArea>

      <Field
        labelText={'주소'}
        inputText={null}
        labelWidth={'25%'}
        inputWidth={'70%'}
        readOnly={false}
        handleChange={(e: ChangeEvent<HTMLInputElement>) => onAddressSearchChange(e.target.value)}
      />
      <StyledSearchPreviewArea isShow={showAddressResultPreviewArea}>
        {addressPreviewResult.map((addrItem) => (
          <StyledSearchPreview
            key={addrItem.address}
            onClick={() => onFlyTo(addrItem.locX, addrItem.locY)}
          >
            {addrItem.address}
          </StyledSearchPreview>
        ))}
      </StyledSearchPreviewArea>

      <StyledMobileListOpenButtonGroup isActive={isListOpen}>
        <StyledMobileListOpenButton isActive={isListOpen} onClick={onToggleMobileList}>
          모바일 영상
        </StyledMobileListOpenButton>
      </StyledMobileListOpenButtonGroup>
    </StyledMapSearchArea>
  )
}

export default CctvSearchArea

// ─── Styled Components ──────────────────────────────────────────────────────

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`

const StyledMapSearchArea = styled.div`
  width: 420px;
  height: 140px;
  position: absolute;
  margin-top: 12px;
  margin-left: 14px;
  z-index: 999;
  background-color: #39385c;
  border-radius: 8px;
  padding: 10px 20px 0px 4px;
`

const StyledSearchPreviewArea = styled.div<{ isShow: boolean }>`
  background-color: #39385c;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  margin-left: 27%;
  transition: visibility 0.15s ease-out;
  animation: ${(props) => (props.isShow ? fadeIn : fadeOut)} 0.15s ease-out;
  display: ${(props) => (props.isShow ? 'inline-block' : 'none')};
  width: 73%;
  height: 200px;
  z-index: 999;
  overflow-y: auto;
  position: absolute;
`

const StyledSearchPreview = styled.div`
  cursor: pointer;
  margin-left: 10px;
  margin-bottom: 5px;
`

const StyledMobileListOpenButtonGroup = styled.div<{ isActive?: boolean }>`
  width: 120px;
  height: 36px;
  display: inline-block;
  position: absolute;
  top: 94px;
  right: 24px;
  z-index: 9999;
  text-align: center;
  border-radius: 6px;
  border: solid 1px ${({ isActive }) => (isActive ? '#9c5eff' : '#6b6a9e')};
  background-color: ${({ isActive }) => (isActive ? '#7a45ff' : '#49487d')};

  &:hover {
    background-color: #514f9c;
    border-color: #7476b2;
  }
`

const StyledMobileListOpenButton = styled.span<{ isActive: boolean }>`
  width: 76px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  letter-spacing: -0.04px;
  text-align: center;
  color: #f4f4f4;
  pointer-events: auto;
  line-height: 2.5;
`
