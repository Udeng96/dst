export interface Video{

    id : string, // mobile : id & cctv : deviceId,
    nm : string, // mobile : userDept-userNm & cctv : cctvNm(주소 명칭)
    type : string // mobile : mobile & cctv : clftNm
    url : string // mobile : mbUrl & cctv : mgrNo
    lat : number
    lng : number,

}


