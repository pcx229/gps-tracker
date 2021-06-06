
import { Box, Container, Paper, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Speedometer from "react-d3-speedometer"
import Compass from './Compass';
import { ParseTime, TimeString } from '../utill/TimeParser';

interface LiveMetricsStatusProps {
    speed?: number,
    distance?: number,
    time?: number,
    compassDirection?: string,
    compassAngle?: number,
}

export default function LiveMetricsStatus({speed, distance, time, compassDirection, compassAngle} : LiveMetricsStatusProps) {
    
    if(!time)  
      time = 0
    let timeContainer = undefined, timeParsed = ParseTime(time)
    timeContainer = (
        <Box style={{textAlign:"center"}}>
            { timeParsed.days !== 0 ? <Typography style={{fontSize: '0.8rem'}}>{timeParsed.days} days</Typography> : undefined }
            <Box style={{display:"block"}}>
                <Typography display="inline" style={{padding: '0.3rem', fontSize: '1.7rem', fontWeight: 'bold'}}>
                    { TimeString(timeParsed.hours, timeParsed.minutes, timeParsed.seconds)}
                </Typography>
                <Typography display="inline" style={{fontSize: '0.9rem'}}>
                    { (timeParsed.days !== 0 || timeParsed.hours !== 0) ? "hours" : "minutes" }
                </Typography>
            </Box>
            <Typography> Time </Typography>
        </Box>
    )

    if(!distance) 
      distance = 0
    let distanceContainer = undefined, distanceString = String(distance/1000)
    if(distance < 1000) {
        distanceString = distanceString.substr(0, 4)
    } else if(distance < 100000) {
        distanceString = distanceString.substr(0, 4)
    } else if(distance <= 999000) {
        distanceString = distanceString.substr(0, 3)
    } else {
        distanceString = ">999"
    }
    distanceContainer = (
        <Box style={{textAlign:"center"}}>
            <Box style={{display:"block"}}>
                <Typography display="inline" style={{padding: '0.3rem', fontSize: '1.7rem', fontWeight: 'bold'}}>
                    { distanceString }
                </Typography>
                <Typography display="inline" style={{fontSize: '0.9rem'}}>
                    km
                </Typography>
            </Box>
            <Typography> Distance </Typography>
        </Box>
    )
    
    if(!speed)
      speed = 0
    let speedContainer = undefined
    speedContainer = (
        <Box style={{textAlign:"center"}}>
          <Typography style={{fontSize: '0.8rem'}}>{Math.floor(speed)} kmh</Typography>
          <Speedometer 
              minValue={0} 
              maxValue={100} 
              value={Math.min(Math.max(speed, 0), 100)}  
              needleColor="black"
              startColor="green"
              segments={4}
              width={180}
              height={100}
              needleHeightRatio={0.8}
              ringWidth={20}
              maxSegmentLabels={0}
              currentValueText=" " 
              paddingVertical={0}
              paddingHorizontal={0}
              endColor="red"/>
            <Typography> Speed </Typography>
        </Box>
    )

    if(!compassDirection || !compassAngle)  {
      compassDirection = "N"
      compassAngle = 0
    }
    let compassContainer = undefined
    compassContainer = (
      <Box style={{textAlign:"center"}}>
        <Typography style={{fontSize: '0.8rem', margin: '0.3rem'}}>{compassDirection}&deg;</Typography>
        <Compass angle={compassAngle} />
        <Typography> Compass </Typography>
      </Box>
    )

    return (
      <Container maxWidth="sm">
        <Paper variant="outlined">
          <Box p={3}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6}>
                { speedContainer }
              </Grid>
              <Grid item xs={12} sm={6} style={{width: '20rem'}}>
                { distanceContainer }
              </Grid>
              <Grid item xs={12} sm={6} style={{width: '20rem'}}>
                { timeContainer }
              </Grid>
              <Grid item xs={12} sm={6}>
                { compassContainer }
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    )
}