
import TrackerHistory from "./TrackerHistory"
import Record from "../models/Record"

export default class LocalStorageTrackerHistory implements TrackerHistory {
    
    private history : Record[] = [];

    static LOCAL_STORAGE_TAG : string = 'tracker-history';

    constructor() {
        this.fetchAll = this.fetchAll.bind(this)
        this.saveHistoryDataCallback = this.saveHistoryDataCallback.bind(this)
        this.loadHistoryDataCallback = this.loadHistoryDataCallback.bind(this)
        this.add = this.add.bind(this)
        this.get = this.get.bind(this)
        this.remove = this.remove.bind(this)
        this.clear = this.clear.bind(this)
        // load
        this.loadHistoryDataCallback()
    }

    private saveHistoryDataCallback() : void {
        localStorage.setItem(LocalStorageTrackerHistory.LOCAL_STORAGE_TAG, JSON.stringify(this.history))
    }

    private loadHistoryDataCallback() : void {
        const history = localStorage.getItem(LocalStorageTrackerHistory.LOCAL_STORAGE_TAG)
        if(history !== null) {
            this.history = JSON.parse(history) || []
        }
    }

    async fetchAll(): Promise<Record[]> {
		this.loadHistoryDataCallback()
        return this.history
    }

    async add(record: Record): Promise<void> {
		this.loadHistoryDataCallback()
        this.history = [...this.history, record]
        this.saveHistoryDataCallback()
    }

    async get(id: string): Promise<Record> {
        return this.history.filter((record) => String(record.startTime) === id)[0]
    }

    async remove(id: string): Promise<void> {
		this.loadHistoryDataCallback()
        const index = this.history.findIndex((record) => String(record.startTime) === id)
		let temp = [...this.history]
		if (index > -1) {
			temp.splice(index, 1)
		}
		this.history = temp
        this.saveHistoryDataCallback()
    }

    async clear(): Promise<void> {
        this.history = []
        this.saveHistoryDataCallback()
    }
}