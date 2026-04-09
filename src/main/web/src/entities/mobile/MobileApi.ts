import {xhr} from "@/shared/lib/xhrUtil";
import {API_URL} from "@/shared/config/DstConstants";

export const getLiveMobiles = () => {
    return xhr.get(`${API_URL}/mobile/live`)
}

export const getAllMobiles = () => {
    return xhr.get(`${API_URL}/mobile/all`)
}