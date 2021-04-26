import { useEffect, useState } from "react"
import Position from "../models/Position"
import { getCompassDirection, getGreatCircleBearing } from 'geolib'
import { useAppSelector } from "../state/hooks"
import { ConnectionStatus, selectWatchedPosition } from "../state/WatchPositionSlice"

// const { direction, greatCircleBearing } = useCompass()

interface Compass {
    direction? : string;
    greatCircleBearing? : number;
}

export default function useCompass() : Compass {

    const [direction, setDirection] = useState<string>()

    const [greatCircleBearing, setGreatCircleBearing] = useState<number>()

    const [currentWatchingPosition, watchingStatus] = useAppSelector(selectWatchedPosition)

    type DoublePosition = {
        current: Position | undefined,
        last: Position | undefined
    }
    const [position, ] = useState<DoublePosition>({ current: undefined, last: undefined})

    useEffect(() => {
        if(watchingStatus !== ConnectionStatus.active) {
            setDirection(undefined)
            setGreatCircleBearing(undefined)
        }
    }, [watchingStatus])
    
    useEffect(() => {
        position.last = position.current
        position.current = currentWatchingPosition
    }, [position, currentWatchingPosition])
    
    useEffect(() => {
        if(position.last && position.current) {
            setDirection(getCompassDirection(position.last, position.current))
            setGreatCircleBearing(getGreatCircleBearing(position.last, position.current))
        }
    }, [position, currentWatchingPosition])

    return {
        direction,
        greatCircleBearing
    }
}