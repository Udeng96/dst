import {Event} from '@/entities/event/EventType'
import styled from "styled-components";
import normalDot from "./img_timeLine_dot_normal.png";
import {MouseEventHandler} from "react";
import {formatDate} from '@/shared/lib/dateUtil';
import {getProcStName} from '@/shared/lib/rinoUtil';
import usePopupStore, {EPopup, Popup} from '@/app/usePopupStore';
import {useFinishEvent} from '@/entities/event/useEvents';

interface IEventListItem {
    isActive: boolean,
    event: Event,
    handleClick: MouseEventHandler
}

const EventListItem = ({isActive, event, handleClick}: IEventListItem) => {
    const { showPopup } = usePopupStore()
    const { mutate: finishEvent } = useFinishEvent()
    const isLoading = event.uSvcOutbId === ''

    return <StyledEventListItem onClick={handleClick}>
        <StyledEventListItemHeader isLoading={isLoading}>{formatDate(event.outbDtm)}</StyledEventListItemHeader>
        <StyledEventListItemMain isActive={isActive} isLoading={isLoading}>
            <span>
                <b>{event.statEvetNm}</b>
                <small>{event.svcThemeNm}</small>
            </span>
            <span>
                <dl>
                    <dt>처리상태</dt>
                    <dd>{getProcStName(event.procSt)}</dd>
                </dl>

                {event.procSt !== '5' && !isLoading ? <button onClick={() => {
                    showPopup({
                        title: '이벤트 종료',
                        buttonText: '종료',
                        isCloseButtonShow: true,
                        type: EPopup.event,
                        message: '이벤트를 종료하시겠습니까?',
                        callback: () => finishEvent(event.statEvetOutbSeqn)
                    } as Popup)
                }}>이벤트 종료</button> : null}
            </span>
        </StyledEventListItemMain>
    </StyledEventListItem>
}

const StyledEventListItemHeader = styled.header<{
    isLoading: boolean,
}>`
  min-height: 1.5vh;
  max-height: 20px;
  font-size: 0.67vw;
  letter-spacing: 0.01vw;
  color: #e1e2f0;
  line-height: 2.5vh;
  margin-left: 1vw;
  margin-bottom: 0.5vh;

  background: ${({isLoading}) => isLoading ? '#666666' : 'transparent'};
  border-radius: 1vw;
`

const StyledEventListItemMain = styled.main<{
    isActive: boolean,
    isLoading: boolean,
}>`
  width: calc(100% - 2.5vw);
  height: 80%;
  max-height: 120px;
  border-radius: 0.83vw;
  cursor: pointer;
  background: ${({isActive}) => isActive ? 'linear-gradient(285deg, #432635 99%, #432635 99%, #4c2a3c 1%)' : '#2e3036'};
  border: solid 0.15vw ${({isActive}) => isActive ? '#b0335f' : 'transparent'};
  padding: 1vh 1vw;
  display: flex;
  justify-content: space-around;
  flex-direction: column;

  &:hover {
    background: ${({isActive}) => isActive ? '' : '#3a3c4a'};
  }

  & span {
    display: flex;
    justify-content: space-between;
  }

  & b {
    width: 100%;
    min-height: 1.5vh;
    //height: 2vh;
    max-height: 20px;
    font-size: 1vw;
    letter-spacing: -0.04vw;
    color: #ffffff;

    display: flex;
    flex: 8;
    margin-right: -4vw;

    background: ${({isLoading}) => isLoading ? '#666666' : 'transparent'};
    border-radius: 1vw;
  }

  & small {
    width: 100%;
    flex: 2;
    display: flex;
    font-size: 0.72vw;
    letter-spacing: -0.03vw;
    color: #dd4e8a;

    background: ${({isLoading}) => isLoading ? '#dd4e8a' : 'transparent'};
    border-radius: 1vw;
  }

  & dl {

    width: 60%;
    min-height: 1.5vh;
    height: 2.71vh;
    max-height: 20px;

    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  & dd {
    width: 100%;
    flex: 6;
    min-height: 1.5vh;
    //height: 100%;
    font-size: 0.625vw;
    letter-spacing: -0.015vw;
    padding-left: 0.45vw;
    color: #ccbfd6;
    position: relative;
    display: flex;
    align-items: center;
    margin-left: 5%;

    background: ${({isLoading}) => isLoading ? '#666666' : 'transparent'};
    border-radius: 1vw;
  }

  & dt {
    width: 100%;
    flex: 4;
    height: 100%;
    font-size: 0.625vw;
    letter-spacing: -0.015vw;
    padding-left: 0.45vw;
    color: #ccbfd6;
    position: relative;
    display: flex;
    align-items: center;

    opacity: ${({isLoading}) => isLoading ? '0' : '1'};
  }

  & dt:before {
    content: '';
    width: 2px;
    height: 2px;
    border-radius: 2px;
    background-color: ${({isActive}) => isActive ? '#b0335b' : '#7e4cff'};
    position: absolute;
    left: -2px;
  }

  & button {
    cursor: pointer;
    width: 40%;
    height: 2.71vh;
    max-height: 28px;
    border-radius: 0.72vw;
    margin-left: 10%;

    background-color: ${({isActive}) => isActive ? '#de3c5f' : 'rgba(255,255,255,0.1)'};
    border: solid 0.05vw ${({isActive}) => isActive ? '#ed4e71' : 'rgba(0,0,0,0.1)'};
    color: rgba(255, 255, 255, 0.5);

    box-shadow: 0 0.15625vw 0.625vw 0 rgb(0 0 0 / 12%);
    font-size: 0.625vw;
    letter-spacing: -0.01vw;
    text-align: center;
    color: #f3f3f8;

    opacity: ${({isLoading}) => isLoading ? '0' : '1'};

  }

  & button:hover {
    background-color: ${({isActive}) => isActive ? '#e34b6c' : 'rgba(255,255,255,0.1)'};
  }
`


const StyledEventListItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;

  width: calc(100% - 1.6vw);
  height: 15%;

  padding-top: 1.8vh;
  padding-left: 1.6vw;

  &:before {
    content: '';
    width: 27px;
    height: 27px;

    background: url(${normalDot}) no-repeat center;
    background-size: 100% 100%;

    position: absolute;
    left: -2px;
    top: 1.2vh;
  }
`

export default EventListItem