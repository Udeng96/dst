import {DivIcon, LatLngExpression} from "leaflet";
import ReactDOMServer from "react-dom/server";
import {Marker} from "react-leaflet";
import styled from "styled-components";
import radarMarkerImage from "./img_gis_circles_event.png"

interface IRadarMarker {
    center: LatLngExpression
}

const RadarMarker = ({center}: IRadarMarker) => {
    const icon = new DivIcon({
        iconAnchor: [0, 0],
        html: ReactDOMServer.renderToString(<StyledRadarMarker/>)
    })

    return <Marker icon={icon} position={center}/>
}


const StyledRadarMarker = styled.figure`
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

export default RadarMarker