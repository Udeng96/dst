import styled from "styled-components";
import {Event} from '@/entities/event/EventType';
import {DisasterHistory} from '@/entities/disaster-history/DisasterHistoryType';
import {useEffect, useState} from "react";
import {LatLngExpression} from "leaflet";
import {Video} from '@/entities/video/VideoType';
import moment from "moment";
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore';
import {useChkDisasterHistoryPwd} from '@/entities/disaster-history/useDisasterHistories';
import ShareHeader from "@/widgets/share-header/ShareHeader";
import Player from '@/shared/ui/Player/Player';
import Map from "@/widgets/map-viewer/Map";

interface IShareTemplate {
    event: Event,
    disasterHistory: DisasterHistory,
    videos : Video[]
}


const ShareTemplate = ({event, disasterHistory, videos}: IShareTemplate) => {
    const [mapCenter, setMapCenter] = useState<LatLngExpression>([Number(event.y),Number(event.x)]);
    const [centerCoordinate, setMapCenterCoordinate] = useState([])
    const [isValid, setIsValid] = useState<boolean>(false);
    const [showContent, setShowContent] = useState<boolean>(false);

    const [pwd, setPwd] = useState<string>("");

    const chkDisasterHistory = useDisasterHistoryStore((s) => s.chkDisasterHistory)
    const { mutate: chkPwd } = useChkDisasterHistoryPwd()


    useEffect(() => {
        const interval = setInterval(() => {
            const expireDtm = disasterHistory.expireDtm;

            if (Number(moment().format("YYYYMMDDHHmm")) >= Number(expireDtm)) {
                setIsValid(false);
                setShowContent(true);
            }else{
                setIsValid(true);
            }
        }, 1000); // 1초마다 실행

        // cleanup (컴포넌트 unmount되면 인터벌 제거)
        return () => clearInterval(interval);
    }, [disasterHistory]);


    useEffect(() => {
         if(event.x!=='' || event.y!==''){
             setMapCenter([Number(event.y),Number(event.x)])
             setMapCenterCoordinate([Number(event.x),Number(event.y)]);
         }
    }, [event])

    const handleChkPwd = ()=>{
        chkPwd({disasterHistoryId:disasterHistory.disasterHistoryId, pwd:pwd})
        setPwd('');
    }



    return(
        <>
            {
                (isValid && !chkDisasterHistory) &&
                <StyledShareTemplate style={{height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"2vh"}}>
                    <h1 style={{color:"#c8c9d7"}}>암호</h1>
                    <StyledInputText
                        style={{
                            color: "#24252b",
                            background: "#e6e7f5",
                            borderRadius: "1vw",
                            border: "solid 0.05vw #1e1e24",
                            padding:'5px'
                        }}
                    readOnly={false}
                    width={'50%'}
                    height={'3vh'}
                    placeholder={'암호를 입력하세요'}
                    onChange={(e) => setPwd(e.target.value)}
                    />
                    <button style={{
                        color: "#24252b",
                        background: "#e6e7f5",
                        borderRadius: "1vw",
                        border: "solid 0.05vw #1e1e24",
                        height: 'auto',
                        width: 'auto',
                        padding:'2px'
                    }} onClick={() => handleChkPwd()}>확인</button>

                </StyledShareTemplate>

            }
            {
                isValid && chkDisasterHistory &&
                <StyledShareTemplate>
                    <ShareHeader event={event} disasterHistory={disasterHistory}/>
                    <StyledShareMain>
                        <StyledMapArea>
                            <Map center={mapCenter} isShow={true} isShare={true} newCenterCoordinates={centerCoordinate}/>
                        </StyledMapArea>
                        <StyledCctvsArea>
                            {
                                //video
                                videos &&  videos.map((video, index) =>
                                    <li key={`player_${index + 1}`}>
                                        <Player index={index} isActive={false} video={video} isShare={true}/>
                                    </li>
                                )
                            }
                        </StyledCctvsArea>
                    </StyledShareMain>
                    {/*맵*/}
                    {/*CCTVS*/}
                </StyledShareTemplate>

            }
            {
                !isValid &&
                <StyledShareTemplate style={{height:"100%"}}>
                    {
                        showContent&&
                        <h1 style={{color:"#c8c9d7"}}>기한이 만료되어 사용할 수 없습니다.</h1>
                    }
                </StyledShareTemplate>
            }
            {

            }
        </>
        )

}

const StyledMapArea = styled.section`

  width: 90vw;
  height: 90vw;

  @media only screen and (min-width: 1440px) {

    width: 49%;
    height: 100%;
  }

`

const StyledCctvsArea = styled.section`

  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  align-content: space-between;

  & li {
    list-style-type: none;
    width: 90vw;
    height: 50vw;
    margin-top: 1vh;
  }

  @media only screen and (min-width: 1440px) {

    width: 49%;
    height: 100%;
    flex-direction: row;
    flex-wrap: wrap;

    & li {
      margin: 0;
      width: 49%;
      height: 49%;
    }
  }



`

const StyledShareMain = styled.main`
  width: 100%;
  height: auto;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;

  @media only screen and (min-width: 1440px) {
    height: 67vh;
    flex-direction: row;
  }

`

const StyledShareTemplate = styled.section`
  width: 90%;
  height: auto;

  padding: 3vh 5vw;

  background: linear-gradient(280deg, #39385c, #2d2c47 97.3%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledInputText = styled.input.attrs(() => ({
    type: 'text',
}))<{
    readOnly: boolean,
    width: string,
    height: string,
}>`
    width: ${({width}) => width};
    height: ${({height}) => height};
    max-height: 38px;

    padding: 0 1vw;
    border-radius: 0.4vw;

    border: solid 0.05vw ${({readOnly}) => readOnly ? '#1e1e24' : '#3f4147'};
    background-color: ${({readOnly}) => readOnly ? '#24252b' : '#1d1d24'};
    letter-spacing: -0.01vw;
    color: #e6e7f5;
`

export default ShareTemplate