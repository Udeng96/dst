//프록시 처리 필요 ...
import {LatLngExpression} from "leaflet";

// export const XEUS_WS_URL = 'ws://198.51.100.1:8080/xeus-gate/stream'
// export const XEUS_WS_URL = 'ws://198.51.100.2/xeus-gate/stream'
// export const XEUS_WS_URL = 'ws://' + window.location.host + '/xeus-gate/stream'


const domain = (window.location.host)

const isDEV = import.meta.env.DEV;
export const API_URL = isDEV ? `/dst` : `http://${domain}/dst`;

// export const XEUS_WS_URL = 'ws://' + '203.0.113.150' + '/xeus-gate/stream'
export const XEUS_WS_URL =`ws://${domain}/xeus-gate/stream`
//중심 좌표 -> 통영시청
export const DEFAULT_GPS: LatLngExpression = [37.19953720, 126.83147735]

//ms NOTE 만료시간 설정이됨 만료시간을 넘기면 데이터가 온전하게 표출이 안됨
export const DEFAULT_EXPIRE_TIME: number = 1000 * 60 * 60 * 3 * 10000

export const LOGIN_REDIRECT_URL = '/oms/login/goSysSelView'