import { useEffect, useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Icon from '@material-ui/core/Icon'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { ConnectionStatus, selectWatchedPosition, startWatchingPosition, stopWatchingPosition } from '../state/WatchPositionSlice'
import Alert from '@material-ui/lab/Alert'
import { CircularProgress } from '@material-ui/core'
import NoSleep from '../util/PreventMobileSleepMode'

const useStyles =  makeStyles((theme: Theme) => createStyles({
    startRecordButton: {
      textTransform: "none",
      backgroundColor: theme.palette.info.main,
      color: theme.palette.info.contrastText,
      "&:hover":{
          backgroundColor: theme.palette.info.dark
      },
      "&:disabled":{
          backgroundColor: theme.palette.action.selected
      }
    },
    extendedButtonIcon: {
      marginRight: theme.spacing(1),
	  color: "inherit"
    },
    controllButtonsSpacer: {
      padding: theme.spacing(3)
    },
    locationIconWaitColor: {
      color: theme.palette.text.disabled
    },
    locationIconSuccessColor: {
      color: theme.palette.info.main,
      "&:disabled":{
        color: theme.palette.info.main
      }
    },
    locationIconFailColor: {
      color: theme.palette.error.main
    }
  }),
);

interface StartTrackingControlProps {
    startTracker: () => void
}

export default function StartTrackingControl({startTracker} : StartTrackingControlProps) {

    const classes = useStyles();
  
    const [, watchingStatus] = useAppSelector(selectWatchedPosition)
  
    const dispatch = useAppDispatch()

    const [attemptToGetPermisisionToUseGPS, setAttemptToGetPermisisionToUseGPS] = useState(false)
  
    const [attemptToStartTracking, setAttemptToStartTracking] = useState(false)
  
    useEffect(() => {
      if(attemptToGetPermisisionToUseGPS) {
        if(watchingStatus !== ConnectionStatus.avilable && watchingStatus !== ConnectionStatus.asking_permisision) {
          if(watchingStatus === ConnectionStatus.active) {
            if(attemptToStartTracking) {
              startTracker()
            }
          }
          setAttemptToGetPermisisionToUseGPS(false)
          setAttemptToStartTracking(false)
        }
      }
    }, [startTracker, attemptToStartTracking, attemptToGetPermisisionToUseGPS, watchingStatus])

    const clickStartTracking = () => {
	  // prevent screen sleep mode 
	  NoSleep.enable()
	  // start tracking path
      if(watchingStatus === ConnectionStatus.active) {
        startTracker()
      } else {
        if(!attemptToStartTracking) {
          dispatch<any>(startWatchingPosition())
		  	.then(() => {
			  setAttemptToStartTracking(true)
			  setAttemptToGetPermisisionToUseGPS(true)
		  })
        }
      }
    }

    const clickFindLocation = () => {
      if(watchingStatus === ConnectionStatus.active) {
        dispatch<any>(stopWatchingPosition())
      } else {
        if(!attemptToGetPermisisionToUseGPS) {
          setAttemptToGetPermisisionToUseGPS(true)
          dispatch<any>(startWatchingPosition())
        }
      }
    }

    return (
		<>
			<Grid className={classes.controllButtonsSpacer} container direction="row" justifyContent="space-between">
				<Grid item>
					{
						((watchingStatus === ConnectionStatus.asking_permisision) && attemptToStartTracking) ?
							<Fab 
								disabled
								variant="extended" onClick={clickStartTracking} 
								className={classes.startRecordButton}>
								<CircularProgress size="1.5em" className={classes.extendedButtonIcon} />
								Waiting For Connection
							</Fab>
							:
							<Fab 
								variant="extended" onClick={clickStartTracking} 
								className={classes.startRecordButton}>
								<Icon className={classes.extendedButtonIcon}>play_circle</Icon>
								Start Recording
							</Fab>
					}
				</Grid>
				<Grid item>
					<IconButton aria-label="location" onClick={clickFindLocation} className={clsx((watchingStatus === ConnectionStatus.asking_permisision) && classes.locationIconWaitColor, (watchingStatus === ConnectionStatus.active) && classes.locationIconSuccessColor, (watchingStatus === ConnectionStatus.permisision_rejected) && classes.locationIconFailColor)}>
						<Icon>my_location</Icon>
					</IconButton>
				</Grid>
			</Grid>
			
			<Alert severity="info">
				<b>Recording:</b> click the location button to see where you are, then when you are ready click on the play button to start tracking your path.
				<br />
				<br />
				<b>MODES:</b> you can pick the device you wish to retrieve your location from by selecting one of the options in the left corner of the page:
				<ul>
					<li>Random - is used for testing purposes, gives you a random path every time</li>
					<li>GPS - location will be supplied by the current device Geolocation service, which is the sensor or estimation</li>
					<li>Remote - givin a connection with a remote device, his location will be received here</li>
				</ul>
			</Alert>
		</>
      )
}