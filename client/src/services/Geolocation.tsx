
export default interface Geolocation {

    // send updates on position to listeners
    watchPosition(successCallback: PositionCallback, errorCallback?: PositionErrorCallback, options?: PositionOptions): number;

    // clear updates listener
    clearWatch(watchId: number): void;
}