import { io } from "socket.io-client"
import Position from "../models/Position"
import Geolocation from "./Geolocation"

enum device { RECORDER = "recorder", MOBILE = "mobile" }

export function RecorderSocket() {

    const socket = io(process.env.REACT_APP_REMOTE_GPS_SOCKET_SERVER!, {
        path: "/mobile-location",
        query: { role: device.RECORDER }
    })

    return {
        Join() {
            socket.emit("join")
            console.log("emit join")
        },
        OnCodeChangeListener(callback: (code: string) => void) {
            socket.on("code", callback)
        },
        RemoveOnCodeChangeListener(callback: (code: string) => void) {
            socket.off("code", callback)
        },
        OnStatusChangeListener(callback: (status: string | Error) => void) {
            socket.on("status", callback)
            socket.on("connect_error", callback)
        },
        RemoveOnStatusChangeListener(callback: (status: string | Error) => void) {
            socket.off("status", callback)
            socket.off("connect_error", callback)
        },
        OnPositionChangeListener(callback: (position: Position) => void) {
            socket.on("position", callback)
        },
        RemoveOnPositionChangeListener(callback: (position: Position) => void) {
            socket.off("position", callback)
        },
        Disconnect() {
            socket.disconnect()
        }
    }
}

export type StatusMessageItemType = {type: string, message: string}
export type StatusType = {
    callback: undefined | (({type, message} : StatusMessageItemType) => void),
    messagesQueue: Array<StatusMessageItemType>
}

export interface GeolocationWithStatusAndOperations extends Geolocation {
    watchStatus(watchId: number, statusCallback: ({type, message} : StatusMessageItemType) => void) : void;
    watchOperations(watchId: number) : any;
}

export default class SocketGeolocation implements GeolocationWithStatusAndOperations {

    private observers = new Map()

    watchPosition(successCallback: PositionCallback, errorCallback?: PositionErrorCallback, options?: PositionOptions): number {
        const socket = RecorderSocket()
        // listeners
        const statusManager : StatusType = {
            callback: undefined,
            messagesQueue: []
        }
        const statusChange = (status: string | Error) => {
            // server error
            if(status instanceof Error) {
                errorCallback && errorCallback({ 
                    message: "could not connect to server", 
                    code: 1, 
                    POSITION_UNAVAILABLE: 1, 
                    PERMISSION_DENIED: 1, 
                    TIMEOUT: 1
                })
                socket.Disconnect()
            }
            // mobile connect/disconnect
            else {
                if(statusManager.callback) {
                    statusManager.callback({
                        type: "connection",
                        message: status
                    })
                } else {
                    statusManager.messagesQueue.push({
                        type: "connection",
                        message: status
                    })
                }
            }
        }
        socket.OnStatusChangeListener(statusChange)
        const codeChange = (code: string) => {
            if(statusManager.callback) {
                statusManager.callback({
                    type: "code",
                    message: code
                })
            } else {
                statusManager.messagesQueue.push({
                    type: "code",
                    message: code
                })
            }
        }
        socket.OnCodeChangeListener(codeChange)
        const positionChange = (position: Position) => {
            successCallback && successCallback({
                coords: {
                    accuracy: 0,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    latitude: position.latitude,
                    longitude: position.longitude,
                    speed: null,
                },
                timestamp: position.time
            })
        }
        socket.OnPositionChangeListener(positionChange)
        // connect to room
        socket.Join()
        let id : number = Math.floor(Math.random() * 100000)
        this.observers.set(id, {
            socket,
            status: statusManager,
            operations: {
                join: socket.Join
            },
            dump: {
                statusChange,
                codeChange,
                positionChange
            }
        })
        return id
    }

    watchStatus(watchId: number, statusCallback: ({type, message} : StatusMessageItemType) => void) : void {
        const watcher = this.observers.get(watchId)
        if(watcher) {
            const status = watcher.status as StatusType
            status.callback = statusCallback
            status.messagesQueue.forEach(item => statusCallback(item))
            status.messagesQueue = []
        }
    }

    watchOperations(watchId: number) : any {
        const watcher = this.observers.get(watchId)
        if(watcher) {
            return watcher.operations
        }
    }

    clearWatch(watchId: number): void {
        const watcher = this.observers.get(watchId)
        if(watcher) {
            // remove listeners
            watcher.socket.RemoveOnStatusChangeListener(watcher.dump.statusChange)
            watcher.socket.RemoveOnCodeChangeListener(watcher.dump.codeChange)
            watcher.socket.RemoveOnPositionChangeListener(watcher.dump.positionChange)
            watcher.socket.Disconnect()
            this.observers.delete(watchId)
        }
    }
}

export function MobileSocket() {

    const socket = io(process.env.REACT_APP_REMOTE_GPS_SOCKET_SERVER!, {
        path: "/mobile-location",
        query: { role: device.MOBILE }
    })

    return {
        Join(code: string) {
            socket.emit("join", code)
        },
        UpdatePosition(position: Position) {
            socket.emit("position", position)
        },
        OnErrorListener(callback: (error: string | Error) => void) {
            socket.on("error", callback)
            socket.on("connect_error", callback)
        },
        RemoveOnErrorListener(callback: (error: string | Error) => void) {
            socket.off("error", callback)
            socket.off("connect_error", callback)
        },
        OnConnectedListener(callback: () => void) {
            socket.on("connected", callback)
        },
        RemoveOnConnectedListener(callback: () => void) {
            socket.off("connected", callback)
        },
        Disconnect() {
            socket.disconnect()
        }
    }
}