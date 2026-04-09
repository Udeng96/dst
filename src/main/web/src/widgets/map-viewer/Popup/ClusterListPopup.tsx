import styled from "styled-components";
import {useEffect, useLayoutEffect, useState} from "react";
import {Popup, useMap, useMapEvents} from "react-leaflet";
import {Scrollbar} from "react-scrollbars-custom";
import {Cctv} from '@/entities/cctv/CctvType';
import {MarkerCluster} from "leaflet";
import {CctvData, ECctv} from "../Marker/CctvMarker/CctvData";
import {useDrag} from "react-dnd";
import {CCTV_SELECT, VIDEO_SELECT} from '@/entities/event/MainType';
import {Mobile} from '@/entities/mobile/MobileType';

interface IClusterListPopup {
    selectedCluster: MarkerCluster<Cctv>,
    setSelectedCluster: (cluster: MarkerCluster<Cctv>) => void,

    handleListItemClick: (cctv: Cctv) => void,
    selectedCctvs?: Cctv[],
    setSelectedCctvs?: (cctv: Cctv[]) => void,
}

const ClusterListPopup = ({
                              selectedCluster, setSelectedCluster,
                              handleListItemClick, selectedCctvs = null, setSelectedCctvs = null,
                          }: IClusterListPopup) => {
    const map = useMap()

    const [cctvs, setCctvs] = useState<Cctv[]>([])

    // mobile 세팅
    const [mobiles, setMobiles] = useState<Mobile[]>([])


    useLayoutEffect(() => {
        if (selectedCluster) {
            const markers = selectedCluster.getAllChildMarkers()
            selectedCluster && setCctvs(markers.map(marker => marker.options.data))
        }
    }, [selectedCluster, selectedCctvs])

    const [isShow, setShow] = useState(false)
    useLayoutEffect(() => {

        if (cctvs) {
            if (cctvs.length <= 50) {
                setShow(true)
            } else {
                // cctvs 가 엇는 경우 cluster
                map.setView(selectedCluster._latlng, map.getZoom() + 1, {
                    animate: true
                })
            }
        }
    }, [cctvs])

    useMapEvents({
        zoomlevelschange: () => {
            setSelectedCluster(null)
        }
    })

    const selectedClusterPopupHandler = {
        'add': _ => {
        },
        remove: _ => {
            setSelectedCluster(null)
            setShow(false)
            setCctvs(null)
            setSelectedCluster(null)
        }
    }


    return isShow && selectedCluster && <Popup position={selectedCluster._latlng}
                                               eventHandlers={selectedClusterPopupHandler}
                                               minWidth={400}>
        <StyledClusterListPopup>
            <header>CCTV 목록</header>
            <Scrollbar style={{width: '400px', height: '200px'}}>
                {cctvs && cctvs.map(cctv => {
                    return <ClusterListItem key={`clusterListItem_${cctv.mgrNo}`} cctv={cctv} handleListItemClick={handleListItemClick}
                                            isSelected={selectedCctvs &&
                                            selectedCctvs.find(selectedCctv =>
                                                selectedCctv.mgrNo === cctv.mgrNo) !== undefined}/>
                })}
            </Scrollbar>
        </StyledClusterListPopup>
    </Popup>
}

interface IClusterListItem {
    cctv: Cctv
    isSelected: boolean,
    handleListItemClick: (cctv: Cctv) => void,
}

const ClusterListItem = ({cctv, isSelected, handleListItemClick}: IClusterListItem) => {
    const cctvData = CctvData[cctv.gbnCd] ? CctvData[cctv.gbnCd] : CctvData[ECctv.cctv]

    const [{isDragging}, drag] = useDrag( () => ({
        type: VIDEO_SELECT,
        item: cctv,

        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }))

    return <StyledClusterListItem ref={drag}
                                  isSelected={isSelected}
                                  isDragging={isDragging}
                                  onClick={() => handleListItemClick && handleListItemClick(cctv)}>
        <StyledClusterListItemCctv icon={cctvData.normalIcon}/>
        <StyledClusterListItemLabel text={`[${cctvData.name}]`}/>
        <b>{cctv.cctvNm}</b>
    </StyledClusterListItem>
}

const StyledClusterListPopup = styled.ul`
  width: 100%;
  border-radius: 0.5vw;
  overflow: hidden;
  background-color: #1e2036;
  display: flex;
  flex-direction: column;

  & > header {
    background-color: #090718;
    width: 100%;
    height: 24px;
    line-height: 24px;
    padding: 0 15% 0 5%;
    margin: 0;

    position: relative;

    font-size: 0.7vw;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    color: #fcfcfc;
  }

`

const StyledClusterListItem = styled.li<{
    isDragging: boolean,
    isSelected: boolean,
}>`
  cursor: pointer;
  width: 100%;
  height: 3vh;
  padding: 0 0 0 2%;
  background-color: #00000080;
  display: flex;
  justify-content: left;
  align-items: center;
  opacity: ${({isDragging}) => isDragging? 0.4 : 1};

  &:nth-child(odd) {
    background-color: #00000020;
  }

  &:hover {
    background-color: #ffffff20;
  }

  & > b {
    padding-left: 2%;
    width: 80%;

    font-size: 0.6vw;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    ${({isSelected}) => isSelected ? `background: linear-gradient(to right,#3173f9,#6628f2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;` : `color: #fcfcfc;`}

  }
`


const StyledClusterListItemCctv = styled.div<{
    icon: string
}>`
  width: 29px;
  height: 31px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(${({icon}) => icon}) no-repeat;
  background-size: 100% 100%;
`
const StyledClusterListItemLabel = styled.label<{
    color?: string,
    text: string
}>`

  width: 20%;
  display: flex;
  justify-content: left;
  align-items: center;

  &:before {
    width: 5px;
    height: 5px;
    border-radius: 5px;
    margin: 0 3px;
    background-color: ${({color}) => color};
    ${({color}) => color ? '"content: ;"' : null};
  }

  &:after {
    color: #FFFFFF;

    font-family: NotoSansCJKkr, serif;
    font-size: 0.3vw;
    font-weight: 600;
    content: '${({text}) => text}';
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`

export default ClusterListPopup