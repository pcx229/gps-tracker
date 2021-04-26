import { GeolibInputCoordinatesWithTime } from "geolib/es/types"
import { LatLng } from "leaflet"

export default interface Position {
    readonly latitude: number;
    readonly longitude: number;
    readonly altitude?: number;
    readonly time: number;
}

export function comparePosition(a: Position, b: Position) {
    return a.latitude === b.latitude &&
            a.longitude === b.longitude &&
            a.altitude === b.altitude &&
            a.time === b.time
}

export function PositionToSpeedPositionFormat(position: Position) : GeolibInputCoordinatesWithTime {
    return {
        latitude: position.latitude,
        longitude: position.longitude,
        time: position.time
    }
}

export function PositionToLatLang(position?: Position) : LatLng | undefined {
  if(!position)
    return undefined
  return new LatLng(position.latitude, position.longitude, position.altitude)
}

export function GeolocationPositionToPosition(position : GeolocationPosition) : Position {
    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude ?? undefined,
        time: position.timestamp
    } 
}