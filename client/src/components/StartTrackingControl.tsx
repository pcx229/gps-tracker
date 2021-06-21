import { useEffect, useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Icon from '@material-ui/core/Icon'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { ConnectionStatus, selectWatchedPosition, startWatchingPosition, stopWatchingPosition } from '../state/WatchPositionSlice'

const useStyles =  makeStyles((theme: Theme) => createStyles({
    startRecordButton: {
      textTransform: "none",
      backgroundColor: theme.palette.info.main,
      color: theme.palette.info.contrastText,
      "&:hover":{
          backgroundColor: theme.palette.info.dark
      },
      "&:disabled":{
          backgroundColor: theme.palette.info.light
      }
    },
    extendedButtonIcon: {
      marginRight: theme.spacing(1),
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
      if(watchingStatus === ConnectionStatus.active) {
        startTracker()
      } else {
        if(!attemptToStartTracking) {
          dispatch<any>(startWatchingPosition())
          setAttemptToStartTracking(true)
          setAttemptToGetPermisisionToUseGPS(true)
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
        <Grid className={classes.controllButtonsSpacer} container spacing={3} direction="row" justify="space-between">
          <Grid item>
            <Fab variant="extended" onClick={clickStartTracking} className={classes.startRecordButton}>
              <Icon className={classes.extendedButtonIcon}>play_circle</Icon>
              Start Recording
            </Fab>
          </Grid>
          <Grid item>
            <IconButton aria-label="location" onClick={clickFindLocation} className={clsx((watchingStatus === ConnectionStatus.asking_permisision) && classes.locationIconWaitColor, (watchingStatus === ConnectionStatus.active) && classes.locationIconSuccessColor, (watchingStatus === ConnectionStatus.permisision_rejected) && classes.locationIconFailColor)}>
              <Icon>my_location</Icon>
            </IconButton>
          </Grid>
        </Grid>
      )
}