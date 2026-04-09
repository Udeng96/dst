import {DisasterHistory, DisasterHistoryFileMapping, DisasterHistoryVideoMapping} from "./DisasterHistoryType";
import {xhr} from "@/shared/lib/xhrUtil";
import {API_URL} from "@/shared/config/DstConstants";

export const getDisasterHistories = (statEvetOutbSeqn: string) => xhr.get(`${API_URL}/disasterHistories?statEvetOutbSeqn=${statEvetOutbSeqn}`)

export const saveDisasterHistory = (disasterHistory: DisasterHistory) => {
    return xhr.post(`${API_URL}/disasterHistories`, disasterHistory)
}

export const chkPwd = (disasterHistoryId: string, pwd: string) => xhr.get(`${API_URL}/disasterHistories/chkPwd`, {params: {disasterHistoryId : disasterHistoryId, pwd : pwd}})

export const getDisasterHistory = (disasterHistoryId: string) => xhr.get(`${API_URL}/disasterHistories/${disasterHistoryId}`)

export const deleteDisasterHistory = (disasterHistoryId: string) => xhr.delete(`${API_URL}/disasterHistories/${disasterHistoryId}`)

export const getDisasterHistoryFileMapping = (disasterHistoryId: string) => xhr.get(`${API_URL}/disasterHistories/${disasterHistoryId}/file`)

export const saveDisasterHistoryFileMappings = (disasterHistoryId: string, disasterHistoryFileMappings: DisasterHistoryFileMapping[]) => {
    const formData = new FormData()
    formData.set("disasterHistoryId", disasterHistoryId)

    if (disasterHistoryFileMappings) {
        for (let i = 0; i < disasterHistoryFileMappings.length; i++) {
            formData.append("files", disasterHistoryFileMappings[i].file)
        }
    }

    return xhr.post(`/dst/disasterHistories/${disasterHistoryId}/file`, formData)
}

export const deleteDisasterHistoryFileMapping = (disasterHistoryId: string) => xhr.delete(`${API_URL}/disasterHistories/${disasterHistoryId}/file`)

//video version

export const getDisasterHistoryVideoMappings = (disasterHistoryId: string) => xhr.get(`${API_URL}/disasterHistories/${disasterHistoryId}/videos`)

export const saveDisasterHistoryVideoMappings = (disasterHistoryId:string, videoMappings : DisasterHistoryVideoMapping[])=>{
    return xhr.post(`${API_URL}/disasterHistories/${disasterHistoryId}/videos`,videoMappings)
}

export const deleteDisasterHistoryVideoMapping = (disasterHistoryId : string) => xhr.delete(`${API_URL}/disasterHistories/${disasterHistoryId}/video`)