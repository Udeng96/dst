import React, {useEffect, useState} from "react";
import Field, {EField} from '@/shared/ui/Field/Field';
import {formatDate} from '@/shared/lib/dateUtil';
import {getProcStName} from '@/shared/lib/rinoUtil';
import {Event} from '@/entities/event/EventType';
import styled from "styled-components";
import {StyledButton} from '@/shared/ui/Button/Button';
import usePopupStore, {EPopup, Popup} from '@/app/usePopupStore';
import useEventStore from '@/entities/event/useEventStore';
import {useModifyEventCoordinate} from '@/entities/event/useEvents';

interface IEventDetailForm{
    event: Event;
    setNewEventLocation?
}

const EventDetailForm = ({event, setNewEventLocation}: IEventDetailForm) => {
    const { showPopup } = usePopupStore()
    const newEventLocation = useEventStore((s) => s.newEventLocation)
    const changeEventCoordinates = useEventStore((s) => s.changeEventCoordinate)
    const selectedEvent = useEventStore((s) => s.selectedEvent)
    const { setChangeEventCoordinate, setNewEventLocation: setStoreNewEventLocation } = useEventStore()
    const { mutate: modifyEventCoordinate } = useModifyEventCoordinate()

    const formatCoord = (x: string, y: string) => {
        const px = parseFloat(x)
        const py = parseFloat(y)
        if(isNaN(px) || isNaN(py)) return '-'
        return `X: ${px.toFixed(5)}, Y: ${py.toFixed(5)}`
    }
    const [coordinateInput, setCoordinateInput] = useState<string>(() => formatCoord(event.x, event.y))
    useEffect(() => {
        if(event){
            setCoordinateInput(formatCoord(event.x, event.y))
        }
    }, [event])
    useEffect(() => {
        return() => {
            setChangeEventCoordinate(true)
        }
    }, [selectedEvent])

    const saveEventCoordinatesStatus = () => {
        showPopup({
            message: '이벤트 발생 위치를 수정하시겠습니까?',
            type: EPopup.question,
            buttonText: '수정',
            title: '이벤트 발생 위치 수정',
            callback: () => {
                if(newEventLocation.lng !== 0 && newEventLocation.lat !== 0) {
                    modifyEventCoordinate({x: String(newEventLocation.lng), y: String(newEventLocation.lat), statEvetOutbSeqn: event.statEvetOutbSeqn})
                    setStoreNewEventLocation({ lat: 0, lng: 0 })
                    setChangeEventCoordinate(true)
                }
            }
        } as Popup)
    }
    return(
        <>
            <Field labelText={'발생유형'} inputText={event.svcThemeNm} readOnly={true}/>
            <Field labelText={'발생일시'} inputText={formatDate(event.outbDtm)} readOnly={true}/>
            <Field labelText={'처리상태'} inputText={getProcStName(event.procSt)} readOnly={true}/>
            <Field labelText={'발생위치'} inputText={event.outbPlac} readOnly={true}/>
            <Field labelText={'발생좌표'} inputText={coordinateInput} readOnly={true}/>
            <Field labelText={'내용'} inputText={event.statEvetCntn} fieldType={EField.textarea} readOnly={true} height={'30vh'}/>
            {/*<StyledChangeLocationButton changeEventCoordinates={changeEventCoordinates} onClick={() => {*/}
            {/*    // setChangeEventCoordinates(false);*/}
            {/*    dispatch(changeEventCoordinateRequest(false));*/}
            {/*}}>이벤트 좌표 변경</StyledChangeLocationButton>*/}

            <StyledSaveNewLocationButton changeEventCoordinates={changeEventCoordinates} onClick={() => {
                saveEventCoordinatesStatus();
            }}>신규 좌표 저장</StyledSaveNewLocationButton>
        </>
    )
}

export default EventDetailForm

const StyledChangeLocationButton = styled(StyledButton)<{ changeEventCoordinates }>`

  width: 30%;
  height: 6vh;
  max-height: 40px;
  border-radius: 1vw;
  box-shadow: 0 0.15625vw 0.46875vw 0 rgb(123 26 255 / 27%);
  border: solid 0.05vw #9c5eff;
  background-image: linear-gradient(to left, #6243c1, #6243c1, #9f6be8);
  color: #ffffff;

  display: ${props => props.changeEventCoordinates ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;

  &:hover {
    border: solid 0.05vw #9f77f7;
    background-image: linear-gradient(to left, #7c5bf5, #7c5bf5, #a97aeb);
  }
`

const StyledSaveNewLocationButton = styled(StyledButton)<{ changeEventCoordinates }>`

  width: 30%;
  height: 6vh;
  max-height: 40px;
  border-radius: 1vw;
  box-shadow: 0 0.15625vw 0.46875vw 0 rgb(123 26 255 / 27%);
  border: solid 0.05vw #9c5eff;
  background-image: linear-gradient(to left, #6243c1, #6243c1, #9f6be8);
  color: #ffffff;

  display: ${props => props.changeEventCoordinates ? 'none' : 'flex'};
  justify-content: center;
  align-items: center;

  &:hover {
    border: solid 0.05vw #9f77f7;
    background-image: linear-gradient(to left, #7c5bf5, #7c5bf5, #a97aeb);
  }
`