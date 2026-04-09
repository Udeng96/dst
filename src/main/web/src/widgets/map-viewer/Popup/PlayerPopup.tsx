import {useEffect, useLayoutEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Popup, useMap} from "react-leaflet";
import * as L from "leaflet"
import {DragEndEventHandlerFn, LatLngExpression} from "leaflet"
import fullScreen from './btn_pop_expansion_normal.png'
import {playXeusPlayer} from '@/shared/lib/xeusPlayerHelper';
import {Cctv} from '@/entities/cctv/CctvType';
import {CctvData, ECctv} from "../Marker/CctvMarker/CctvData";
import {useDrag} from "react-dnd";
import {CCTV_SELECT} from '@/entities/event/MainType';

interface IPlayerPopup {
    playingGisCctv: Cctv,
    removePlayingGisCctv: (cctvs: Cctv) => void,
}

const PlayerPopup = ({playingGisCctv, removePlayingGisCctv}: IPlayerPopup) => {

    const [{isDragging}, drag] = useDrag(() => ({
        type: CCTV_SELECT,
        item: playingGisCctv,

        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }))

    const map = useMap()
    const [playerId, setPlayerId] = useState(null)
    const [player, setPlayer] = useState(null)
    useLayoutEffect(() => {
        if (playerId) {
            if(playingGisCctv.deviceId.indexOf('rtsp') > -1){
                setPlayer(playXeusPlayer(playerId, '','', playingGisCctv.deviceId))
            }else{
                setPlayer(playXeusPlayer(playerId, playingGisCctv.mgrNo, playingGisCctv.clftNm,''))
            }
            // setPlayer(playXeusPlayer(playerId, playingGisCctv.mgrNo))
        } else {
            setPlayer(null)
        }
    }, [playerId])

    useLayoutEffect(() => {
        return () => {
            player?.destroy()
        }
    }, [player])

    // const []
    const [draggable, setDraggable] = useState<L.Draggable>()
    const [popupLine, setPopupLine] = useState<L.Polyline>()
    const popupRef = useRef<any>()
    const headerRef = useRef<any>()

    const [position, setPosition] = useState<LatLngExpression>([playingGisCctv.y, playingGisCctv.x])

    const handlePopupDragEnd: DragEndEventHandlerFn = (event) => {
        // console.log("END DRAG", event)
        const popup = popupRef.current

        const point = event.target._newPos
        const targetLatlng = map.layerPointToLatLng(point)

        popup.setLatLng(targetLatlng)
        setPosition(targetLatlng)
        setPopupLine(new L.Polyline(
            [[playingGisCctv.y, playingGisCctv.x], targetLatlng], {
                color: 'black',
                weight: 5,
                opacity: 0.7,
            }))
    }

    useLayoutEffect(() => {
        if (popupLine) {
            map.addLayer(popupLine)
            return () => {
                map.removeLayer(popupLine)
            }
        }
    }, [popupLine])

    useLayoutEffect(() => {
        const popup = popupRef.current
        const header = headerRef.current
        console.log("HEADER ", header)

        if (popup && header) {
            setDraggable(new L.Draggable(popup._container, headerRef.current, true))
        }

        return () => {
            console.log("END OF popup", popup)
        }
    }, [headerRef.current])

    useLayoutEffect(() => {
        if (draggable) {
            draggable.enable()
            draggable.on('dragend', handlePopupDragEnd)
        }
        return () => {
            if (draggable) {
                draggable.off('dragend', handlePopupDragEnd)
                draggable.disable()
            }
        }
    }, [draggable])

    const cctvData = CctvData[playingGisCctv.gbnCd] ? CctvData[playingGisCctv.gbnCd] : CctvData[ECctv.cctv]
    return playingGisCctv && <Popup position={position}
                                    offset={[0, 10]}
                                    minWidth={300}
                                    autoPan={false}
                                    autoClose={false}
                                    closeOnClick={false}
                                    ref={popupRef}
                                    eventHandlers={{
                                        popupopen: () => setPlayerId('player_' + playingGisCctv.mgrNo),
                                        popupclose: () => {
                                            removePlayingGisCctv(playingGisCctv)
                                            setPlayerId(null)
                                        },
                                    }}
                                    closeOnEscapeKey={true}>
        <StyledPlayerPopup icon={cctvData.normalIcon}>
            <header ref={headerRef}>
                <b>{`[${playingGisCctv.cctvNm}]`}</b>
                <button onClick={() => playerId && document.getElementById(playerId).requestFullscreen()}/>
            </header>
            <main id={playerId}>
            </main>
            <footer>
                <dl>
                    <dt>설치목적</dt>
                    <dd>{cctvData.name}</dd>
                </dl>
                <dl>
                    <dt>관리번호</dt>
                    <dd>{playingGisCctv.mgrNo}</dd>
                </dl>
                <dl>
                    <dt>선택</dt>
                    <dd>
                        <figure ref={drag}/>
                    </dd>
                </dl>
            </footer>
        </StyledPlayerPopup>
    </Popup>
}

const StyledPlayerPopup = styled.section<{
    icon: string
}>`
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
    background: url(${fullScreen}) no-repeat;
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
    width: 20%;
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
    background: url(${({icon}) => icon}) no-repeat;
    background-size: 100% 100%;
    width: 25px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;

  }
`

export default PlayerPopup