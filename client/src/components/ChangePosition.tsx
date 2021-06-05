import { LatLngExpression, ZoomPanOptions } from "leaflet"
import { useMap } from "react-leaflet"
import { useState, useEffect } from 'react'

interface ChangePositionProps {
    center?: LatLngExpression, 
    zoom?: number | undefined, 
    options?: ZoomPanOptions | undefined, 
    fly?: boolean,
    once?: boolean
}

export default function ChangePosition({center, zoom, options, fly = true, once} : ChangePositionProps) {
    
    const map = useMap()
    
    const [initilized, setInitilized] = useState(false)

    useEffect(() => {
        if(once && initilized) {
            return
        }
        if(center) {
            if(fly) {
                map.flyTo(center, zoom, options)
            } else {
				map.setView(center, zoom, options)
			}
        }
        setInitilized(true)
    }, [map, center, zoom, options, fly, once, initilized])

    return null;
}