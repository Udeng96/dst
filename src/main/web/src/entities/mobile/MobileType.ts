export interface Mobile {
    id : string,
    seq : number,
    userId : string,
    userNm : string,
    userDept : string,
    userDtm : string,
    lat: number,
    lng : number,
    mbChk : number, // 2: 촬영 시작, 3: 촬영 중 4:촬영 종료
    mbUrl : string // rtsp
    type : string
}



