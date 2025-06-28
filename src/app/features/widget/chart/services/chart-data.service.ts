import { ChartAggregationType, ChartDataSet, MultiChartDataSet } from '@/app/features/widget/chart/chart.types';
import { TimeData, TimeItem } from '@/types/global.types';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ChartDataService {

    /**
     * Transform time-based data depending on the aggregation type
     */
    transformTimeData(timeData: TimeData, aggregation: ChartAggregationType = "hourly", datasetLabel: string): MultiChartDataSet {
        switch (aggregation) {
            case 'hourly':
                return this.aggregateByHour(timeData, datasetLabel);
            default:
                const _: never = aggregation;
                throw new Error(`Unsupported aggregation type: ${aggregation}`);
        }
    }

    /**
     * Aggregate data by hour
     */
    private aggregateByHour(timeData: TimeData, datasetLabel: string): MultiChartDataSet {
        const hourlyAggregation: { [hour: string]: number } = {};

        Object.entries(timeData).forEach(([hourKey, items]) => {
            const hourStart = new Date(hourKey);
            const hourLabel = hourStart.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            const hourTotal = items.reduce((sum: number, item: TimeItem) => sum + item.value, 0);
            const itemsPerHour = items.length;
            hourlyAggregation[hourLabel] = (hourlyAggregation[hourLabel] || 0) + (hourTotal / itemsPerHour);
        });

        const sortedEntries = Object.entries(hourlyAggregation).sort(([a], [b]) => a.localeCompare(b));

        return {
            labels: sortedEntries.map(([hour]) => hour),
            datasets: [{
                label: datasetLabel,
                labels: sortedEntries.map(([hour]) => hour),
                data: sortedEntries.map(([, value]) => value)
            }]
        };
    }

    /**
     * Create a chart dataset with styling options
     */
    createStyledDataSet(
        labels: string[],
        data: number[],
        label: string = 'Dataset',
        options: {
            backgroundColor?: string | string[];
            borderColor?: string | string[];
            borderWidth?: number;
            fill?: boolean;
        } = {}
    ): ChartDataSet {
        return {
            label,
            labels,
            data,
            ...options
        };
    }
}
