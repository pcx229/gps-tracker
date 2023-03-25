import { Box, Container, Icon, IconButton, LinearProgress, Slider, TextField, Tooltip, Typography } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useParams } from "react-router"
import { Link } from "react-router-dom"
import LiveMetricsStatus from "../components/LiveMetricsStatus"
import PathMarker, { PathColors, PathProgress } from "../components/PathMarker"
import Path from "../models/Path"
import { useAppDispatch } from "../state/hooks"
import { fetchFromHistory, fetchFromShare, selectTravelView } from "../state/TravelViewSlice"
import { pathAvgSpeed, pathCompass, pathDistance, pathTime, splitPathByDistance, splitPathByTime } from "../util/PathDecomposer"
import MomentUtils from '@date-io/moment'
import { MapContainer, TileLayer } from "react-leaflet"
import { PositionToLatLang } from "../models/Position"
import ChangePosition from "../components/ChangePosition"
import { CLOSE_VIEW_ZOOM, WORLD_CENTER_VIEW_LOCATION } from "../util/MapsLocations"
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

	const [inputAtDistanceSlider, setInputAtDistanceSlider] = useState<number[]>([0, 0])
	const [inputAtDistanceNumbers, setInputAtDistanceNumbers] = useState<Array<number | ''>>([0, 0])
	const [inputAtTimeSlider, setInputAtTimeSlider] = useState<number[]>([0, 0])
	const [inputAtTimePicks, setInputAtTimePicks] = useState<Array<number | undefined>>([0, 0])

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
			setInputAtDistanceSlider(total_distance)
			setInputAtDistanceNumbers(total_distance)
            setAtTime(total_time)
			setInputAtTimeSlider(total_time)
			setInputAtTimePicks(total_time)
            setPathInRange(path)
        }
    }, [path])

	// change distance range with time picker and slider

    const changeTimeStart = useCallback((event: any) => {
        let start = event, end = inputAtTimePicks[1]
		if(start ===  undefined) {
			setInputAtTimePicks([undefined, end])
			return
		}
		start = Number(start) || 0
		if(isNaN(start)) {
			start = 0
		}
		if(start < timeRange[0]) {
			start = timeRange[0]
		} else if(start > timeRange[1]) {
			start = timeRange[1]
		}
		setInputAtTimePicks([start, end])
    }, [timeRange, inputAtTimePicks])

	const changeTimeStartValidate = useCallback(() => {
		let start = inputAtTimePicks[0], end = inputAtTimePicks[1]
		if(start === undefined) {
			return false
		}
		if(end !== undefined && start > end) {
			return false
		}
		return true
	}, [inputAtTimePicks])

    const changeTimeEnd = useCallback((event: any) => {
        let start = inputAtTimePicks[0], end = event
		if(end ===  undefined) {
			setInputAtTimePicks([start, end])
			return
		}
		end = Number(end) || 0
		if(isNaN(end)) {
			end = 0
		}
		if(end < timeRange[0]) {
			end = timeRange[0]
		} else if(end > timeRange[1]) {
			end = timeRange[1]
		}
		setInputAtTimePicks([start, end])
    }, [timeRange, inputAtTimePicks])

	const changeTimeEndValidate = useCallback(() => {
        let end = inputAtTimePicks[1]
		if(end === undefined) {
			return false
		}
		return true
	}, [inputAtTimePicks])

	const changeTimeStartEndValidate = useCallback(() => {
		return changeTimeStartValidate() && changeTimeEndValidate()
	}, [changeTimeStartValidate, changeTimeEndValidate])

    const changeTimeStartEnd = (event: any, newValue: any) => {
		setInputAtTimePicks(newValue)
		setInputAtTimeSlider(newValue)
    }

    const updateByTime = useCallback((start: number, end: number) => {
        let split = splitPathByTime(path, start, end)
        setPathInRange(split)
        let before_distance = pathDistance(splitPathByTime(path, path[0].time, start)),
            after_distance = pathDistance(split)
		let total_distance = before_distance + after_distance
        setAtDistance([before_distance, total_distance])
		setInputAtDistanceSlider([before_distance, total_distance])
		setInputAtDistanceNumbers([before_distance, total_distance])
    }, [path])

	useEffect(() => { // update slider with date picks input
		if(changeTimeStartEndValidate()) {
			if(inputAtTimePicks[0] !== inputAtTimeSlider[0] || inputAtTimePicks[1] !== inputAtTimeSlider[1]) {
				setInputAtTimeSlider([...(inputAtTimePicks as number[])])
			}
		}
	}, [changeTimeStartEndValidate, inputAtTimePicks, inputAtTimeSlider])

	useEffect(() => { // update date values by slider input at minimum every 200ms with changes detected
		let update = window.setTimeout(() => {
			const [wanted_start, wanted_end] = inputAtTimeSlider
			const [start, end] = atTime
			if(start !== wanted_start || end !== wanted_end) {
				updateByTime(wanted_start, wanted_end)
			}
		}, 50)
		return () => window.clearTimeout(update)
	}, [updateByTime, atTime, inputAtTimeSlider])

	// change distance range with numbers and slider

    const changeDistanceStart = useCallback((event: any) => {
        let start = event.target.value, end = inputAtDistanceNumbers[1]
		if(start ===  '') {
			setInputAtDistanceNumbers(['', end])
			return
		}
		start = parseInt(start) || 0
		if(isNaN(start)) {
			start = 0
		}
		if(start < distanceRange[0]) {
			start = distanceRange[0]
		} else if(start > distanceRange[1]) {
			start = distanceRange[1]
		}
		setInputAtDistanceNumbers([start, end])
    }, [distanceRange, inputAtDistanceNumbers])

	const changeDistanceStartValidate = useCallback(() => {
		let start = inputAtDistanceNumbers[0], end = inputAtDistanceNumbers[1]
		if(start === '') {
			return false
		}
		if(end !== '' && start > end) {
			return false
		}
		return true
	}, [inputAtDistanceNumbers])

    const changeDistanceEnd = useCallback((event: any) => {
        let start = inputAtDistanceNumbers[0], end = event.target.value
		if(end ===  '') {
			setInputAtDistanceNumbers([start, end])
			return
		}
		end = parseInt(end) || 0
		if(isNaN(end)) {
			end = 0
		}
		if(end < distanceRange[0]) {
			end = distanceRange[0]
		} else if(end > distanceRange[1]) {
			end = distanceRange[1]
		}
		setInputAtDistanceNumbers([start, end])
    }, [distanceRange, inputAtDistanceNumbers])

	const changeDistanceEndValidate = useCallback(() => {
        let end = inputAtDistanceNumbers[1]
		if(end === '') {
			return false
		}
		return true
	}, [inputAtDistanceNumbers])

	const changeDistanceStartEndValidate = useCallback(() => {
		return changeDistanceStartValidate() && changeDistanceEndValidate()
	}, [changeDistanceStartValidate, changeDistanceEndValidate])

    const changeDistanceStartEnd = (event: any, newValue: any) => {
		setInputAtDistanceNumbers(newValue)
		setInputAtDistanceSlider(newValue)
    }

	useEffect(() => { // update slider with numbers input
		if(changeDistanceStartEndValidate()) {
			if(inputAtDistanceNumbers[0] !== inputAtDistanceSlider[0] || inputAtDistanceNumbers[1] !== inputAtDistanceSlider[1]) {
				setInputAtDistanceSlider([...(inputAtDistanceNumbers as number[])])
			}
		}
	}, [changeDistanceStartEndValidate, inputAtDistanceNumbers, inputAtDistanceSlider])

	const updateByDistance = useCallback((start: number, end: number) => { 
		let split = splitPathByDistance(path, start, end)
		let start_time = split[0].time, end_time = split[split.length-1].time
		setPathInRange(split)
		setAtTime([start_time, end_time])
		setAtDistance([start, end])
		setInputAtTimeSlider([start_time, end_time])
		setInputAtTimePicks([start_time, end_time])
	}, [path])

	useEffect(() => { // update distance values by slider input at minimum every 200ms with changes detected
		let update = window.setTimeout(() => {
			const [wanted_start, wanted_end] = inputAtDistanceSlider
			const [start, end] = atDistance
			if(start !== wanted_start || end !== wanted_end) {
				updateByDistance(wanted_start, wanted_end)
			}
		}, 50)
		return () => window.clearTimeout(update)
	}, [updateByDistance, atDistance, inputAtDistanceSlider])

    if(!id && !hash)
        return <Alert severity="error">404 page not found!</Alert>

    if(loading)
        return <LinearProgress />

    if(error)
        return <Alert severity="error">Something went wrong! the server was unable to preform operation [{error}]</Alert>
    
    if(pathInRange) 
        return (
            <Container maxWidth="md" disableGutters={true}>

				<Box my={2} display="flex" flexDirection="row" alignItems="center">
					<Tooltip title="go back home">
						<Link to="/">
							<IconButton aria-label="location" size="medium">
								<Icon>arrow_back</Icon>
							</IconButton>
						</Link>
					</Tooltip>
					<Typography variant="h5">&nbsp; &nbsp;  { id ? "Saved" : "Shared" } Item </Typography>
				</Box>
                
                <MapContainer center={new LatLng(WORLD_CENTER_VIEW_LOCATION.latitude, WORLD_CENTER_VIEW_LOCATION.longitude)} zoom={WORLD_CENTER_VIEW_LOCATION.zoom} style={{minHeight: "70vh"}} >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <PathMarker path={path} status={PathProgress.done} showMarkers={false} path_color={PathColors.grey} />
                    <PathMarker path={pathInRange} status={PathProgress.done} showMarkers={true} path_color={PathColors.blue} />
                    <ChangePosition center={PositionToLatLang(path[0])} zoom={CLOSE_VIEW_ZOOM} fly={false} once />
                </MapContainer>

                <Box p={3}>
                    <Box>
                        <Typography>Distance</Typography>
                        <Box display="flex" alignItems="end" flexDirection="row" justifyContent="start">
                            <TextField
                                label="start"
                                type="number"
                                value={inputAtDistanceNumbers[0]}
								error={!changeDistanceStartValidate()}
                                onChange={changeDistanceStart}
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            <Typography>&nbsp; &nbsp;</Typography>
                            <TextField
                                label="end"
                                type="number"
								value={inputAtDistanceNumbers[1]}
								error={!changeDistanceEndValidate()}
                                onChange={changeDistanceEnd}
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            <Typography>&nbsp; meters</Typography>
                        </Box>
                        <Slider
                            onChange={changeDistanceStartEnd}
                            value={inputAtDistanceSlider}
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
                                    value={inputAtTimePicks[0]} 
									error={!changeTimeStartValidate()}
									onChange={changeTimeStart} />
                                <Typography>&nbsp; &nbsp;</Typography>
                                <DateTimePicker 
                                    value={inputAtTimePicks[1]} 
									error={!changeTimeEndValidate()}
									onChange={changeTimeEnd} />
                            </MuiPickersUtilsProvider>
                        </Box>
                        <Slider
                            onChange={changeTimeStartEnd}
                            value={inputAtTimeSlider}
                            step={1}
                            min={timeRange[0]}
                            max={timeRange[1]}
                        />
                    </Box>
                </Box>

                <Box py={2}>
                	<LiveMetricsStatus speed={speed} distance={distance} time={time} compassDirection={compass?.direction} compassAngle={compass?.greatCircleBearing} />
                </Box>
            </Container>
        )
    
    return  <LinearProgress />
}
