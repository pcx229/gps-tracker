const fs = require('fs');
const httpsServer = require("https").createServer({
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
})
const port = 3005
const io = require("socket.io")(httpsServer, {
    path: "/mobile-location",
    cors: {
        origin: '*'
    }
})
const roomsStore = require("./rooms")

const DEVICE_RECORDER = "recorder", 
        DEVICE_MOBILE = "mobile"

const MOBILE_ERROR_ROOM_CLOSED = "Error: room has been closed",
        MOBILE_ERROR_ROOM_DOSE_NOT_EXIST = "Error: room dose not exist",
        MOBILE_ERROR_ROOM_ALREADY_IN_USE_BY_OTHER_SOURCE = "Error: room already in use by other source"

const RECORDER_STATUS_MOBILE_NOT_CONNECTED = "mobile not connected",
        RECORDER_STATUS_MOBILE_IS_CONNECTED = "mobile is connected"

function recorder(socket) {
    console.log("incomming connection [role=recorder ,id=" + socket.id + "]")
    // leave room
    const leaveRoom = () => {
        const old_room = roomsStore.getRecorderRoom(socket.id)
        if(old_room) {
            // notify mobile room closed
            const mobile = roomsStore.getMobile(old_room)
            if(mobile)
                socket.to(mobile).emit("error", MOBILE_ERROR_ROOM_CLOSED)
            // delete room
            roomsStore.remove(old_room)
            console.log("recorder left room [id=" + socket.id + ", room=" + old_room + "]")
        }
    }
    // join a room
    socket.on("join", () => {
        // disconnect from old room
        leaveRoom()
        // connect to new room
        const room = roomsStore.create()
        roomsStore.joinRecorder(room, socket.id)
        // notify recorder of room
        socket.emit("code", room)
        socket.emit("status", RECORDER_STATUS_MOBILE_NOT_CONNECTED)
        console.log("recorder joined room [id=" + socket.id + ", room=" + room + "]")
    })
    // leave
    socket.on("disconnect", () => {
        // disconnect from room
        leaveRoom()
        console.log("recorder disconnected [id=" + socket.id + "]")
    })
}

function mobile(socket) {
    console.log("incomming connection [role=mobile ,id=" + socket.id + "]")
    // leave room
    const leaveRoom = () => {
        const room = roomsStore.getMobileRoom(socket.id)
        if(room) {
            // notify recorder mobile left
            const recorder = roomsStore.getRecorder(room)
            if(recorder)
                socket.to(recorder).emit("status", RECORDER_STATUS_MOBILE_NOT_CONNECTED)
            // leave room
            roomsStore.removeMobile(room, socket.id)
            console.log("mobile left room [id=" + socket.id + ", room=" + room + "]")
        }
    }
    // join a room
    socket.on("join", room => {
        // handle errors
        if(!roomsStore.has(room)) {
            console.log("mobile error room dose not exist [id=" + socket.id + ", room=" + room + "]")
            socket.emit("error", MOBILE_ERROR_ROOM_DOSE_NOT_EXIST)
            return
        } else if((other = roomsStore.getMobile(room)) !== undefined && other !== socket.id) {
            console.log("mobile error room in use already [id=" + socket.id + ", room=" + room + ", by=" + other + "]")
            socket.emit("error", MOBILE_ERROR_ROOM_ALREADY_IN_USE_BY_OTHER_SOURCE)
            return
        }
        // disconnect from old room
        leaveRoom()
        // join the room
        roomsStore.joinMobile(room, socket.id)
        // notify recoder mobile joined
        const recorder = roomsStore.getRecorder(room)
        socket.to(recorder).emit("status", RECORDER_STATUS_MOBILE_IS_CONNECTED)
        // notify mobile is connected
        socket.emit("connected")
        console.log("mobile joined room [id=" + socket.id + ", room=" + room + "]")
    })
    // report position
    socket.on("position", location => {
        const room = roomsStore.getMobileRoom(socket.id)
        const recorder = roomsStore.getRecorder(room)
        socket.to(recorder).emit("position", location)
        console.log("mobile report position [id=" + socket.id + "]")
    })
    // leave
    socket.on("disconnect", () => {
        // disconnect from room
        leaveRoom()
        console.log("mobile disconnected [id=" + socket.id + "]")
    })
}

io.on("connection", (socket) => {
    const { role } = socket.handshake.query
    switch(role) {
        case DEVICE_RECORDER:
            recorder(socket)
            break
        case DEVICE_MOBILE:
            mobile(socket)
            break
    }
})

httpsServer.listen(port, () => {
    console.log(`listening on port ${port}`)
});