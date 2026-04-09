//프록시 처리 필요 ...
import {LatLngExpression} from "leaflet";

// export const XEUS_WS_URL = 'ws://172.22.10.149:8080/xeus-gate/stream'
// export const XEUS_WS_URL = 'ws://172.30.199.102/xeus-gate/stream'
// export const XEUS_WS_URL = 'ws://' + window.location.host + '/xeus-gate/stream'


const domain = (window.location.host)

const isDEV = process.env.NODE_ENV !== 'production';
//todo - dev
// export const API_URL = `http://localhost:22223/dst`;
export const API_URL = `http://${domain}/dst`; // 실서버

// export const XEUS_WS_URL = 'ws://' + '40.10.10.52' + '/xeus-gate/stream'
export const XEUS_WS_URL =`ws://${domain}/xeus-gate/stream`
//중심 좌표 -> 통영시청
export const DEFAULT_GPS: LatLngExpression = [37.19953720, 126.83147735]

//ms NOTE 만료시간 설정이됨 만료시간을 넘기면 데이터가 온전하게 표출이 안됨
export const DEFAULT_EXPIRE_TIME: number = 1000 * 60 * 60 * 3 * 10000