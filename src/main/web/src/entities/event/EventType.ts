export const createTemplateEvent = (index: number): Event => ({
    statEvetOutbSeqn: `${index}`,
    clientCd: '',
    siteCd: '',
    znCd: '',
    znNm: '',
    svcThemeCd: '',
    svcThemeNm: '',
    unitSvcCd: '',
    statEvetCd: '',
    evetGbCd: '',
    statEvetGdCd: '',
    statEvetNm: '',
    uSvcOutbId: '',
    outbDtm: '',
    outbPlac: '',
    procSt: '',
    statEvetCntn: '',
    x: '',
    y: '',
})

export interface Event {
    statEvetOutbSeqn: string
    clientCd: string
    siteCd: string
    znCd: string
    znNm: string
    svcThemeCd: string
    svcThemeNm: string
    unitSvcCd: string
    statEvetCd: string
    evetGbCd: string
    statEvetGdCd: string
    statEvetNm: string
    uSvcOutbId: string
    outbDtm: string
    outbPlac: string
    procSt: string
    statEvetCntn: string
    x: string
    y: string
}

export interface EventInfo{
    clientCd: string
    siteCd: string
    svcThemeCd: string
    unitSvcCd: string
    statEvetCd: string
    evetGbCd: string
    statEvetNm: string
    svcThemeNm: string
    evetGdCd: string
    evetGdNm: string
    evetId: string
    rowId: string
}

export interface IModCoordinate{
    statEvetOutbSeqn: string;
    x: string;
    y: string;
}
export interface IModCoordindateResponse{
    x: string;
    y: string;
    address: string;
}

export type EventSearchParam={
    searchType:string,
    from : string,
    to : string
}