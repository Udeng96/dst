import {useMap} from "react-leaflet";
import L, {Browser, LeafletMouseEvent, MarkerOptions} from "leaflet"
import {Mobile} from '@/entities/mobile/MobileType';

interface MobileMarkerOptions extends MarkerOptions {
    mobileData?: Mobile;
    active?: boolean;
}
import ReactDOMServer from "react-dom/server";
import {useEffect, useState} from "react";

import "../MobileMarker/mobileMarker.css"
import useMobileStore from '@/entities/mobile/useMobileStore';


const MobileMarker = (props : {mobile : Mobile}) => {

    const activeMobile = useMobileStore((s) => s.activeMobile)
    const { setActiveMobile } = useMobileStore()
    const [isMobileOn, setIsMobileOn] = useState<boolean>(false);
    const map = useMap();

    useEffect(()=>{

        if(activeMobile?.id === props.mobile?.id){
            setIsMobileOn(true)
        }else{
            setIsMobileOn(false)
        }

    },[activeMobile])

    useEffect(()=>{

        let marker = makeMarker(props.mobile, isMobileOn)
        map.addLayer(marker)

    },[isMobileOn])

    const makeMarker = (mobile: Mobile, isActive : boolean) => {
        const mobileMarker = L.marker([mobile.lat, mobile.lng], {
            icon : renderIcon(mobile, isActive),
            pane : 'mobileMarker',
            mobileData : mobile,
            active : false,
        } as MobileMarkerOptions)

        mobileMarker.off('click',(e)=>markerClick(e))
        mobileMarker.on('click',(e) => markerClick(e))

        return mobileMarker
    }

    const renderIcon = (info : Mobile, isActive:boolean) => {
        return L.divIcon({
            className : 'mobile-custom-icon',
            html : ReactDOMServer.renderToString(
                <div className = {`mobile_icon type_live_video ${(isActive) ? 'active' : ''} ${info?.id} `}/>
            ),
            iconAnchor : [ 30, 30 ]
        })
    }

    const markerClick = (e: LeafletMouseEvent) => {
        const info = (e.target.options as MobileMarkerOptions).mobileData

        if(activeMobile?.id=== info?.id){
            setActiveMobile(null)
        }else{
            setActiveMobile(info)
        }
    }

    return null
}



export default MobileMarker