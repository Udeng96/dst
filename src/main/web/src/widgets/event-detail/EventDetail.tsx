import styled, { keyframes } from 'styled-components'
import Map from '@/widgets/map-viewer/Map'
import Field from '@/shared/ui/Field/Field'
import { Event } from '@/entities/event/EventType'
import { DEFAULT_GPS } from '@/shared/config/DstConstants'
import { StyledButton } from '@/shared/ui/Button/Button'
import { ChangeEvent, useEffect, useState } from 'react'
import EventDetailForm from './EventDetailForm'
import useAddrAutoCompStore from '@/entities/addr-auto-comp/useAddrAutoCompStore'

interface IEventDetail {
  event: Event
  isSelected: boolean
}

const EventDetail = ({ isSelected, event }: IEventDetail) => {
  const addressAutoCompData = useAddrAutoCompStore((s) => s.addressDatas)

  const matchName = (item: string, keyword: string) => {
    const keyLen = keyword.length
    item = item.toLowerCase().substring(0, keyLen)
    return item === keyword && keyLen !== 0
  }

  const [addressPreviewResult, setAddressPreviewResult] = useState([])
  const [showAddressResultPreviewArea, setShowAddressResultPreviewArea] = useState(false)

  const findAddressAutoComp = (searchText: string) => {
    const result = addressAutoCompData.filter(
      (item) => matchName(item.address, searchText) === true
    )

    if (result.length !== 0) {
      setShowAddressResultPreviewArea(true)
    } else {
      setShowAddressResultPreviewArea(false)
    }
    setAddressPreviewResult(result)
  }

  const [newCenterCoordinates, setNewCenterCoordinates] = useState([])
  const flyToCoordinates = (locX: number, locY: number) => {
    setNewCenterCoordinates([locX, locY])
  }

  useEffect(() => {
    if (event.x !== '' && event.y !== '') {
      flyToCoordinates(Number(event.x), Number(event.y))
    }
  }, [event])

  return (
    <StyledEventDetail isSelected={isSelected}>
      <StyledMapSearchArea>
        <Field
          labelText={'주소'}
          inputText={null}
          labelWidth={'25%'}
          inputWidth={'70%'}
          height='3.24vh'
          readOnly={false}
          handleChange={(event: ChangeEvent<HTMLInputElement>) =>
            findAddressAutoComp(event.target.value)
          }
        />
        <StyledSearchPreviewArea isShow={showAddressResultPreviewArea}>
          {addressPreviewResult.map((addrItem) => (
            <StyledSearchPreview
              onClick={() => {
                flyToCoordinates(addrItem.locX, addrItem.locY)
              }}
            >
              {addrItem.address}
            </StyledSearchPreview>
          ))}
        </StyledSearchPreviewArea>
      </StyledMapSearchArea>
      <StyledArea>
        <Map
          center={
            event.x && event.y ? [parseFloat(event.y), parseFloat(event.x)] : DEFAULT_GPS
          }
          isShow={isSelected}
          isShowRadar={true}
          newCenterCoordinates={newCenterCoordinates}
        />
      </StyledArea>
      <StyledArea>
        <EventDetailForm event={event} />
      </StyledArea>
    </StyledEventDetail>
  )
}

const StyledArea = styled.span`
  width: 50%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledEventDetail = styled.article<{
  isSelected: boolean
}>`
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;

  display: ${({ isSelected }) => (isSelected ? 'flex' : 'none')};
  justify-content: flex-start;
  align-items: center;
`

const StyledSaveCancleNewLocationButton = styled(StyledButton)<{
  changeEventCoordinates: boolean
}>`
  width: 30%;
  height: 6vh;
  max-height: 40px;
  border-radius: 1vw;
  box-shadow: 0 0.15625vw 0.46875vw 0 rgb(123 26 255 / 27%);
  border: solid 0.05vw #9c5eff;
  background-image: linear-gradient(to left, #6243c1, #6243c1, #9f6be8);
  color: #ffffff;

  display: ${(props) => (props.changeEventCoordinates ? 'none' : 'flex')};
  justify-content: center;
  align-items: center;

  &:hover {
    border: solid 0.05vw #9f77f7;
    background-image: linear-gradient(to left, #7c5bf5, #7c5bf5, #a97aeb);
  }
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

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`

const StyledMapSearchArea = styled.div`
  width: 20%;
  height: 4.5vh;
  display: inline-block;
  position: absolute;
  top: 10px;
  left: 50px;
  z-index: 999;
  background-color: #39385c;
  border-radius: 10px;
  padding-right: 15px;
`

export default EventDetail
