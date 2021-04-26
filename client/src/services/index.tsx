
import Geolocation from "./Geolocation";
import GPSGeolocation from './GPSGeolocation'
import TestGeolocation from './TestGeolocation'
import SocketGeolocation from './SocketGeolocation'
import LocalStorageTrackerHistory from "./LocalStorageTrackerHistory";
import InMemoryTrackerHistory from "./InMemoryTrackerHistory";
import TrackerHistory from "./TrackerHistory";

export enum GeolocationTypes { TEST = 100, GPS = 101, MOBILE = 102 }

export enum HistoryTrackerTypes { InMemory = 200, LocalStorage = 201 }

export class ServicesFactory {

    private _geolocation : Geolocation
    private _trackerHistory : TrackerHistory

    constructor() {
        this._geolocation = GPSGeolocation
        this._trackerHistory = new LocalStorageTrackerHistory()
    }

    get geolocation() : Geolocation {
        return this._geolocation
    }

    get trackerHistory() : TrackerHistory {
        return this._trackerHistory
    }

    config(command : GeolocationTypes | HistoryTrackerTypes) {
        switch(command) {
            case GeolocationTypes.TEST:
                this._geolocation = new TestGeolocation()
                break;
            case GeolocationTypes.GPS:
                this._geolocation = GPSGeolocation
                break;
            case GeolocationTypes.MOBILE:
                this._geolocation = new SocketGeolocation()
                break;
            case HistoryTrackerTypes.InMemory:
                this._trackerHistory = new InMemoryTrackerHistory()
                break;
            case HistoryTrackerTypes.LocalStorage:
                this._trackerHistory = new LocalStorageTrackerHistory()
                break;
        }
    }
}

export default new ServicesFactory()