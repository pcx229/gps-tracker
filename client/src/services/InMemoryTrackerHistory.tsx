import Record from "../models/Record"
import TrackerHistory from "./TrackerHistory"

export default class InMemoryTrackerHistory implements TrackerHistory {

    private history : Record[] = [];

    constructor() {
        this.fetchAll = this.fetchAll.bind(this)
        this.add = this.add.bind(this)
        this.get = this.get.bind(this)
        this.remove = this.remove.bind(this)
        this.clear = this.clear.bind(this)
    }

    async fetchAll(): Promise<Record[]> { return this.history }

    async add(record : Record) : Promise<void> {
        this.history = [...this.history, record]
    }

    async get(id: string): Promise<Record> {
        return this.history.filter((record) => String(record.startTime) === id)[0]
    }

    async remove(id: string): Promise<void> {
        this.history = this.history.filter((record) => String(record.startTime) === id)
    }

    async clear(): Promise<void> {
        this.history = []
    }
}