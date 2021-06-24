import { convertDistance, convertSpeed, getPathLength, getPreciseDistance, getSpeed } from 'geolib'
import { PositionToSpeedPositionFormat } from '../models/Position'
import Record from '../models/Record'
import { SpeedUnits, DistanceUnits } from '../util/UnitMetrics'

interface RecordAnalysisData {
    avgSpeed: number,
    distance: number,
    time: number
}

export default function recordAnalysis(record: Record, speedFormat?: SpeedUnits, distanceFormat?: DistanceUnits) : RecordAnalysisData {
    
    let avgSpeed, distance, time

    if(record.path.length >= 2) {
        avgSpeed = convertSpeed(getSpeed(PositionToSpeedPositionFormat(record.path[0]), PositionToSpeedPositionFormat(record.path[record.path.length-1])), speedFormat)
    } else {
        avgSpeed = 0
    }

    if(record.path.length >= 2) {
        distance = convertDistance(getPathLength([...record.path], getPreciseDistance), distanceFormat)
    } else {
        distance = 0
    }

    time = record.endTime - record.startTime

    return {
        avgSpeed,
        distance,
        time
    }
}