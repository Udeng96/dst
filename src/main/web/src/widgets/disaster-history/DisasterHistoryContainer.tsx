import styled from "styled-components";
import {StyledButton} from '@/shared/ui/Button/Button';
import DisasterHistorySearch from "./DisasterHistorySearch";
import DisasterHistoryList from "./DisasterHistoryList";
import {DisasterHistory} from '@/entities/disaster-history/DisasterHistoryType';
import {ECrudStatus} from "../situation-transfer/SituationTransfer";
import {useEffect, useState} from "react";
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore';

interface IDisasterHistoryContainer {
    name: string,
    disasterHistories: DisasterHistory[],
    crudStatus?: ECrudStatus,
    setCrudStatus?: (status: ECrudStatus) => void,

    // 지저분한 방법인건 알지만 마땅한 방법이 생각안남
    // 리팩토링 필요...
    isReport: boolean,
}

const DisasterHistoryContainer = ({
                                      name,
                                      disasterHistories,
                                      crudStatus = ECrudStatus.loading,
                                      setCrudStatus,
                                      isReport,
                                  }: IDisasterHistoryContainer) => {

    const { setSelectedDisasterHistory } = useDisasterHistoryStore()
    const [filteredDisasterHistories, setFilteredDisasterHistories] = useState<DisasterHistory[]>([])
    useEffect(() => {
        setFilteredDisasterHistories(disasterHistories)
    }, [disasterHistories])

    return <StyledHistoryContainer>
        {crudStatus !== ECrudStatus.create && crudStatus !== ECrudStatus.update ?
            <StyledAddHistory onClick={() => {
                setSelectedDisasterHistory(null)
                setTimeout(()=>{
                    setCrudStatus(ECrudStatus.create)
                },100)
            }}>{`+${name} 추가`}</StyledAddHistory> : null}
        <DisasterHistorySearch isReport={isReport} disasterHistories={disasterHistories} setFilteredDisasterHistories={setFilteredDisasterHistories} name={name}/>
        <DisasterHistoryList isReport={isReport} disasterHistories={filteredDisasterHistories} name={name} setCrudStatus={setCrudStatus}/>
    </StyledHistoryContainer>
}

const StyledAddHistory = styled(StyledButton)`
  width: 100%;
  height: 6vh;
  max-height: 40px;
  border-radius: 1vw;
  box-shadow: 0 0.15625vw 0.46875vw 0 rgb(123 26 255 / 27%);
  border: solid 0.05vw #9c5eff;
  background-image: linear-gradient(to left, #6243c1, #6243c1, #9f6be8);
  color: #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: solid 0.05vw #9f77f7;
    background-image: linear-gradient(to left, #7c5bf5, #7c5bf5, #a97aeb);
  }
`


const StyledHistoryContainer = styled.article`
  width: 100%;
  height: 100%;

  padding: 0 4%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

export default DisasterHistoryContainer