import styled from "styled-components";
import {DivIcon, LatLngExpression} from "leaflet";
import ReactDOMServer from "react-dom/server";
import centerMarkerImage from "./icon_event_location.png"
import {Marker} from "react-leaflet";

interface ICenterMarker {
    center: LatLngExpression
}

const CenterMarker = ({center}: ICenterMarker) => {

    const icon = new DivIcon({
        iconAnchor: [12, 36],
        html: ReactDOMServer.renderToString(<StyledCenterMarker/>)
    })

    return <Marker icon={icon} position={center}/>
}

const StyledCenterMarker = styled.figure`
  width: 36px;
  height: 46px;
  background: url(${centerMarkerImage}) center no-repeat;
  background-size: 100% 100%;
  margin-bottom: 36px;
`


export default CenterMarker