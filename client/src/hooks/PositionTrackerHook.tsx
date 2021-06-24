import { useState, useEffect, useCallback } from "react";
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

	const resetTracker = useCallback(
		() => {
            setIsTracking(false)
            dispatch<any>(resetTravel())
		},
		[dispatch]
	)

	const startTracker = useCallback(
		() => {
            setIsTracking(true)
            dispatch<any>(startTravel())
		},
		[dispatch]
	)

	const stopTracker = useCallback(
		() => {
            setIsTracking(false)
            dispatch<any>(endTravel())
		},
		[dispatch]
	)

    useEffect(() => {
        if(isTracking && travel.startTime && currentWatchingPosition)
            dispatch<any>(addTravel(currentWatchingPosition))
    }, [dispatch, isTracking, travel.startTime, currentWatchingPosition])

    return {
        startTracker,
        stopTracker,
        resetTracker,
        isTracking: isTracking,
        hasTrack : travel.startTime !== undefined && travel.endTime !== undefined
    }
}