import styled from 'styled-components'
import { StyledButton } from '@/shared/ui/Button/Button'
import { Event } from '@/entities/event/EventType'
import usePopupStore, { EPopup, Popup } from '@/app/usePopupStore'
import { useFinishEvent } from '@/entities/event/useEvents'

interface IHeader {
  event: Event
}

const MainHeader = ({ event }: IHeader) => {
  const { showPopup } = usePopupStore()
  const { mutate: finishEvent } = useFinishEvent()
  const isLoading = event.uSvcOutbId === ''

  return (
    <StyledHeader isLoading={isLoading}>
      <strong>
        {event.statEvetNm}
        <StyledEventType isLoading={isLoading}>{event.svcThemeNm}</StyledEventType>
      </strong>

      {event.procSt !== '5' ? (
        <StyledEventCloseButton
          onClick={() => {
            showPopup({
              title: '이벤트 종료',
              buttonText: '종료',
              isCloseButtonShow: true,
              type: EPopup.event,
              message: '이벤트를 종료하시겠습니까?',
              callback: () => finishEvent(event.statEvetOutbSeqn),
            } as Popup)
          }}
          isLoading={isLoading}
        >
          이벤트 종료
        </StyledEventCloseButton>
      ) : null}
    </StyledHeader>
  )
}

const StyledEventCloseButton = styled(StyledButton)<{
  isLoading: boolean
}>`
  width: 7vw;
  height: 4.45vh;
  max-height: 46px;
  border-radius: 1.1vw;
  box-shadow: 0 0.15625vw 0.625vw 0 rgb(0 0 0 / 12%);
  border: solid 0.1vw #d14680;
  background-color: #de3c5f;
  font-size: 1vw;
  letter-spacing: -0.046875vw;
  text-align: center;
  color: #f3f3f8;
  margin-left: auto;

  opacity: ${({ isLoading }) => (isLoading ? '0' : '1')};

  &:hover {
    background-color: #e34b6c;
  }
`

const StyledEventType = styled.b<{
  isLoading: boolean
}>`
  min-width: 2vw;
  height: 1.5vh;

  border-radius: 0.3125vw;
  border: solid 0.05vw #d14680;
  background-color: #bc366e;
  color: #ffffff;
  padding: 0.5vh 0.4vw;
  margin-left: 0.5vw;
  font-size: 0.9vw;

  display: flex;
  justify-content: center;
  align-items: center;

  opacity: ${({ isLoading }) => (isLoading ? '0' : '1')};
`

const StyledHeader = styled.header<{
  isLoading: boolean
}>`
  width: 100%;
  height: 12%;

  border-bottom: 0.05vw solid #28292e;
  display: flex;
  align-items: center;

  & strong {
    height: 2vh;
    display: flex;
    font-size: 1.45vw;
    color: #dddeed;
    width: 50%;

    background: ${({ isLoading }) => (isLoading ? '#666666' : 'transparent')};
    border-radius: 1vw;
  }
`

export default MainHeader
