import Geolocation from './Geolocation'

export default class Test implements Geolocation {

    private POSITION_UPDATE_INTERVAL = 2000;
    
    private watching : Boolean = false;

    private observers : Map<number, PositionCallback> = new Map();

    private currentPosition? : GeolocationPosition;

    private randomNumberInRange(start: number, stop: number) {
        return start + Math.random() * (stop - start)
    }

    private async randomPosition() {
        // capital cities
        type City = {
            Country: string,
            Capital: string,
            Latitude: number,
            Longitude: number
        }
        const cities = await (await fetch('/capital-cities.json')).json()
        let i = Math.floor(Math.random() * (cities as Array<City>).length)
        return {
            latitude: cities[i].Latitude,
            longitude: cities[i].Longitude
        }
        // truly random
        // return {
        //     latitude: this.randomNumberInRange(-90, 90),
        //     longitude: this.randomNumberInRange(-180, 180)
        // }
    }

    constructor() {
        this.randomMove = this.randomMove.bind(this)
        this.callbackPositionWatcher = this.callbackPositionWatcher.bind(this)
    }

    private async randomMove(position : GeolocationPosition | undefined) : Promise<GeolocationPosition> {
        const r1 = Math.random() / 7000, r2 = Math.random() / 7000
        const p1 = Math.random() > 0.1 ? -1 : 1, p2 = Math.random() > 0.3 ? -1 : 1
        let latitude : number, longitude : number;
        if(position) {
            latitude = position.coords.latitude
            longitude = position.coords.longitude
        } else {
            const pos = await this.randomPosition()
            latitude = pos.latitude
            longitude = pos.longitude
        }
        return {
            coords: {
                latitude: latitude + r1 * p1, 
                longitude: longitude + r2 * p2,
                accuracy: 1,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
            },
            timestamp: Date.now()
        }
    }
    
    private async callbackPositionWatcher(): Promise<void> {
        this.currentPosition = await this.randomMove(this.currentPosition)
        // alert position to observers
        this.observers.forEach(callback => callback(this.currentPosition!))
    }

    watchPosition(successCallback: PositionCallback, errorCallback?: PositionErrorCallback, options?: PositionOptions): number {
        if(this.watching === false) {
            this.watching = true
            setInterval(this.callbackPositionWatcher, this.POSITION_UPDATE_INTERVAL)
        }
        let id : number = Math.floor(Math.random() * 100000)
        this.observers.set(id, successCallback)
        return id
    }

    clearWatch(watchId: number): void {
        this.observers.delete(watchId)
    }
}