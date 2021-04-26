
import { useEffect, useState } from "react";
import { useAppSelector } from '../state/hooks';
import { selectTravel } from '../state/TravelSlice';

// const time_passed_in_milisecond = useTimer()

let watchId : any= undefined

export default function useTimer() : number | undefined {
    
    const [time, setTime] = useState<number | undefined>()

    const travel = useAppSelector(selectTravel)

    useEffect(() => {
        if(travel.startTime) {
            watchId = setInterval(() => {
                if(travel.startTime !== undefined)
                    if(travel.endTime !== undefined)
                        setTime(travel.endTime - travel.startTime)
                    else 
                        setTime(Date.now() - travel.startTime)
            }, 1000)
        } else {
            setTime(undefined)
            if(watchId)
                clearInterval(watchId)
        }
        return () => {
            if(watchId !== undefined) {
                clearInterval(watchId)
                watchId = undefined
            }
        }
    }, [travel])
    
    return time
}