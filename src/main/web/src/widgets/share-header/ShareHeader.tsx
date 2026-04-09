import styled from "styled-components";
import {Event} from '@/entities/event/EventType';
import {DisasterHistory} from '@/entities/disaster-history/DisasterHistoryType';
import {formatDate} from '@/shared/lib/dateUtil';
import {useEffect} from "react";
import moment from "moment";

interface IShareHeader {
    event: Event,
    disasterHistory: DisasterHistory
}

const ShareHeader = ({event, disasterHistory}: IShareHeader) => {

    const convertDegreeToDms = (coordinate: number): string => {
        const absolute = Math.abs(coordinate);
        const degrees = Math.floor(absolute);
        const minutesNotTruncated = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesNotTruncated);
        const seconds = Math.round((minutesNotTruncated - minutes) * 60);

        return degrees + "-" + minutes + "-" + seconds;
    };

    return <StyledShareHeader>
        <h1>
            <figure>{event.svcThemeNm}</figure>
            <b>{disasterHistory.title}</b>
        </h1>

        <h2>{disasterHistory.content}</h2>

        <aside>
            <dl>
                <dt>발생일시</dt>
                <dd>{formatDate(event.outbDtm)}</dd>
            </dl>
            <dl>
                <dt>발생위치</dt>
                <dd>{event.outbPlac}</dd>
            </dl>
            <dl>
                <dt>발생 지점 좌표</dt>
                <dd>X : {event.x} ({convertDegreeToDms(Number(event.x))}) / Y : {event.y} ({convertDegreeToDms(Number(event.y))})</dd>
            </dl>
            <dl>
                <dt>만료 시간</dt>
                <dd>{moment(disasterHistory.expireDtm,'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm')}</dd>
            </dl>
        </aside>
    </StyledShareHeader>
}

const StyledShareHeader = styled.header`
  width: 100%;
  height: 27vh;

  display: flex;
  justify-content: space-around;
  //align-items: center;
  flex-direction: column;
  
  & h1 {
    display: flex;
    align-items: center;
  }
  
  & h2 {
    font-size: 5vw;
    letter-spacing: -0.08vw;
    color: #c8c9d7;
    //display: flex;
    //justify-content: center;
    //align-items: center;
  }

  & h1 b {
    font-size: 8vw;
    font-weight: 500;
    color: #f2f3f5;
    letter-spacing: -0.1vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  & h1 figure {
    display: none;
    font-size: 5vw;
  }
  
  & aside {
    display: flex;
    flex-direction: column;
    //align-items: center;
    //justify-content: center;
  }
  
  & dl {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 1vh 0;
  }
  
  & dt {
    font-size: 2.9vw;
    letter-spacing: -0.06vw;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #a8abbd;
    margin-right: 1vw;
  }
  
  & dt:before {
    content: '';
    width: 0.7vw;
    height: 0.7vw;
    margin-right: 0.5vw;
    background-color: #8554ff;
  }
  
  & dd {
    font-size: 3vw;
    letter-spacing: -0.06vw;
    color: #e6e7f5;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  
  @media only screen and (min-width: 1440px) {
    & h1 b {
      font-size: 36px;
      letter-spacing: -1px;
    }

    & h1 figure {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      
      padding: 0 20px;
      height: 35px;
      
      border: solid 2px #b0335f;
      border-radius: 6px;
      color: #e34285;
      font-size: 20px;
      font-weight: 400;
      letter-spacing: -0.5px;
    } 
    
    & h2 {
      font-size: 22px;
      letter-spacing: -0.55px;
    }

    & aside {
      flex-direction: row;
    }

    & dl {
      margin: 0 10px;
    }

    & dt {
      font-size: 16px;
      letter-spacing: -0.4px;
    }

    & dt:before {
      width: 5px;
      height: 5px;
      margin-right: 5px;
    }

    & dd {
      font-size: 16px;
      letter-spacing: -0.4px;
    }
    
  }
`


export default ShareHeader