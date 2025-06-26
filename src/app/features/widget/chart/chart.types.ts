import { ChartTypeRegistry } from "chart.js";

export type ChartAggregationType = 'hourly';

export type ChartWidgetType = keyof ChartTypeRegistry

export interface ChartDataSet {
    label: string;
    data: number[];
    labels: string[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
}

export interface MultiChartDataSet {
    labels: string[];
    datasets: ChartDataSet[];
}