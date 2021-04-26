import { LatLng } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet'
import Path from '../models/Path';
import Position, { PositionToLatLang } from '../models/Position';
import { useAppSelector } from '../state/hooks';
import { selectTravel } from '../state/TravelSlice';
import { ConnectionStatus, selectWatchedPosition } from '../state/WatchPositionSlice';
import { CLOSE_VIEW_ZOOM, WORLD_CENTER_VIEW_LOCATION } from '../utill/MapsLocations';
import ChangePosition from './ChangePosition';
import ColoredMarker, { MarkerColor } from './ColoredMarker';
import PathMarker, { PathProgress } from './PathMarker';

export enum MapMode { none, follow, track }

interface TrackingMapProps extends React.HTMLProps<HTMLElement> {
    mode?: MapMode;
    current_position?: Position;
    path?: Path;
    status?: PathProgress;
}

export function TrackingMap({mode = MapMode.none, current_position, path, status, style} : TrackingMapProps) {
    
    let position : LatLng | undefined, 
        zoom : number | undefined,
        content

    if(mode === MapMode.none) {
        position = new LatLng(WORLD_CENTER_VIEW_LOCATION.latitude, WORLD_CENTER_VIEW_LOCATION.longitude)
        zoom = WORLD_CENTER_VIEW_LOCATION.zoom
    }

    if(mode === MapMode.follow) {
        position = PositionToLatLang(current_position)
        zoom = CLOSE_VIEW_ZOOM
        content = (
            <>
                <ColoredMarker location={position} color={MarkerColor.RED}  />
                <ChangePosition center={position} zoom={CLOSE_VIEW_ZOOM} />
            </>
        )
    }

    if(mode === MapMode.track) {
        if(!path || path.length < 1) {
            position = new LatLng(WORLD_CENTER_VIEW_LOCATION.latitude, WORLD_CENTER_VIEW_LOCATION.longitude)
            zoom = WORLD_CENTER_VIEW_LOCATION.zoom    
        } else {
            position = PositionToLatLang(path[path.length-1])
            zoom = CLOSE_VIEW_ZOOM
        }
        content = (
            <>
                <PathMarker path={path} status={status}/>
                { status !== PathProgress.progress  || <ChangePosition center={position} zoom={CLOSE_VIEW_ZOOM} /> }
            </>
        )
    }
    return (
        <MapContainer center={position} zoom={zoom} style={style} >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {content}
        </MapContainer>
    );
}

interface TrackingMapViewerProps extends React.HTMLProps<HTMLElement> {
    isTracking: Boolean,
    hasTrack: Boolean
}

export default function TrackingMapViewer({isTracking, hasTrack, style} : TrackingMapViewerProps) {

    const [currentWatchingPosition, watchingStatus] = useAppSelector(selectWatchedPosition)
      
    const travel = useAppSelector(selectTravel)

    let mapMode = undefined, mapPath = undefined, mapCurrentPosition = undefined, mapStatus = undefined

    if(isTracking) {
        mapMode = MapMode.track
        mapStatus = PathProgress.progress
        mapPath = travel.path
    } else if(hasTrack) {
        mapMode = MapMode.track
        mapStatus = PathProgress.done
        mapPath = travel.path
    } else {
        if(watchingStatus === ConnectionStatus.active) {
            mapMode = MapMode.follow
            mapCurrentPosition = currentWatchingPosition
        } else {
            mapMode = MapMode.none
        }
    }

    return <TrackingMap style={style} mode={mapMode} current_position={mapCurrentPosition} path={mapPath} status={mapStatus} />
}