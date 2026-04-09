import React from "react";
import styled from "styled-components";
import {Scrollbar} from "react-scrollbars-custom";
import {DisasterHistory, EDisasterHistory} from '@/entities/disaster-history/DisasterHistoryType';
import DisasterHistoryListItem from "./DisasterHistoryListItem";
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore';
import {ECrudStatus} from "../situation-transfer/SituationTransfer";
import {useVideos} from '@/entities/video/useVideos';

interface IDisasterHistoryList {
    name: string,
    disasterHistories: DisasterHistory[],
    isReport: boolean,
    setCrudStatus: Function
}

const DisasterHistoryList = ({name, disasterHistories, isReport, setCrudStatus}: IDisasterHistoryList) => {
    const selectedDisasterHistory = useDisasterHistoryStore((s) => s.selectedDisasterHistory)
    const { setSelectedDisasterHistory } = useDisasterHistoryStore()
    useVideos(selectedDisasterHistory?.disasterHistoryId)

    return <StyledHistoryListContainer>
        <StyledHistoryListHeader>{name}</StyledHistoryListHeader>
        <StyledHistoryList scrollbarWidth={0}>
            {disasterHistories.map(disasterHistory =>
                <DisasterHistoryListItem key={disasterHistory.disasterHistoryId}
                                         isReport={isReport}
                                         isActive={selectedDisasterHistory && selectedDisasterHistory.disasterHistoryId === disasterHistory.disasterHistoryId}
                                         handleClick={() => {
                                             setSelectedDisasterHistory(disasterHistory)
                                         }}
                                         disasterHistory={disasterHistory}/>)}
        </StyledHistoryList>
    </StyledHistoryListContainer>
}

const StyledHistoryListHeader = styled.header`
  width: 100%;
  height: 30px;
  font-size: 0.65vw;
  letter-spacing: -0.01vw;
  color: #86879c;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 1vw;
`

const StyledHistoryList = styled(Scrollbar)`
  position: relative;
  height: calc(100% - 10vh) !important;
  width: 100%;
  flex: 8;

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

const StyledHistoryListContainer = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  border-top: 1px solid #363940;
  padding-top: 1vh;
`

export default DisasterHistoryList