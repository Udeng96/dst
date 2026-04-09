    import {xhr} from "@/shared/lib/xhrUtil";
    import {API_URL} from "@/shared/config/DstConstants";

export const getVideos = (disasterHistoryId?:string) => {
    return xhr.get(`${API_URL}/videos`+(disasterHistoryId?`?disasterHistoryId=${disasterHistoryId}`: '' ))
}