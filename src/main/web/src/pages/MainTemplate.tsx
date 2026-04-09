import styled from 'styled-components'
import { Event } from '@/entities/event/EventType'
import EventList from '@/widgets/event-list/EventList'
import MainHeader from '@/widgets/main-header/MainHeader'
import TabGroup from '@/widgets/tab-group/TabGroup'
import EventDetail from '@/widgets/event-detail/EventDetail'
import SituationTransfer from '@/widgets/situation-transfer/SituationTransfer'
import Report from '@/widgets/report/Report'
import { useEffect, useState } from 'react'
import { ETab } from '@/shared/ui/Tab/Tab'
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore'
import useEventStore from '@/entities/event/useEventStore'
import { useDisasterHistories } from '@/entities/disaster-history/useDisasterHistories'
import {
  createTemplateDisasterHistory,
  DisasterHistory,
  EDisasterHistory,
} from '@/entities/disaster-history/DisasterHistoryType'

interface IMainTemplate {
  events: Event[]
}

const MainTemplate = ({ events }: IMainTemplate) => {
  const selectedEvent = useEventStore((s) => s.selectedEvent)
  const disasterHistories = useDisasterHistoryStore((s) => s.disasterHistories)

  // 선택된 이벤트가 바뀔 때마다 해당 이벤트의 재난 전파 내역 조회
  useDisasterHistories(selectedEvent.statEvetOutbSeqn)

  const [filteredDisasterHistories, setFilteredDisasterHistories] = useState<DisasterHistory[]>(
    disasterHistories
  )
  const [selectedTab, setSelectedTab] = useState<ETab>(ETab.eventDetail)
  const { setSelectedDisasterHistory } = useDisasterHistoryStore()

  useEffect(() => {
    setSelectedTab(ETab.eventDetail)
    setSelectedDisasterHistory(null)
  }, [selectedEvent])

  useEffect(() => {
    if (!Array.isArray(disasterHistories)) return
    if (selectedTab === ETab.report) {
      setFilteredDisasterHistories(
        disasterHistories.filter((dh) => dh.type === EDisasterHistory.report)
      )
    } else {
      setFilteredDisasterHistories(
        disasterHistories.filter((dh) => dh.type !== EDisasterHistory.report)
      )
    }
  }, [selectedEvent, selectedTab, disasterHistories])

  const isLoading = selectedEvent?.uSvcOutbId === ''

  return (
    <StyledMainTemplate>
      <StyledEventListAside>
        <EventList events={events} />
      </StyledEventListAside>
      <StyledMainSection>
        <MainHeader event={selectedEvent} />
        <TabGroup isLoading={isLoading} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <StyledDisasterSituationMain isLoading={isLoading}>
          <EventDetail event={selectedEvent} isSelected={selectedTab === ETab.eventDetail} />
          <SituationTransfer
            isLoading={isLoading}
            disasterHistories={filteredDisasterHistories}
            isSelected={selectedTab === ETab.situationTransfer}
            selectedEvent={selectedEvent}
          />
          <Report
            selectedEvent={selectedEvent}
            disasterHistories={filteredDisasterHistories}
            isSelected={selectedTab === ETab.report}
          />
        </StyledDisasterSituationMain>
      </StyledMainSection>
    </StyledMainTemplate>
  )
}

const StyledEventListAside = styled.aside`
  width: 24%;
  min-width: 24%;
  height: 100%;

  box-shadow: 0.2vw 0 0.625vw 0 rgb(0 0 0 / 20%);
  background-image: linear-gradient(to bottom, #1d1e21, #1d1e21);
`

const StyledMainSection = styled.section`
  flex-grow: 1;
  height: 100%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  padding: 0 3.5%;
`

const StyledDisasterSituationMain = styled.main<{
  isLoading: boolean
}>`
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  margin-top: 1px;

  border-radius: 1.25vw;
  border: solid 0.05vw #26262b;
  background-color: #1c1c21;

  padding: 2%;

  overflow: hidden;
  opacity: ${({ isLoading }) => (isLoading ? '0' : '1')};
`

const StyledMainTemplate = styled.section`
  width: 100%;
  height: 100%;
  background-color: #15161a;
  display: flex;

  justify-content: center;
  align-items: center;
`

export default MainTemplate
