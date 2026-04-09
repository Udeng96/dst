import {xhr} from "@/shared/lib/xhrUtil";
import {API_URL} from "@/shared/config/DstConstants";


export const getGroups = () => {
    return xhr.get(`${API_URL}/groups`)
}