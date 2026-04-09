import styled from "styled-components";
import {DisasterHistory, getDisasterHistoryTypeName} from "@/entities/disaster-history/DisasterHistoryType";
import {MouseEventHandler} from "react";
import {formatDate} from "@/shared/lib/dateUtil";
import useUserStore from "@/entities/user/useUserStore";

interface IHistoryListItem {
    disasterHistory: DisasterHistory,
    isActive: boolean,
    handleClick: MouseEventHandler,
    isReport: boolean,
}

const DisasterHistoryListItem = ({disasterHistory, isActive, handleClick, isReport}: IHistoryListItem) => {
    const isLoading = disasterHistory.type === null

    const users = useUserStore((s) => s.users)

    const registerDisasterHistoryUser = users.find(user => user.userId === disasterHistory.regUserId)

    return <StyledHistoryListItem isActive={isActive} isLoading={isLoading} onClick={handleClick}>
        <dl>
            <dt>등록자</dt>
            <dd>{registerDisasterHistoryUser?registerDisasterHistoryUser.userName:disasterHistory.regUserId?`Unknown(${disasterHistory.regUserId})`:''}</dd>
        </dl>

        <dl>
            <dt>등록일시</dt>
            <dd>{formatDate(disasterHistory.regDate)}</dd>
        </dl>

        <dl>
            <dt>{isReport?'제목':'유형'}</dt>
            <dd>{isReport?disasterHistory.title:getDisasterHistoryTypeName(disasterHistory.type!)}</dd>
        </dl>
    </StyledHistoryListItem>
}

const StyledHistoryListItem = styled.li<{
    isActive: boolean,
    isLoading: boolean,
}>`
  cursor: pointer;
  width: 75%;
  padding: 2% 10%;
  height: 7vh;
  max-height: 84px;

  background-color: ${({isActive}) => isActive ? '#2d2948' : '#2e3036'};
  
  border-radius: 0.625vw;
  border: solid 0.15vw ${({isActive}) => isActive ? '#7e4cff' : 'transparent'};
  
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5vh;
  
  &:hover {
    background-color: ${({isActive}) => isActive ? '#2d2948' : '#3a3c4a'};
  }

  & dl {
    width: 100%;
    height: 100%;
    
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
  }
  
  & dt {
    height: 100%;
    font-size: 0.5vw;
    letter-spacing: -0.015vw;
    color: #9c9db5;
    display: flex;
    align-items: center;
    
    width: 30%;

    opacity: ${({isLoading}) => isLoading?'0':'1'};
  }
  
  & dt:before {
    content: '';
    background: #7e4cff;
    width: 2px;
    height: 2px;
    border-radius: 2px;
    margin-right: 5px;
  }
  
  & dd {
    width: 70%;
    height: 1vh;
    font-size: 0.6vw;
    border-radius: 1vw;
    background: ${({isLoading}) => isLoading?'#666666':'transparent'};

  }
`

export default DisasterHistoryListItem