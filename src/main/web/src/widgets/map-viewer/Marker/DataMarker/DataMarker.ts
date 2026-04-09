import {LatLngExpression, Marker, MarkerOptions} from "leaflet";

interface DataMarkerOptions<T> extends MarkerOptions {
    data?: T
}

export class DataMarker<T = any, P = any> extends Marker {
    constructor(latlng: LatLngExpression, options?: DataMarkerOptions<T>) {
        super(latlng, options)
        this.options = options
    }

    declare options: DataMarkerOptions<T>
}