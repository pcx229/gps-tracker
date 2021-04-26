import Geolocation from './Geolocation'

const GPS : Geolocation = {
    watchPosition: (successCallback: PositionCallback, errorCallback?: PositionErrorCallback, options?: PositionOptions) => 
                        navigator.geolocation.watchPosition(successCallback, errorCallback, options),
    clearWatch: (watchId: number) => 
                    navigator.geolocation.clearWatch(watchId)
}

export default GPS