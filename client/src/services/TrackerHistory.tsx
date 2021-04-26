import Record from "../models/Record"

export default interface TrackerHistory {

    fetchAll() : Promise<Record[]>;

    add(record : Record) : Promise<void>;

    get(id : string) : Promise<Record>;

    remove(id : string) : Promise<void>;

    clear(): Promise<void>;
}
