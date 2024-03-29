import { Fab, Grid, Icon } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import useDistance from "../hooks/DistanceHook"
import useTimer from "../hooks/useTimer"
import { addToHistory } from "../state/HistorySlice"
import { useAppDispatch } from "../state/hooks"
import { saveTravel, selectTravel, tagTravel } from "../state/TravelSlice"
import ResultMetrics from "./ResultMetrics"
import Alert from '@material-ui/lab/Alert'
import { Box } from '@material-ui/core'

const useStyles =  makeStyles((theme: Theme) => createStyles({
    saveRecordButton: {
      textTransform: "none",
      backgroundColor: theme.palette.success.main,
      color: "white",
      "&:hover":{
          backgroundColor: theme.palette.success.dark
      },
      "&:disabled":{
          backgroundColor: theme.palette.success.light
      },
	  marginRight: "1em"
    },
    discardRecordButton: {
      textTransform: "none",
      backgroundColor: "white",
      color: "black",
      "&:hover":{
          backgroundColor: "white"
      },
      "&:disabled":{
          backgroundColor: "white"
      }
    },
    extendedButtonIcon: {
      marginRight: theme.spacing(1),
    },
    controllButtonsSpacer: {
      padding: theme.spacing(3)
    }
  }),
)

interface SaveTrackingControlProps {
  resetTracker: () => void
}

export default function SaveTrackingControl({resetTracker} : SaveTrackingControlProps) {

    const classes = useStyles()

    const dispatch = useAppDispatch()

    const [activity, setActivity] = useState<string | undefined>(undefined)

    const travel = useSelector(selectTravel)
    
    const distance = useDistance()
    const time = useTimer()

    let avgSpeed : number = 0
    if(distance && time)
      avgSpeed = distance * 3600 / time // kmh
    avgSpeed = Math.floor(avgSpeed)

    const clickSaveTracking = () => {
      dispatch<any>(tagTravel(activity || "unknown"))
      dispatch<any>(saveTravel())
    }

    useEffect(() => {
      if(travel.isSaved) {
        dispatch<any>(addToHistory({
          startTime: travel.startTime!,
          endTime: travel.endTime!,
          path: travel.path,
          tag: travel.tag!
        }))
        resetTracker()
      }
    }, [dispatch, travel.isSaved, travel, resetTracker])

    const clickDiscardTracking = () => {
      resetTracker()
    }
    
    return (
      <>
        <Grid className={classes.controllButtonsSpacer} container direction="row" justifyContent="flex-start">
          <Grid item>
            <Fab variant="extended" onClick={clickSaveTracking} className={classes.saveRecordButton}>
              <Icon className={classes.extendedButtonIcon}>done</Icon>
              Save Recording
            </Fab>
          </Grid>
          <Grid item>
            <Fab variant="extended" onClick={clickDiscardTracking} className={classes.discardRecordButton}>
              <Icon className={classes.extendedButtonIcon}>close</Icon>
              Discard
            </Fab>
          </Grid>
        </Grid>

        <ResultMetrics activity={activity} setActivity={setActivity} distance={distance} time={time} avgSpeed={avgSpeed} />
			
		<Box my={2}>
			<Alert severity="info">
				<b>Saving:</b> click the activity button pick yours, then if you will choose to save it it will be added to the history list down below.
			</Alert>
		</Box>
      </>
    )
}