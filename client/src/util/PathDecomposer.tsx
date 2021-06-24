import { LatLng } from "leaflet";
import Path from "../models/Path";
import Position, { comparePosition, PositionToLatLang } from "../models/Position";
import { DistanceUnits, SpeedUnits } from './UnitMetrics'
import { getPathLength, convertDistance, getPreciseDistance, convertSpeed, getCompassDirection, getGreatCircleBearing } from 'geolib'

/**
 * given two geolocation coordinates(Latitude/Longitude), calculate the intermediate point between them by a precentage value
 * @param a a geolocation coordinate
 * @param b a geolocation coordinate
 * @param precentage a number between 0 and 1 where 0 is at point 'a' and 1 is at point 'b'
 * @resources 
 * http://www.movable-type.co.uk/scripts/latlong.html
 * https://stackoverflow.com/questions/33907276/calculate-point-between-two-coordinates-based-on-a-percentage
 */
function calculateIntermediatePoint(a: LatLng, b: LatLng, precentage: number) : LatLng {

  function toRadians(degress: number): number {
    return degress * (Math.PI / 180)
  }

  function toDegrees(radians: number): number {
    return radians * (180 / Math.PI)
  }

  const latA = toRadians(a.lat)
  const lngA = toRadians(a.lng)
  const latB = toRadians(b.lat)
  const lngB = toRadians(b.lng)

  const deltaLat = latB - latA
  const deltaLng = lngB - lngA

  const calcA = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(latA) * Math.cos(latB) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
  const calcB = 2 * Math.atan2(Math.sqrt(calcA), Math.sqrt(1 - calcA))

  const A = Math.sin((1 - precentage) * calcB) / Math.sin(calcB)
  const B = Math.sin(precentage * calcB) / Math.sin(calcB)

  const x = A * Math.cos(latA) * Math.cos(lngA) + B * Math.cos(latB) * Math.cos(lngB)
  const y = A * Math.cos(latA) * Math.sin(lngA) + B * Math.cos(latB) * Math.sin(lngB)
  const z = A * Math.sin(latA) + B * Math.sin(latB)

  const latC = Math.atan2(z, Math.sqrt(x * x + y * y))
  const lngC = Math.atan2(y, x)

  return new LatLng(toDegrees(latC), toDegrees(lngC))
}

/**
 * remove consecutive duplicates from an array
 * @param array array of any type
 * @param compare a function that can tell if one object in the array is the same as another
 * @resources
 * https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
 */
function next_uniq<T>(array : T[], compare: (a: T, b: T) => Boolean) : T[] {
    return array.filter(function(item, pos, ary) {
        return !pos || compare(item, ary[pos - 1]) !== true
    });
}

/**
 * extract a range from a range represented by some data in an array 
 * example: the range can be numbers: 1 2 3 4 5 6 7
 *          the function inRange will call for each two consecutive numbers in the range
 *          so (1 2), (2 3), (3 4) and so on...
 *          suppose we want to extract the range 0.5 - 3.2, we will need to return the
 *          following from inRange: (1 2) -> (0.5 2), (2 3) -> (2 3), (3 4) -> (3 3.2)
 *          the output of filterRange then will be (0.5 2 3 3.2)
 * @param range an array of objects that are the range, each object is next to his following object in the range
 * @param inRange a function that gets a subrange and extract the range that is in our wanted range
 *                  the function second parameter may be undefined, in that case the return range will be
 *                  an array with a single item or empty if the object in the first parameter is in the range
 * @param compare a function that can tell if one object in the range array is the same as another
 */
function filterRange<T>(range: T[], inRange: (a: T, b?: T) => T[], compare: (a: T, b: T) => Boolean) : T[] {
    let result : T[] = []
    if(range.length < 2) {
        if(range.length === 1)
            result = inRange(range[0])
    } else {
        // get subranges within range
        for(let i=0;i<range.length-1;i++) {
            result = result.concat(inRange(range[i], range[i+1]))
        }
        // remove consecutive duplicates
        result = next_uniq(result, compare)
    }
    return result
}

export function pathDistance(path: Path, format: DistanceUnits = DistanceUnits.meter) : number {
    return convertDistance(getPathLength(path, getPreciseDistance), format)
}

export function pathAvgSpeed(path: Path, format: SpeedUnits = SpeedUnits.kilometers_per_hour) : number {
    const a = path[0], b = path[path.length-1]
	const distance = convertDistance(getPathLength(path, getPreciseDistance), DistanceUnits.meter)
	const time = (b.time - a.time) / 1000
    return convertSpeed(distance/time, format)
}

export function pathCompass(path: Path) : {direction: string, greatCircleBearing: number} {
    const a = path[0], b = path[path.length-1]
    return {
        direction: getCompassDirection(a, b),
        greatCircleBearing: getGreatCircleBearing(a, b)
    }
}

export function pathTime(path: Path) : number {
    const a = path[0], b = path[path.length-1]
    return b.time - a.time
}

function midPosition(a: Position, b: Position, precentage: number) : Position {
    const start_position = calculateIntermediatePoint(PositionToLatLang(a)!, PositionToLatLang(b)!, precentage)
    const start_time = a.time + (b.time - a.time) * precentage
    return {
        latitude: start_position.lat,
        longitude: start_position.lng,
        time: start_time
    }
}

export function splitPathByDistance(path: Path, start: number, end: number, format: DistanceUnits = DistanceUnits.meter) : Path {
    let total = 0.0
    return filterRange(path, (a, b?) => {
        if(!b) {
            if(start === 0)
                return [a]
            else
                return []
        }
        let result : Path = []
        const distance = convertDistance(getPreciseDistance(a, b, 0.0001), format)
        if(start > total && start <= total + distance) {
            result.push(midPosition(a, b, 1.0 * (start - total) / distance))
        }
        if(start <= total && end >= total + distance) {
            result = [a, b]
        }
        if(end >= total && end <= total + distance) {
            if(result.length === 0)
                result.push(a)
            result.push(midPosition(a, b, 1.0 * (end - total) / distance))
        } else if(result.length === 1) {
            result.push(b)
        }
        total += distance
        return result
    }, comparePosition);
}

export function splitPathByTime(path: Path, start: number, end: number) : Path {
    let total = path[0].time
    return filterRange(path, (a, b?) => {
        if(!b) {
            if(end - start > 0)
                return [a]
            else
                return []
        }
        let result : Path = []
        const diffrence = b.time - a.time
        if(start > total && start <= total + diffrence) {
            result.push(midPosition(a, b, 1.0 * (start - total) / diffrence))
        }
        if(start <= total && end >= total + diffrence) {
            result = [a, b]
        }
        if(end >= total && end <= total + diffrence) {
            if(result.length === 0)
                result.push(a)
            result.push(midPosition(a, b, 1.0 * (end - total) / diffrence))
        } else if(result.length === 1) {
            result.push(b)
        }
        total += diffrence
        return result
    }, comparePosition);
}