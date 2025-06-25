
export interface TimeItem {
    timestampStart: string;
    timestampEnd: string;
    value: number;
}

export interface TimeData {
    [key: string]: TimeItem[];
}