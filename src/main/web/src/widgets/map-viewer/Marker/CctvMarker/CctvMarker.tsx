import ReactDOMServer from "react-dom/server";
import {ClusterClickHandlerFn, divIcon, MarkerCluster, MarkerClusterGroup, point} from "leaflet";
import "leaflet.markercluster";
import styled from "styled-components";
import {useCallback, useEffect} from "react";
import {useMap} from "react-leaflet";
import {CctvData, ECctv} from "./CctvData";
import useCctvStore from '@/entities/cctv/useCctvStore';
import {Cctv} from '@/entities/cctv/CctvType';
import {DataMarker} from "../DataMarker/DataMarker";


interface ICctvMarker {
    cluster: MarkerClusterGroup,
    setCluster: (cluster: MarkerClusterGroup) => void,

    //지도 상 관리번호 표출 여부
    isShowName: boolean,
    handleClusterClick: ClusterClickHandlerFn,

    selectedCctvs: Cctv[],
    setSelectedCctvs: (cctvs: Cctv[]) => void,
    addPlayingGisCctv: (cctv: Cctv) => void
}


//각 CCTV 관리번호 처리 // cctv 관리번호는 어린이보호014(2).주소 형식처럼 되어 있어서 (.)이전으로 처리함 (.)이 없는 것은 그대로 반환
const getShortCctvName = (cctvName: string): string => {
    return cctvName.indexOf('.') !== -1 ?
        cctvName.substr(0, cctvName.indexOf('.')) : cctvName
}

const getCctvMarkerIcon = (cctv: Cctv, isSelected: boolean, isShowName: boolean) => {
    const cctvData = CctvData[cctv.gbnCd] ? CctvData[cctv.gbnCd] : CctvData[ECctv.cctv]
    const cctvName = getShortCctvName(cctv.cctvNm)
    const html = ReactDOMServer.renderToString(
        <StyledCctvMarkerIcon isSelected={isSelected}
                              normalIcon={cctvData.normalIcon} hoverIcon={cctvData.hoverIcon}
                              activeNormalIcon={cctvData.activeNormalIcon} activeHoverIcon={cctvData.activeHoverIcon}>
            {isShowName && <StyledCctvName>{cctvName}</StyledCctvName>}
        </StyledCctvMarkerIcon>
    )
    return divIcon({
        html: html,
        iconSize: point(49, 53, true),
        iconAnchor: [21, 43],
    })
}

const getCctvMarkerClusterIcon = (cluster: MarkerCluster<Cctv>, selectedCctvs: Cctv[], isShowName: boolean) => {
    const clusterData = CctvData[ECctv.cluster]
    const markers = cluster.getAllChildMarkers()
    const cctvs = markers.map(marker => marker.options.data)

    const filteredCctvs = cctvs.filter(cctv => selectedCctvs && selectedCctvs.some(selectedCctv => cctv.mgrNo === selectedCctv.mgrNo))
    const isSelected = filteredCctvs.length > 0

    const html = ReactDOMServer.renderToString(
        <StyledCctvMarkerClusterIcon
            isSelected={isSelected}
            normalIcon={clusterData.normalIcon} hoverIcon={clusterData.hoverIcon}
            activeNormalIcon={clusterData.activeNormalIcon} activeHoverIcon={clusterData.activeHoverIcon}>
            <StyledClusterCount>{cctvs.length}</StyledClusterCount>
            {isShowName &&
            <StyledCctvName>
                {cctvs.slice(0, cctvs.length > 3 ? 3 : cctvs.length).map(cctv => getShortCctvName(cctv.cctvNm) + '<br/>')}
            </StyledCctvName>}
        </StyledCctvMarkerClusterIcon>
    )
    return divIcon({
        html: html,
        iconSize: point(46, 46, true),
    })
}

const CctvMarker = ({
                        cluster, setCluster, isShowName, selectedCctvs,
                        setSelectedCctvs, handleClusterClick, addPlayingGisCctv
                    }: ICctvMarker) => {
    const map = useMap()
    const cctvs = useCctvStore((s) => s.cctvs)

    const getCctvMarkerClusterIconCallback =
        useCallback((cluster: MarkerCluster<Cctv>) =>
            getCctvMarkerClusterIcon(cluster, selectedCctvs, isShowName), [selectedCctvs, isShowName])

    useEffect(() => {
        const markerClusterGroup = new MarkerClusterGroup({
            iconCreateFunction: getCctvMarkerClusterIconCallback,
            maxClusterRadius: 60,
            zoomToBoundsOnClick: false,
            clusterPane: 'cctv',
            pane: 'cctv',
            animate: true,
            removeOutsideVisibleBounds: true,
            spiderfyOnMaxZoom: false,
        })

        setCluster(markerClusterGroup)

    }, [])

    useEffect(() => {
        if (cluster) {
            cluster.on('clusterclick', handleClusterClick)
            cluster.options.iconCreateFunction = getCctvMarkerClusterIconCallback
            cluster.addTo(map)
            setCluster(cluster)
        }

        return () => {
            if (cluster) {
                cluster.off('clusterclick', handleClusterClick)
                cluster.removeFrom(map)
            }
        }
    }, [cluster, isShowName])

    useEffect(() => {

        if (cctvs && cluster) {
            const markers = cctvs.map(cctv => {

                const marker = new DataMarker<Cctv>([cctv.y, cctv.x], {
                    icon: getCctvMarkerIcon(cctv,
                        selectedCctvs && selectedCctvs.find(selectedCctv => selectedCctv.mgrNo === cctv.mgrNo) !== undefined, isShowName),
                    pane: 'cctv',
                    data: cctv,
                    interactive: true,
                    draggable: false,

                })

                marker.on('click', _ => {
                    map.setView([cctv.y, cctv.x], map.getMaxZoom() - 3, {
                        animate: true
                    })
                    addPlayingGisCctv(cctv)
                })
                return marker
            })

            cluster.addLayers(markers)
        }

        return () => {
            cluster && cluster.clearLayers()
        }
    }, [cluster, cctvs, selectedCctvs, isShowName])

    return null
}

interface ICctvMarkerIcon {
    isSelected: boolean,
    normalIcon: string,
    hoverIcon: string,
    activeNormalIcon: string,
    activeHoverIcon: string,
}

const StyledCctvName = styled.div`
  width: auto;
  font-size: 0.6vw;
  letter-spacing: -0.1vw;
  font-weight: 400;
  color: #FFFFFF;
  text-shadow: -0.07vw 0 #000000, 0 0.07vw #000000, 0.07vw 0 #000000, 0 -0.07vw #000000;
  position: absolute;
  top: 43px;

  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
`

const StyledCctvMarkerIcon = styled.div<ICctvMarkerIcon>`
  width: 49px;
  height: 53px;
  position: relative;
  background: url(${({normalIcon}) => normalIcon});
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: url(${({hoverIcon}) => hoverIcon});
    background-size: 100% 100%;
  }
`

const StyledCctvMarkerClusterIcon = styled.div<ICctvMarkerIcon>`
  width: 46px;
  height: 46px;
  position: relative;

  background: url(${({normalIcon}) => normalIcon}) no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: url(${({hoverIcon}) => hoverIcon}) no-repeat;
    background-size: 100% 100%;
  }
`

const StyledClusterCount = styled.small`
  min-width: 22px;
  height: 22px;
  border: solid 1px #EE87C5;
  background-color: #FA00B5;
  font-size: 0.5vw;
  letter-spacing: -0.02vw;
  color: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: -7px;
  right: -7px;

  display: flex;
  justify-content: center;
  align-items: center;
`

export default CctvMarker