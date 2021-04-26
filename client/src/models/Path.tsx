import { LatLng } from "leaflet"
import Position, { PositionToLatLang } from "./Position"

type Path = Position[]

export default Path

export function PathToLatLngExpression(path : Path) : Array<LatLng> {
    return path.map(p => PositionToLatLang(p)!)
}