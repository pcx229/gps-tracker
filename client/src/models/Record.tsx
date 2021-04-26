import Path from "./Path";

export default interface Record {
    startTime: number;
    endTime: number;
    path: Path;
    tag: string;
}