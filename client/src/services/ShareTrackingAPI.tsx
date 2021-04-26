import axios from "axios"
import Record from "../models/Record"

const instance = axios.create({
    baseURL: process.env.REACT_APP_SHARE_TRACKING_SERVER
})

export function upload(tracking : Record) {
    return instance.post("/share-tracking", tracking)
}

export function download(hash : string) {
    return instance.get("/share-tracking", {data:{hash}})
}

export default {
    upload,
    download
}