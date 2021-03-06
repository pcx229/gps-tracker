
import usePositionTracker from '../hooks/PositionTrackerHook'
import Container from '@material-ui/core/Container'
import StartTrackingControl from '../components/StartTrackingControl'
import StopTrackingControl from '../components/StopTrackingControl'
import SaveTrackingSlide from '../components/SaveTrackingControl'
import TrackingMapViewer from '../components/TrackingMap'
import { fetchAllHistory } from '../state/HistorySlice'
import { useAppDispatch } from '../state/hooks'
import { useEffect } from 'react'
import HistoryList from '../components/HistoryList'
import queryString from 'query-string'
import services, { GeolocationTypes } from '../services'
import DEVICE_MODE from '../util/DeviceMode'
import SelectModeFooter from '../components/SelectModeFooter'
import PositionDeviceStatus from '../components/PositionDeviceStatus'
import BorderLayout from '../components/BorderLayout'
import { stopWatchingPosition } from '../state/WatchPositionSlice'
import NoSleep from '../util/PreventMobileSleepMode'

export default function Home() {

  const {startTracker, stopTracker, resetTracker, isTracking, hasTrack } = usePositionTracker()

  const dispatch = useAppDispatch()

  let mode : DEVICE_MODE = queryString.parse(window.location.search).mode as DEVICE_MODE
  if(mode !== DEVICE_MODE.MOBILE && mode !== DEVICE_MODE.TEST) {
    mode = DEVICE_MODE.GPS
  }

  useEffect(() => {
	// select mode
    switch(mode) {
      case DEVICE_MODE.TEST:
        services.config(GeolocationTypes.TEST)
        break
      case DEVICE_MODE.MOBILE:
        services.config(GeolocationTypes.MOBILE)
        break
      case DEVICE_MODE.GPS:
        services.config(GeolocationTypes.GPS)
        break
    }
	// fetch history items
    dispatch<any>(fetchAllHistory())
	return () => {
		// clear any tracking that took place
		resetTracker()
		// clear position watcher
		dispatch<any>(stopWatchingPosition())
		// re-enable screen sleep mode if was disabled
		NoSleep.disable()
	}
  }, [mode, dispatch, resetTracker])

  let control = undefined
  if(isTracking) {
    control = <StopTrackingControl stopTracker={stopTracker} />
  } else if(hasTrack) {
    control = <SaveTrackingSlide resetTracker={resetTracker} />
  } else {
    control = <StartTrackingControl startTracker={startTracker} />
  }

  return (
    <div className="App">
      <Container maxWidth="md" disableGutters>
        <BorderLayout>
          <BorderLayout.Header>
          	<TrackingMapViewer style={{height: "70vh"}} isTracking={isTracking} hasTrack={hasTrack} />
          </BorderLayout.Header>
          <BorderLayout.Body>
		  	<PositionDeviceStatus mode={mode} />
            { control }
          	<HistoryList />
          </BorderLayout.Body>
          <BorderLayout.Footer saperator>
		  	<SelectModeFooter mode={mode} />
          </BorderLayout.Footer>
        </BorderLayout>
      </Container>
    </div>
  );
}