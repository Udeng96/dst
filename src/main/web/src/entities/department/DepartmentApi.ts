import {xhr} from "@/shared/lib/xhrUtil";
import {API_URL} from "@/shared/config/DstConstants";


export const getDepartments = () => {
    return xhr.get(`${API_URL}/departments`)
}