import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Icon from '@material-ui/core/Icon'
import LiveMetricsStatus from './LiveMetricsStatus'
import useCompass from '../hooks/CompassHook'
import useDistance from '../hooks/DistanceHook'
import useSpeed from '../hooks/SpeedHook'
import useTimer from '../hooks/useTimer'
import NoSleep from '../util/PreventMobileSleepMode'

const useStyles =  makeStyles((theme: Theme) => createStyles({
    stopRecordButton: {
      textTransform: "none",
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      "&:hover":{
          backgroundColor: theme.palette.error.dark
      },
      "&:disabled":{
          backgroundColor: theme.palette.error.light
      }
    },
    extendedButtonIcon: {
      marginRight: theme.spacing(1),
    },
    controlButtonsSpacer: {
      padding: theme.spacing(3)
    },
    locationIconSuccessColor: {
      color: theme.palette.info.main,
      "&:disabled":{
        color: theme.palette.info.main
      }
    }
  }),
);

interface StopTrackingControlProps {
    stopTracker: () => void
}

export default function StopTrackingControl({stopTracker} : StopTrackingControlProps) {

    const classes = useStyles();

    const compass = useCompass()
    const speed = useSpeed()
    const distance = useDistance()
    const time = useTimer()

    const clickStopTracking = () => {
	  // re-enable screen sleep mode 
	  NoSleep.disable()
	  // stop tracking path
      stopTracker()
    }

    return (
        <>
          <Grid className={classes.controlButtonsSpacer} container direction="row" justifyContent="space-between">
            <Grid item>
              <Fab variant="extended" onClick={clickStopTracking} className={classes.stopRecordButton}>
                <Icon className={classes.extendedButtonIcon}>stop</Icon>
                Stop Recording
              </Fab>
            </Grid>
            <Grid item>
              <IconButton aria-label="location" disabled className={classes.locationIconSuccessColor}>
                <Icon>my_location</Icon>
              </IconButton>
            </Grid>
          </Grid>

          <LiveMetricsStatus speed={speed} distance={distance} time={time} compassDirection={compass.direction} compassAngle={compass.greatCircleBearing} />
        </>
      )
}