const { v4: uuid } = require('uuid')

class RoomsStore {

    constructor() {
        this.rooms = new Map()
    }

    find(code) {
        return this.rooms.get(code)
    }

    has(code) {
        return code && (this.rooms.get(code) !== undefined)
    }

    create() {
        const code = uuid()
        const room = {
            recorder: undefined,
            mobile: undefined,
        }
        this.rooms.set(code, room)
        return code
    }

    remove(code) {
        this.rooms.delete(code)
    }

    joinRecorder(room_code, recorder_code) {
        let room = this.rooms.get(room_code)
        room.recorder = recorder_code
    }

    removeRecorder(room_code) {
        let room = this.rooms.get(room_code)
        room.recorder = undefined
    }

    hasRecorder(room_code, recorder_code) {
        return (recorder_code !== undefined) ? (this.rooms.get(room_code).recorder === recorder_code) : (this.rooms.get(room_code).recorder !== undefined)
    }

    getRecorder(room_code) {
        return this.rooms.get(room_code).recorder
    }

    getRecorderRoom(recorder_code) {
        for(const [k, v] of this.rooms.entries())
            if(v.recorder === recorder_code)
                return k
        return undefined
    }

    joinMobile(room_code, mobile_code) {
        let room = this.rooms.get(room_code)
        room.mobile = mobile_code
    }

    removeMobile(room_code) {
        let room = this.rooms.get(room_code)
        room.mobile = undefined
    }

    hasMobile(room_code) {
        return this.rooms.get(room_code).mobile !== undefined
    }

    getMobile(room_code) {
        return this.rooms.get(room_code).mobile
    }

    getMobileRoom(mobile_code) {
        for(const [k, v] of this.rooms.entries())
            if(v.mobile === mobile_code)
                return k
        return undefined
    }
}
const roomStore = new RoomsStore()

module.exports = roomStore