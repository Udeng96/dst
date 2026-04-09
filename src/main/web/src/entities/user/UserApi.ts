import {xhr} from "@/shared/lib/xhrUtil";
import {API_URL} from "@/shared/config/DstConstants";


export const getUsers = () => {
    return xhr.get(`${API_URL}/users`)
}

export const getCurrentUser = () => {
    return xhr.get(`${API_URL}/users/current`)
}