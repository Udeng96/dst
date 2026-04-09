import { Event } from '@/entities/event/EventType'
import styled from 'styled-components'
import { Scrollbar } from 'react-scrollbars-custom'
import EventListItem from '@/shared/ui/EventListItem/EventListItem'
import { useEffect, useRef, useState } from 'react'
import Field, { EField } from '@/shared/ui/Field/Field'
type Option = { value: string; label: string }
import { DayRange } from '@hassanmojab/react-modern-calendar-datepicker'
import { StyledButton } from '@/shared/ui/Button/Button'
import { parseDate, zeroPadding } from '@/shared/lib/dateUtil'
import { LOGIN_REDIRECT_URL } from '@/shared/config/DstConstants'

import logo from './lgo_hwaseong_tng_84x32.png'
import moment from 'moment'
import useEventStore from '@/entities/event/useEventStore'
import { useEvents } from '@/entities/event/useEvents'
import { EventSearchParam } from '@/entities/event/EventType'

interface IEventList {
  events: Event[]
}

const eventStatusOptions = [
  { value: '', label: '선택' },
  { value: '1', label: '발생' },
  { value: '5', label: '종료' },
] as Option[]

const EventList = ({ events }: IEventList) => {
  const { setSelectedEvent, selectedEvent } = useEventStore()
  const [searchParam, setSearchParam] = useState<EventSearchParam | null>(null)

  useEvents(searchParam)

  const [searchType, setSearchType] = useState<Option>(eventStatusOptions[0])
  const [searchDate, setSearchDate] = useState<DayRange>({
    from: null,
    to: null,
  })

  const inputRef = useRef(null)
  const handleEnterKeyPress = (event: KeyboardEvent) => {
    if (inputRef && inputRef.current === document.activeElement && event.key === 'Enter') {
      filterEventHistories()
    }
  }

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [todayEvents, setTodayEvents] = useState<Event[]>([])

  useEffect(() => {
    if (Array.isArray(events) && events.length > 0) {
      const todays = events.filter((event: Event) => {
        return event.outbDtm.startsWith(moment().format('YYYYMMDD'))
      })
      let lastEvents: Event[] = []
      if (todayEvents.length < 100) {
        let lastCnt = 100 - todayEvents.length
        lastEvents = events.filter((event: Event) => {
          return !event.outbDtm.startsWith(moment().format('YYYYMMDD'))
        })
        lastEvents = lastEvents.splice(0, lastCnt)
      }
      const result = [...todays, ...lastEvents]
      setTodayEvents(result)
    }
  }, [events])

  const filterEventHistories = () => {
    let from = searchDate.from
      ? searchDate.from.year.toString() +
        zeroPadding(searchDate.from.month) +
        zeroPadding(searchDate.from.day)
      : ''

    let to = searchDate.to
      ? searchDate.to.year.toString() +
        zeroPadding(searchDate.to.month) +
        zeroPadding(searchDate.to.day)
      : ''

    setSearchParam({
      searchType: searchType.value,
      from,
      to,
    })
  }

  const moveHistoryBack = () => {
    window.location.href = LOGIN_REDIRECT_URL
  }

  useEffect(() => {
    document.addEventListener('keypress', handleEnterKeyPress)
    return () => {
      document.removeEventListener('keypress', handleEnterKeyPress)
    }
  }, [filterEventHistories])

  return (
    <StyledEventListContainer>
      <StyledEventListHeader>
        <StyledLogoArea onClick={moveHistoryBack} />
        <div style={{ flexGrow: 8 }}>
          <h1>재난상황 발생 목록</h1>
          <p>List of Disaster Occurrences</p>
        </div>
      </StyledEventListHeader>
      <StyledSearchArea>
        <Field
          height={'3vh'}
          handleChange={setSearchDate}
          labelText={'일시'}
          inputText={''}
          selectedDate={searchDate!}
          fieldType={EField.datepicker}
          labelWidth={'25%'}
          inputWidth={'70%'}
        />
        <Field
          labelText={'상태'}
          options={eventStatusOptions}
          inputText={''}
          fieldType={EField.select}
          value={searchType}
          handleChange={setSearchType}
          labelWidth={'25%'}
          inputWidth={'70%'}
        />
        <StyledHistorySearchButton onClick={filterEventHistories}>검색</StyledHistorySearchButton>
      </StyledSearchArea>
      <StyledEventList scrollbarWidth={0}>
        {filteredEvents.length === 0
          ? todayEvents.map((event) => {
              return (
                <EventListItem
                  key={event.statEvetOutbSeqn}
                  handleClick={() => {
                    setSelectedEvent(event)
                  }}
                  isActive={selectedEvent?.statEvetOutbSeqn === event.statEvetOutbSeqn}
                  event={event}
                />
              )
            })
          : filteredEvents.map((event, index) => {
              if (index < 100) {
                return (
                  <EventListItem
                    key={event.statEvetOutbSeqn}
                    handleClick={() => {
                      setSelectedEvent(event)
                    }}
                    isActive={selectedEvent?.statEvetOutbSeqn === event.statEvetOutbSeqn}
                    event={event}
                  />
                )
              }
            })}
      </StyledEventList>
    </StyledEventListContainer>
  )
}

const StyledSearchArea = styled.div`
  height: 15vh;
  position: relative;
`
const StyledHistorySearchButton = styled(StyledButton)`
  width: 78%;
  height: 3vh;
  max-height: 32px;
  border-radius: 0.8vw;
  background-color: #7a45ff;
  font-size: 0.7vw;
  letter-spacing: -0.01vw;
  color: #ffffff;
  justify-content: center;
  align-items: center;

  position: absolute;
  margin: 10px auto;
  left: 50px;
`

const StyledEventList = styled(Scrollbar)`
  position: relative;
  height: calc(100% - 25vh) !important;
  universal: true;
  border-top: 0.05vw solid #313238;

  &:before {
    content: '';
    width: 0.15vw;
    height: 75vh;
    max-height: 912px;
    box-shadow: 0 0.15625vw 0.78125vw 0 rgb(0 0 0 / 15%);
    background-color: #2d2f35;
    position: absolute;
    left: 10px;
  }

  & .ScrollbarsCustom-Scroller,
  & .ScrollbarsCustom-Content {
    width: 100%;
    height: 100%;
  }

  & .ScrollbarsCustom-ThumbY {
    background-color: #585766 !important;
    width: 0.3125vw !important;
    border-radius: 0.15625vw !important;
  }

  & .ScrollbarsCustom-TrackY {
    background-color: transparent !important;
    width: 0.3125vw !important;
    right: -0.5vw !important;
    top: 2vh !important;
  }
`

const StyledEventListHeader = styled.header`
  display: flex;
  align-items: flex-start;
  height: 9vh;
  border-bottom: 0.05vw solid #313238;
  justify-content: space-between;

  & div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }

  & div h1 {
    font-size: 1.14vw;
    letter-spacing: -0.02vw;
    color: #dddeed;
    line-height: 3vh;
  }

  & div p {
    font-size: 0.83vw;
    letter-spacing: 0.02vw;
    color: #8878ff;
    line-height: 1.5vh;
  }

  & button {
    cursor: pointer;
    width: 6vw;
    height: 6vh;
    max-height: 40px;
    border-radius: 1vw;
    box-shadow: 0 0.15625vw 0.46875vw 0 rgb(123 26 255 / 27%);
    border: solid 0.05vw #d14680;
    background-color: #e34b6c;
    color: #ffffff;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  & button:hover {
    background-color: #e34b6c;
  }
`

const StyledEventListContainer = styled.aside`
  display: flex;
  flex-direction: column;
  padding: 0 1.5vw;

  width: calc(100% - 3vw);
  height: 100%;
`

const StyledLogoArea = styled.div`
  position: relative;
  width: 84px;
  height: 32px;
  background: url(${logo}) no-repeat;
  background-position: left;
  margin-left: 18px;
  flex-grow: 1;
  cursor: pointer;
`

export default EventList
