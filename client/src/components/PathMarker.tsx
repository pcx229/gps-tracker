import { Polyline } from "react-leaflet";
import Path, { PathToLatLngExpression } from "../models/Path";
import { PositionToLatLang } from "../models/Position";
import ColoredMarker, { MarkerColor } from "./ColoredMarker";

export enum PathProgress { none, start, wait, progress, done }

export enum PathColors { black = "black", red = "red", yellow = "yellow", blue = "blue", green = "green", grey = "grey" }

export type PathColorMask = Array<PathColors>

interface PathMarkerProps {
    path?: Path;
    status?: PathProgress;
    path_colors?: PathColorMask;
    path_color?: PathColors;
    showMarkers?: Boolean;
}

export default function PathMarker({path, status = PathProgress.none, path_colors, path_color = PathColors.blue, showMarkers = true} : PathMarkerProps) {
    
    if(!path || path.length === 0)
        return null

    if(status === PathProgress.none)
        return null

    if(status === PathProgress.start)
        return <ColoredMarker location={PositionToLatLang(path[0])} color={MarkerColor.RED} />
    
    // path
    let pathComponent = null
    if(path_colors) {
        pathComponent = path.map(
            (value, index) => {
                if(index % 2 === 0)
                    return null
                return <Polyline positions={[PositionToLatLang(value)!, PositionToLatLang(path[index-1])!]} color={path_colors[index/2]} />
            }
        ).filter((value) => value !== null)
    } else {
        pathComponent = <Polyline positions={PathToLatLngExpression(path)} color={path_color}  />
    }

    // end marker color
    let endMarkerColor : MarkerColor = MarkerColor.BLUE
    if(status === PathProgress.wait)
        endMarkerColor = MarkerColor.PURPLE
    else if(status === PathProgress.done)
        endMarkerColor = MarkerColor.RED

    return (
        <>
            { showMarkers ? <ColoredMarker location={PositionToLatLang(path[0])} color={MarkerColor.GREEN} /> : undefined }
            { pathComponent }
            { showMarkers ? <ColoredMarker location={PositionToLatLang(path[path.length-1])} color={endMarkerColor} /> : undefined }
        </>
    )
}