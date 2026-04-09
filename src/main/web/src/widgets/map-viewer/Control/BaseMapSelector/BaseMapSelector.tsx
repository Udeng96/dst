import styled from "styled-components";
import {EBaseMap} from "../../Layer/BaseMapLayer";

const POSITIONS = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
} as {
    [key: string]: string
}

interface IBaseMapSelector {
    position?: string
    baseMap: EBaseMap
    setBaseMap: Function
    isShare : boolean
}

const BaseMapSelector = ({baseMap, setBaseMap, position = 'topright',isShare}: IBaseMapSelector) => {
    const positionClass = (position && POSITIONS[position]) || POSITIONS.topright
    return <StyledMapSelectorButtonGroup className={positionClass} isShare={isShare}>
        <StyledMapSelectorButton isShare={isShare}
            onClick={() => setBaseMap(EBaseMap.basic)} isActive={baseMap === EBaseMap.basic}>일반지도</StyledMapSelectorButton>
        <StyledMapSelectorButton isShare={isShare}

            onClick={() => setBaseMap(EBaseMap.satellite)} isActive={baseMap === EBaseMap.satellite}>스카이뷰</StyledMapSelectorButton>
    </StyledMapSelectorButtonGroup>
}

const StyledMapSelectorButton = styled.div<{
    isActive: boolean,
    isShare : boolean,
}>`
  width: 4vw;
  height: 2.9vh;
  cursor: pointer;
  font-size: ${({isShare})=>isShare?'1.6vw':'0.625vw'};
  letter-spacing: -0.03125vw;
  border-radius: 0.26vw;
  text-align: center;
  color: ${({isActive}) => isActive ? '#ffffff' : '#7e8189'};
  background-color: ${({isActive}) => isActive ? '#7e4cff' : 'transparent'};
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;

  &:hover {
    color: ${({isActive}) => isActive ? '#ffffff' : '#7e4cff'};
  }
`

const StyledMapSelectorButtonGroup = styled.div<{isShare:boolean}>`
  margin: 10px;
  width: ${({isShare})=>isShare? '9.5vw': '7.5vw'};
  height: 3vh;
  max-height: 36px;
  padding: 2px;
  border-radius: 0.35vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: solid 1px #13181e;
  background-color: #222327;
  //z-index: -1;
`

export default BaseMapSelector