import {Mobile} from '@/entities/mobile/MobileType';
import {Popup} from "react-leaflet";
import {useLayoutEffect, useRef, useState} from "react";
import {playXeusPlayer} from '@/shared/lib/xeusPlayerHelper';
import styled from "styled-components";


import fullScreenBtn from "./btn_pop_expansion_normal.png"
import dragIcon from "../Marker/CctvMarker/icon/icon_gis_cctv_normal.png"

const StyledPlayerPopup = styled.section`
    width: 100%;
  border-radius: 0.5vw;
  overflow: hidden;
  background-color: #090718;
  display: flex;
  flex-direction: column;

  & > header {
    width: 80%;
    height: 24px;
    line-height: 24px;
    padding: 0 15% 0 5%;
    margin: 0;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
  }

  & > header > b {
    width: 100%;
    height: 24px;
    line-height: 24px;

    font-family: NotoSansCJKkr, serif;
    font-size: 0.5vw;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    color: #fcfcfc;
    display: inline-block;
  }

  & > header > button {
    cursor: pointer;
    width: 13px;
    height: 13px;
    background: url(${fullScreenBtn}) no-repeat;
    background-size: 100% 100%;

    position: absolute;
    right: 20px;
    top: 5px;
  }

  & > main {
    width: 100%;
    height: 15vh;
    position: relative;
    background-color: black;
  }

  & > footer {
    width: 90%;
    height: 8vh;
    display: flex;
    padding: 0 5%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  & > footer > dl {
    width: 100%;
    height: 1.9vh;
    padding: 0 5%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  & > footer > dl > dt {
    width: 32%;
    height: 1.9vh;
    line-height: 1.9vh;
    color: #868c96;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  & > footer > dl > dd {
    width: 80%;
    min-height: 1.9vh;
    height: auto;
    line-height: 1.9vh;
    color: #fcfcfc;
    display: inline-block;

    font-family: NotoSansCJKkr, serif;
    font-size: 0.5vw;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  & > footer > dl > dd > figure {
    cursor: pointer;
    background: url(${dragIcon}) no-repeat;
    background-size: 100% 100%;
    width: 25px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
  
    `
const PlayerMobilePopup = (props:{playingGisMobile:Mobile, removePlayingGisMobile:Function}) => {

    const [player, setPlayer] = useState(null)
    const [playerId, setPlayerId] = useState(null)

    useLayoutEffect(()=> {
        if(playerId){
            if(props.playingGisMobile!==null){
                setPlayer(playXeusPlayer(playerId,'','mobile',props.playingGisMobile?.mbUrl))

            }
        }else{
            setPlayer(null)

        }
    },[playerId])

    useLayoutEffect(()=>{
        return()=>{
            player?.destroy()
        }
    },[player])

    return props.playingGisMobile &&
        <Popup position={[props.playingGisMobile.lat,props.playingGisMobile.lng]}
               offset={[0, 10]}
               minWidth={300}
               autoPan={false}
               autoClose={false}
               closeOnClick={false}
               eventHandlers={{
                   popupopen: () => setPlayerId('player_' + props.playingGisMobile.id),
                   popupclose: () => {
                       props.removePlayingGisMobile()
                       setPlayerId(null)
                   },
               }}
               closeOnEscapeKey={true}
        >
            <StyledPlayerPopup>
                <header >
                    <b>{`${props.playingGisMobile.userDept} - ${props.playingGisMobile.userNm}`}</b>
                    <button onClick={() => playerId && document.getElementById(playerId).requestFullscreen()}/>
                </header>
                <main id = {playerId}>
                </main>
                <footer>
                    <dl>
                        <dt>촬영시작시간</dt>
                        <dd>{props.playingGisMobile.userDtm}</dd>
                    </dl>
                    <dl>
                        <dt>촬영자</dt>
                        <dd>{props.playingGisMobile.userNm}</dd>
                    </dl>
                </footer>
            </StyledPlayerPopup>
        </Popup>
}


export default PlayerMobilePopup
