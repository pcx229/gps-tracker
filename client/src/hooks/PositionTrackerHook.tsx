import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { selectWatchedPosition } from "../state/WatchPositionSlice";
import { addTravel, endTravel, resetTravel, selectTravel, startTravel } from "../state/TravelSlice";

// const { startTracker, stopTracker, resetTracker, isTracking, path } = usePositionTracker()

interface Tracker {
    startTracker : () => void;
    stopTracker : () => void;
    resetTracker : () => void;
    isTracking : Boolean;
    hasTrack: Boolean;
}

export default function usePositionTracker() : Tracker {

    const [currentWatchingPosition] = useAppSelector(selectWatchedPosition)

    const travel = useAppSelector(selectTravel)

    const dispatch = useAppDispatch()

    const [isTracking, setIsTracking] = useState(travel.startTime !== undefined)

    useEffect(() => {
        if(isTracking && travel.startTime && currentWatchingPosition)
            dispatch<any>(addTravel(currentWatchingPosition))
    }, [dispatch, isTracking, travel.startTime, currentWatchingPosition])

    return {
        startTracker: () => {
            dispatch<any>(startTravel())
            setIsTracking(true)
        },
        stopTracker: () => {
            setIsTracking(false)
            dispatch<any>(endTravel())
        },
        resetTracker: () => {
            setIsTracking(false)
            dispatch<any>(resetTravel())
        },
        isTracking: isTracking,
        hasTrack : travel.startTime !== undefined && travel.endTime !== undefined
    }
}