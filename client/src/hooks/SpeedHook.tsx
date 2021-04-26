
import { getSpeed, convertSpeed } from 'geolib'

import { useEffect, useState } from "react"
import Position, { PositionToSpeedPositionFormat } from '../models/Position'
import { useAppSelector } from '../state/hooks'
import { ConnectionStatus, selectWatchedPosition } from '../state/WatchPositionSlice'
import { SpeedUnits } from '../utill/UnitMetrics'

// const { direction, rhumbLineBearing } = useDistance()

export default function useSpeed(format: SpeedUnits = SpeedUnits.kilometers_per_hour) : number | undefined {
    
    const [speed, setSpeed] = useState<number | undefined>()

    const [currentWatchingPosition, watchingStatus] = useAppSelector(selectWatchedPosition)
    
    type DoublePosition = {
        current: Position | undefined,
        last: Position | undefined
    }
    const [position, ] = useState<DoublePosition>({ current: undefined, last: undefined})

    useEffect(() => {
        if(watchingStatus !== ConnectionStatus.active) {
            setSpeed(undefined)
        }
    }, [watchingStatus])
    
    useEffect(() => {
        position.last = position.current
        position.current = currentWatchingPosition
    }, [position, currentWatchingPosition])
    
    useEffect(() => {
        if(position.last && position.current) {
            setSpeed(convertSpeed(getSpeed(PositionToSpeedPositionFormat(position.last), PositionToSpeedPositionFormat(position.current)), format))
        }
    }, [format, position, currentWatchingPosition])

    return speed
}