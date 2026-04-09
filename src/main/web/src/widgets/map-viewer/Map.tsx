import {MapContainer, Marker, Pane} from "react-leaflet";
import {DivIcon, LatLngExpression, MarkerCluster, MarkerClusterGroup} from "leaflet";
import 'leaflet/dist/leaflet.css'
import BaseMapSelector from "./Control/BaseMapSelector/BaseMapSelector";
import {useState} from "react";
import MapHandler from "./MapHandler";
import RadarMarker from "./Marker/RadarMarker/RadarMarker";
import CenterMarker from "./Marker/CenterMarker/CenterMarker";
import BaseMapLayer, {EBaseMap} from "./Layer/BaseMapLayer";
import {Cctv} from '@/entities/cctv/CctvType';
import CctvMarker from "./Marker/CctvMarker/CctvMarker";
import ClusterListPopup from "./Popup/ClusterListPopup";
import PlayerPopup from "./Popup/PlayerPopup";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";


import radarMarkerImage from "./Marker/RadarMarker/img_gis_circles_event.png"
import useEventStore from '@/entities/event/useEventStore';
import useMobileStore from '@/entities/mobile/useMobileStore';
import MobileMarker from "./Marker/MobileMarker/MobileMarker";
import PlayerMobilePopup from "./Popup/PlayerMobilePopup";
import {DEFAULT_GPS} from '@/shared/config/DstConstants';


interface IMap {
    center: LatLngExpression
    isShow?: boolean

    isShowBaseMapSelector?: boolean,
    isShowCctvs?: boolean,
    isShowMobiles?: boolean,
    isShowCenter?: boolean,
    isShowRadar?: boolean,

    selectedCctvs?: Cctv[],
    setSelectedCctvs?: (cctvs: Cctv[]) => void,
    newCenterCoordinates?: number[],
    isClick?: boolean,
    newEventLocation?: LatLngExpression,
    setNewEventLocation?: (location: LatLngExpression) => void,

    isEventGenerator?: boolean,
    isShare: boolean,
}


const Map = ({
                 center,
                 selectedCctvs, setSelectedCctvs,
                 isShowBaseMapSelector = true,
                 isShowRadar = false,
                 isShowCenter = true,
                 isShowCctvs = false,
                 isShowMobiles = false,
                 isShow = true,
                 newCenterCoordinates,
                 isClick, isEventGenerator,
                 isShare = false
                 // newEventLocation, setNewEventLocation
             }: IMap) => {

    const changeEventCoordinate = useEventStore((s) => !s.changeEventCoordinate)
    const newEventLocation = useEventStore((s) => s.newEventLocation)
    const activeMobile = useMobileStore((s) => s.activeMobile)
    const mobileList = useMobileStore((s) => s.liveMobiles)
    const { setActiveMobile } = useMobileStore()

    const [baseMap, setBaseMap] = useState<EBaseMap>(EBaseMap.basic)
    const [cluster, setCluster] = useState<MarkerClusterGroup>(null)
    const [selectedCluster, setSelectedCluster] = useState<MarkerCluster<Cctv>>(null)
    const [playingGisCctvs, setPlayingGisCctvs] = useState<Cctv[]>([])

    const addToPlayingGisCctvs = (cctv: Cctv) => {
        // setPlayingGisCctvs([...playingGisCctvs, cctv])
        if (playingGisCctvs.includes(cctv)) {
            return
        }
        setPlayingGisCctvs((playingGisCctvs: Cctv[]) => playingGisCctvs.length >= 4 ? [...playingGisCctvs.slice(playingGisCctvs.length - 3, playingGisCctvs.length), cctv] : [...playingGisCctvs, cctv])
    }
    const removeFromPlayingGisCctvs = (cctv: Cctv) => {
        setPlayingGisCctvs(playingGisCctvs.filter(playingGisCctv => playingGisCctv.mgrNo !== cctv.mgrNo))
    }

    const removeFromPlayingGisMobile = () => {
        setActiveMobile(null)
    }

    const newEventPositionIcon = new DivIcon({
        iconAnchor: [0, 0],
        html: ReactDOMServer.renderToString(<StyledNewEventLocationMarker/>)
    })


    return <MapContainer style={{width: '100%', height: '100%', position: 'static'}}
                         center={center} zoom={15} attributionControl={false}>

        <MapHandler center={DEFAULT_GPS} isShow={isShow} newCenterCoordinates={newCenterCoordinates}
                    isClick={changeEventCoordinate}/>
        {isShowBaseMapSelector ? <BaseMapSelector baseMap={baseMap} setBaseMap={setBaseMap} isShare={isShare}/> : null}
        <BaseMapLayer baseMap={baseMap} isShare={isShare}/>
        {changeEventCoordinate ?
            (isEventGenerator ? <CenterMarker center={[newEventLocation.lat, newEventLocation.lng] as LatLngExpression}/> :
                <Marker icon={newEventPositionIcon} position={[newEventLocation.lat, newEventLocation.lng] as LatLngExpression}/>) : null}
        {isShowRadar ? <RadarMarker center={center}/> : null}
        {isShowCenter ? <CenterMarker center={center}/> : null}
        {isShowCctvs ? <>
                {/*cctv cluster marker*/}
                <Pane name={'cctv'}>
                    <CctvMarker cluster={cluster} setCluster={setCluster}
                                isShowName={false} handleClusterClick={(cluster) =>
                        setSelectedCluster(cluster.propagatedFrom)}
                                selectedCctvs={selectedCctvs} setSelectedCctvs={setSelectedCctvs}
                                addPlayingGisCctv={addToPlayingGisCctvs}/>
                </Pane>
                {/*mobile cluster marker*/}
                {/*gis marker 클릭시 나타나는 cctv list */}
                <ClusterListPopup handleListItemClick={addToPlayingGisCctvs}
                                  selectedCluster={selectedCluster} setSelectedCluster={setSelectedCluster}
                                  selectedCctvs={selectedCctvs} setSelectedCctvs={setSelectedCctvs}/>
1
                {
                    // gis에서 재생되는 cctv
                    playingGisCctvs.map(playingGisCctv =>
                        <PlayerPopup key={`playingGisCctv_${playingGisCctv.mgrNo}`} playingGisCctv={playingGisCctv}
                                     removePlayingGisCctv={removeFromPlayingGisCctvs}/>)
                }</>
            : null}

        {isShowMobiles ?
            <>
                <Pane name={'mobileMarker'}>
                    {
                        mobileList && mobileList.map((mobile) =>
                            <MobileMarker mobile = {mobile}/>
                        )
                    }

                </Pane>
                {
                    activeMobile &&
                         <PlayerMobilePopup key = {`playingGisMobile_${activeMobile.id}`} playingGisMobile={activeMobile} removePlayingGisMobile={removeFromPlayingGisMobile} />
                }
            </>

            : ''
        }
    </MapContainer>
}

const StyledNewEventLocationMarker = styled.figure`
  width: 30vw;
  height: 30vw;
  position: absolute;
  left: calc(50% - 15vw);
  top: calc(50% - 15vw);
  display: flex;
  justify-content: center;
  align-items: center;

  background: url(${radarMarkerImage}) center no-repeat;
  background-size: 100% 100%;
`

Map.defaultProps = {
    isShare: false
}

export default Map