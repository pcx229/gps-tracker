
import { getPathLength, getPreciseDistance, convertDistance } from 'geolib'
import { useEffect, useState } from "react"
import { useAppSelector } from '../state/hooks'
import { selectTravel } from '../state/TravelSlice'
import { DistanceUnits } from '../util/UnitMetrics'

// const { direction, rhumbLineBearing } = useDistance()

export default function useDistance(format: DistanceUnits = DistanceUnits.meter) : number | undefined {
    
    const [distance, setDistance] = useState<number | undefined>()

    const travel = useAppSelector(selectTravel)

    useEffect(() => {
        if(!travel.startTime) {
            setDistance(undefined)
        } else {
            setDistance(convertDistance(getPathLength([...travel.path], getPreciseDistance), format))
        }
    }, [format, travel])
    
    return distance
}