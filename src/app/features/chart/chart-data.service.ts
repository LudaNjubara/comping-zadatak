import { ChartAggregationType, ChartDataSet, MultiChartDataSet } from '@/app/features/chart/chart.types';
import { TimeData, TimeItem } from '@/types/global.types';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ChartDataService {

    /**
     * Transform time-based data depending on the aggregation type
     */
    transformTimeData(timeData: TimeData, aggregation: ChartAggregationType = "hourly"): ChartDataSet {
        switch (aggregation) {
            case 'hourly':
                return this.aggregateByHour(timeData);
            default:
                const _: never = aggregation;
                throw new Error(`Unsupported aggregation type: ${aggregation}`);
        }
    }

    /**
     * Aggregate data by hour
     */
    private aggregateByHour(timeData: TimeData): ChartDataSet {
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
            label: 'Hourly Average',
            labels: sortedEntries.map(([hour]) => hour),
            data: sortedEntries.map(([, value]) => value)
        };
    }

    /**
     * Create a simple chart dataset from arrays of labels and data
     */
    createSimpleDataSet(labels: string[], data: number[], label: string = 'Dataset'): ChartDataSet {
        return {
            label,
            labels,
            data
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

    /**
     * Get time series data from TimeData for direct chart display
     */
    getTimeSeriesData(timeData: TimeData): ChartDataSet {
        const allDataPoints: { time: Date; value: number }[] = [];

        // Flatten all time data points
        Object.entries(timeData).forEach(([hourKey, items]) => {
            items.forEach((item: TimeItem) => {
                allDataPoints.push({
                    time: new Date(item.timestampStart),
                    value: item.value
                });
            });
        });

        // Sort by time
        allDataPoints.sort((a, b) => a.time.getTime() - b.time.getTime());

        // Extract labels and data
        const labels = allDataPoints.map(point =>
            point.time.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        );
        const values = allDataPoints.map(point => point.value);

        return {
            label: 'Time Series Data',
            labels,
            data: values
        };
    }

    /**
     * Create a multi-dataset chart from multiple ChartDataSets
     */
    createMultiDataSet(labels: string[], datasets: Omit<ChartDataSet, 'labels'>[]): MultiChartDataSet {
        return {
            labels,
            datasets: datasets.map(dataset => ({
                ...dataset,
                labels // Add labels to each dataset for consistency
            }))
        };
    }

    /**
     * Combine multiple TimeData aggregations into a single chart
     */
    createComparisonChart(timeDataSets: { data: TimeData; label: string; color?: string }[]): MultiChartDataSet {
        const allLabels = new Set<string>();
        const datasets: ChartDataSet[] = [];

        // Process each dataset
        timeDataSets.forEach(({ data, label, color }, index) => {
            const aggregated = this.aggregateByHour(data);

            // Collect all unique labels
            aggregated.labels.forEach(l => allLabels.add(l));

            datasets.push({
                ...aggregated,
                label,
                borderColor: color || `hsl(${index * 60}, 70%, 50%)`,
                backgroundColor: color ? `${color}20` : `hsla(${index * 60}, 70%, 50%, 0.1)`
            });
        });

        const sortedLabels = Array.from(allLabels).sort();

        // Align all datasets to have the same labels
        const alignedDatasets = datasets.map(dataset => {
            const alignedData = sortedLabels.map(label => {
                const index = dataset.labels.indexOf(label);
                return index >= 0 ? dataset.data[index] : 0;
            });

            return {
                ...dataset,
                labels: sortedLabels,
                data: alignedData
            };
        });

        return {
            labels: sortedLabels,
            datasets: alignedDatasets
        };
    }
}
