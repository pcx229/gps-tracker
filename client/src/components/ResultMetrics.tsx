import { Avatar, Box, Container, Grid, Icon, Paper, Typography } from "@material-ui/core"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { ParseTime, TimeParserString } from "../util/TimeParser"
import activity_icon from '../util/ActivityIcon'

const useStyles = makeStyles((theme: Theme) => createStyles({
    resultContainer: {
      margin: '3rem auto',
      width: 'max-content',
      padding: '0.5rem'
    },
    ActivityIcon: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      backgroundColor: "transparent",
      '&:hover': {
        border: "1px solid green",
      },
      transition: "border 0.5s",
      color: "black",
      border: "1px solid"
    },
    ActivityLabel: {
        fontSize: '0.8rem',
        marginTop: '0.2rem'
    }
  }),
);

interface ResultMetricsProps {
    activity?: string;
    setActivity: (activity: string | undefined) => void,
    distance?: number;
    time?: number;
    avgSpeed?: number;
}

export default function ResultMetrics({activity, setActivity, distance, time, avgSpeed} : ResultMetricsProps) {
    
    const classes = useStyles();

    const changeActivity = () => {
        let found = false, nextActivity = undefined
        if(activity === undefined) {
            nextActivity = "walking"
        } else {
            for(let k of activity_icon.keys()) {
                if(found) {
                    nextActivity = k
                    break
                }
                if(k === activity) {
                    found = true
                } 
            }
            if(nextActivity === undefined) {
                nextActivity = "unknown"
            }
        }
        setActivity(nextActivity)
    }

    // default
    if(!distance)
        distance = 0
    if(!time)
        time = 0
    if(!avgSpeed)
        avgSpeed = 0
    
    return (
        <Container maxWidth="xs">
            <Paper variant="outlined">
                <Box p={3}>
                    <Grid container spacing={3} direction="row" alignItems="center">
                        <Grid item xs={6}>
                            <Box display="flex" flexDirection="column" m={3} alignItems="center">
                                <Avatar onClick={() => changeActivity()} className={classes.ActivityIcon} >
                                    <Icon>{activity ? activity_icon.get(activity) : "help"} </Icon>
                                </Avatar>
                                <Typography className={classes.ActivityLabel}>Activity</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} style={{width: '25rem'}}>
                            <Grid container direction="column" justify="center" style={{ height: "100%" }}>
                                <Grid item>
                                    <Typography>Distance: {String(distance/1000)} km</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>Time: {TimeParserString(ParseTime(time))}</Typography>
                                </Grid> 
                                <Grid item>
                                    <Typography>Avg.Speed: {avgSpeed} kmh</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}