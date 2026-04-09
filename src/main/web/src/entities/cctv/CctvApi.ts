import {xhr} from "@/shared/lib/xhrUtil";
import {API_URL} from "@/shared/config/DstConstants";

export const getCctvs = (disasterHistoryId?: string) => {
    return xhr.get(`${API_URL}/cctvs` + (disasterHistoryId?`?disasterHistoryId=${disasterHistoryId}`:''))
}