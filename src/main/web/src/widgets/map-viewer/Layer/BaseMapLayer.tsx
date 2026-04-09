import {TileLayer} from "react-leaflet";

interface IBaseMapLayer {
    baseMap: EBaseMap,
    isShare :boolean,
}

export enum EBaseMap {
    basic = 'basic',
    satellite = 'satellite'
}

const BaseMapLayer = ({baseMap,isShare = false}: IBaseMapLayer) => {
    const setUrl = ()=>{

        let mapBaseUrl = "http://xdworld.vworld.kr:8080/2d" // 외부 개발환경
        let domain = window.location.host
        const isProduction = process.env.NODE_ENV === 'production';
        //Todo - dev
        // const isProduction = false;

        if (isProduction){
            // mapBaseUrl ='http://40.10.10.52/proxy?https://xdworld.vworld.kr/2d';
            mapBaseUrl ='/proxy?https://xdworld.vworld.kr/2d'; // 실제 운영환경
            // mapBaseUrl ='http://xdworld.vworld.kr:8080/2d'; // 개발운영환경
            if (isShare){
                // mapBaseUrl = 'http://xdworld.vworld.kr/2d';
                mapBaseUrl =`https://xdworld.vworld.kr/2d`; // 실제 운영환경

            }
        }

        if (window.location.host.includes("40.10.10.52")){
            // mapBaseUrl ='http://40.10.10.52/proxy?https://xdworld.vworld.kr/2d'; // 실제 운영환경
            mapBaseUrl ='/proxy?https://xdworld.vworld.kr/2d'; // 실제 운영환경
        }

        return mapBaseUrl
    }


    return baseMap === EBaseMap.basic ?
        <TileLayer key={'2d'} url={setUrl()+'/Base/service/{z}/{x}/{y}.png'}/> :
        // <TileLayer key={'2d'} url={'http://40.10.10.52/proxy?http://' + mapBaseUrl + '/Base/service/{z}/{x}/{y}.png'}/> :
        <>
             <TileLayer key={'satellite'} url={setUrl()+'/Satellite/service/{z}/{x}/{y}.jpeg'}/>
             <TileLayer key={'label'} url={setUrl()+ '/Hybrid/service/{z}/{x}/{y}.png'}/>
         </>

    //개발 모드
    // return baseMap === EBaseMap.basic ?
    //     <TileLayer key={'2d'} url={'http://xdworld.vworld.kr:8080/2d/Base/service/{z}/{x}/{y}.png'}/> :
    //     <>
    //        <TileLayer key={'satellite'} url={'http://xdworld.vworld.kr:8080/2d/Satellite/service/{z}/{x}/{y}.jpeg'}/>
    //         <TileLayer key={'label'} url={'http://xdworld.vworld.kr:8080/2d/Hybrid/service/{z}/{x}/{y}.png'}/>
    //     </>

}

export default BaseMapLayer