import {xhr} from "@/shared/lib/xhrUtil";
import {EventSearchParam} from "./EventType";
import {API_URL} from "@/shared/config/DstConstants";


export const getEvents = (param?:EventSearchParam) => {

    if (param){
        return xhr.get(`${API_URL}/events?searchType=${param.searchType}&from=${param.from}&to=${param.to}`)
    }else {
        return xhr.get(`${API_URL}/events`)
    }

}

export const getEvent = (statEvetOutbSeqn:string) => {
    return xhr.get(`${API_URL}/events/${statEvetOutbSeqn}`)
}

export const finishEventById = (statEvetOutSeqn: string) => {
    return xhr.post(`${API_URL}/events/${statEvetOutSeqn}/finish`)
}

export const getEventTypes = () => {
    return xhr.get(`${API_URL}/events/types`)
}

export const getEventAllInfo = () => {
    return xhr.get(`${API_URL}/events/getEventAllInfo`)
}