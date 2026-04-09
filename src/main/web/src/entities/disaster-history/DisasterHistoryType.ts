
export enum EDisasterHistory {
    transfer,
    share,
    sms,
    report
}

export const getDisasterHistoryTypeName = (disasterHistoryType: EDisasterHistory) =>
    disasterHistoryType === EDisasterHistory.transfer ? '전파' :
        disasterHistoryType === EDisasterHistory.share ? '공유' :
            disasterHistoryType === EDisasterHistory.sms ? 'SMS' :
                disasterHistoryType === EDisasterHistory.report ? '보고서' : null


//cctv version
// export const createTemplateDisasterHistory = (index: number): DisasterHistory => ({
//     disasterHistoryId: `${index}`,
//     title: '',
//     content: '',
//     transferTarget: '',
//     statEvetOutbSeqn: '',
//     type: EDisasterHistory.transfer,
//     regDate: '',
//     regUserId: '',
//     disasterHistoryCctvMappings: [],
//     disasterHistoryFileMappings: [],
// })


// video version
export const createTemplateDisasterHistory = (index: number): DisasterHistory => ({
    disasterHistoryId: `${index}`,
    title: '',
    content: '',
    transferTarget: '',
    pwd : '',
    statEvetOutbSeqn: '',
    type: EDisasterHistory.transfer,
    regDate: '',
    regUserId: '',
    expireDtm: '',
    disasterHistoryVideoMappings: [],
    disasterHistoryFileMappings: [],
})

//cctv version
// export interface DisasterHistory extends Record<string, any> {
//     disasterHistoryId: string,
//     title: string,
//     content: string,
//     transferTarget: string,
//     statEvetOutbSeqn: string,
//     type: EDisasterHistory | null,
//     regDate: string,
//     regUserId: string,
//
//     disasterHistoryCctvMappings: DisasterHistoryCctvMapping[],
//     disasterHistoryFileMappings: DisasterHistoryFileMapping[],
// }


//video version
export interface DisasterHistory extends Record<string, any> {
    disasterHistoryId: string,
    title: string,
    content: string,
    pwd : string,
    transferTarget: string,
    statEvetOutbSeqn: string,
    type: EDisasterHistory | null,
    regDate: string,
    regUserId: string,
    expireDtm: string,

    disasterHistoryVideoMappings: DisasterHistoryVideoMapping[],
    disasterHistoryFileMappings: DisasterHistoryFileMapping[],
}


//cctv version
export interface DisasterHistoryCctvMapping {
    disasterHistoryCctvMappingId: string,
    disasterHistoryId: string,
    cctvId: string,
    index: number
}


//video version
export interface DisasterHistoryVideoMapping{
    disasterHistoryVideoMappingId : string,
    disasterHistoryId: string,
    type : string,
    id : string,
    url : string,
    index : number
}

export interface DisasterHistoryFileMapping {
    disasterHistoryFileMappingId: string,
    disasterHistoryId: string,
    fileLocation: string,
    fileName: string,
    file: File,
}

export interface Receiver {
    name: string,
    mobile: string,
}

