import { Box, Container, LinearProgress, Slider, TextField, Typography } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useParams } from "react-router"
import LiveMetricsStatus from "../components/LiveMetricsStatus"
import PathMarker, { PathColors, PathProgress } from "../components/PathMarker"
import Path from "../models/Path"
import { useAppDispatch } from "../state/hooks"
import { fetchFromHistory, fetchFromShare, selectTravelView } from "../state/TravelViewSlice"
import { pathAvgSpeed, pathCompass, pathDistance, pathTime, splitPathByDistance, splitPathByTime } from "../utill/PathDecomposer"
import MomentUtils from '@date-io/moment'
import { MapContainer, TileLayer } from "react-leaflet"
import { PositionToLatLang } from "../models/Position"
import ChangePosition from "../components/ChangePosition"
import { CLOSE_VIEW_ZOOM, WORLD_CENTER_VIEW_LOCATION } from "../utill/MapsLocations"
import { LatLng } from "leaflet"

export default function Item() {

    const { path, loading, error } = useSelector(selectTravelView)
    const dispatch = useAppDispatch()

    const { id, hash } = useParams<{id?: string | undefined, hash?: string | undefined}>()

    const [pathInRange, setPathInRange] = useState<Path | undefined>(undefined)
    const [distanceRange, setDistanceRange] = useState<number[]>([0, 0])
    const [atDistance, setAtDistance] = useState<number[]>([0, 0])
    const [timeRange, setTimeRange] = useState<number[]>([0, 0])
    const [atTime, setAtTime] = useState<number[]>([0, 0])

    const [speed, setSpeed] = useState<number | undefined>(undefined)
    const [distance, setDistance] = useState<number | undefined>(undefined)
    const [compass, setCompass] = useState<{direction: string, greatCircleBearing: number} | undefined>(undefined)
    const [time, setTime] = useState<number | undefined>(undefined)
    
    const { pathname } = useLocation();

    useEffect(() => {
        if(id) 
            dispatch<any>(fetchFromHistory(id))
        else if(hash)
            dispatch<any>(fetchFromShare(hash))
    }, [dispatch, id, hash])
    
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        if(pathInRange) {
            setSpeed(pathAvgSpeed(pathInRange))
            setDistance(pathDistance(pathInRange))
            setTime(pathTime(pathInRange))
            setCompass(pathCompass(pathInRange))
        }
    }, [pathInRange])

    useEffect(() => {
        if(path && path.length > 0) {
            const total_distance = [0, pathDistance(path)]
            const total_time = [path[0].time, path[path.length-1].time]
            setDistanceRange(total_distance)
            setTimeRange(total_time)
            setAtDistance(total_distance)
            setAtTime(total_time)
            setPathInRange(path)
        }
    }, [path])

    const updateByTime = (start: number, end: number) => {
        let split = splitPathByTime(path, start, end)
        setPathInRange(split)
        let before_distance = pathDistance(splitPathByTime(path, path[0].time, start)),
            after_distance = pathDistance(split)
        setAtDistance([before_distance, before_distance + after_distance])
    }

    const updateByDistance = (start: number, end: number) => {
        let split = splitPathByDistance(path, start, end)
        setPathInRange(split)
        setAtTime([split[0].time, split[split.length-1].time])
    }

    const changeTimeRange = (event: any, newValue: number | number[]) => {
        const [start, end] = newValue as number[]
        setAtTime([start, end])
        updateByTime(start, end)
    }

    const changeDistanceRange = (event: any, newValue: number | number[]) => {
        const [start, end] = newValue as number[]
        setAtDistance([start, end])
        updateByDistance(start, end)
    }

    const changeDistanceStart = (event: any) => {
        let n = parseInt(event.target.value)
        if(!isNaN(n) && n < distanceRange[1] && n < atDistance[1] && n >= distanceRange[0]) {
            setAtDistance([n, atDistance[1]])
            updateByDistance(n, atDistance[1])
        }
    }

    const changeDistanceEnd = (event: any) => {
        let n : number | undefined = parseInt(event.target.value)
        if(!isNaN(n) && n > distanceRange[0] && n > atDistance[0] && n <= distanceRange[1]) {
            setAtDistance([atDistance[0], n])
            updateByDistance(atDistance[0], n)
        }
    }

    const changeTimeStart = (event: any) => {
        let d : number | undefined = event
        if(d && d < timeRange[1] && d < atTime[1] && d >= timeRange[0]) {
            setAtTime([d, atDistance[1]])
            updateByTime(d, atDistance[1])
        }
    }

    const changeTimeEnd = (event: any) => {
        let d : number | undefined = event
        if(d && d > timeRange[0] && d > atTime[0] && d <= timeRange[1]) {
            setAtTime([atDistance[0], d])
            updateByTime(atDistance[0], d)
        }
    }

    if(!id && !hash)
        return <Alert severity="error">404 page not found!</Alert>

    if(loading)
        return <LinearProgress />

    if(error)
        return <Alert severity="error">Something went wrong! the server was unable to preform operation [{error}]</Alert>
    
    if(pathInRange) 
        return (
            <Container maxWidth="md" disableGutters={true}>
                
                <MapContainer center={new LatLng(WORLD_CENTER_VIEW_LOCATION.latitude, WORLD_CENTER_VIEW_LOCATION.longitude)} zoom={WORLD_CENTER_VIEW_LOCATION.zoom} style={{minHeight: "70vh"}} >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <PathMarker path={path} status={PathProgress.done} showMarkers={false} path_color={PathColors.grey} />
                    <PathMarker path={pathInRange} status={PathProgress.done} showMarkers={true} path_color={PathColors.blue} />
                    <ChangePosition center={PositionToLatLang(path[0])} zoom={CLOSE_VIEW_ZOOM} fly={false} once />
                </MapContainer>

                <Box m={2}>
                    <Box>
                        <Typography>Distance</Typography>
                        <Box display="flex" alignItems="end" flexDirection="row" justifyContent="start">
                            <TextField
                                label="start"
                                type="number"
                                value={atDistance[0]}
                                onChange={changeDistanceStart}
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            <Typography>&nbsp; &nbsp;</Typography>
                            <TextField
                                label="end"
                                type="number"
                                value={atDistance[1]}
                                onChange={changeDistanceEnd}
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            <Typography>&nbsp; meters</Typography>
                        </Box>
                        <Slider
                            onChange={changeDistanceRange}
                            value={atDistance}
                            step={1}
                            min={distanceRange[0]}
                            max={distanceRange[1]}
                        />
                    </Box>
                    <Box>
                        <Typography>Time</Typography>
                        <Box display="flex" alignItems="end" flexDirection="row" justifyContent="start">
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DateTimePicker 
                                    value={atTime[0]} 
                                    onChange={changeTimeStart} />
                                <Typography>&nbsp; &nbsp;</Typography>
                                <DateTimePicker 
                                    value={atTime[1]} 
                                    onChange={changeTimeEnd} />
                            </MuiPickersUtilsProvider>
                        </Box>
                        <Slider
                            onChange={changeTimeRange}
                            value={atTime}
                            step={1}
                            min={timeRange[0]}
                            max={timeRange[1]}
                        />
                    </Box>
                </Box>

                <LiveMetricsStatus speed={speed} distance={distance} time={time} compassDirection={compass?.direction} compassAngle={compass?.greatCircleBearing} />
                
            </Container>
        )
    
    return  <LinearProgress />
}
