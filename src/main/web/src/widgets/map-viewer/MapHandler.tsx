import {useMap} from "react-leaflet";
import {useEffect} from "react";
import {LatLng, LatLngExpression, LeafletEvent} from "leaflet";
import useEventStore from '@/entities/event/useEventStore';

interface IMapControl {
    isShow: boolean,
    center: LatLngExpression,
    newCenterCoordinates: number[],
    isClick?: boolean,
    // setNewEventLocation?
}

const MapHandler = ({isShow, center, newCenterCoordinates, isClick}: IMapControl) => {
    const { setNewEventLocation } = useEventStore()
    const map = useMap()

    useEffect(() => {
        if(isClick){
            map.on('click', (evt) => {
                const latlng = evt['latlng']
                setNewEventLocation({ lat: latlng.lat, lng: latlng.lng })
            });
        }
        else{
            map.off('click', (evt) => {
            });
        }
        return () => {
            map.off('click')
        }
    }, [isClick]);


    useEffect(() => {
        map.invalidateSize()
    }, [isShow])

    // 클릭하면 중심으로 이동
    useEffect(() => {
        !isClick && map.panTo(center)
    }, [center])


    useEffect(() => {
        if(Array.isArray(newCenterCoordinates) && newCenterCoordinates.length >= 2){
            const lat = Number(newCenterCoordinates[1])
            const lng = Number(newCenterCoordinates[0])
            if(!isNaN(lat) && !isNaN(lng)){
                map.panTo([lat, lng]);
            }
        }
    },[newCenterCoordinates])

    return null
}

export default MapHandler