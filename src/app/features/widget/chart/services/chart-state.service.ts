import { computed, Injectable, signal } from '@angular/core';

import podaciData from '@/data/podaci.json';
import { TimeData } from '@/types/global.types';
import { ChartAggregationType, ChartWidgetType } from '../chart.types';
import { ChartDataService } from './chart-data.service';

export interface ChartState {
    currentChartType: ChartWidgetType;
    aggregationType: ChartAggregationType;
    showTable: boolean;
}

export interface TableColumn {
    key: string;
    label: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChartStateService {
    private readonly STORAGE_KEY = 'chartState';

    private readonly _timeSeriesData = signal<TimeData>(podaciData as TimeData);
    private readonly _currentChartType = signal<ChartWidgetType>('line');
    private readonly _aggregationType = signal<ChartAggregationType>('hourly');
    private readonly _showTable = signal<boolean>(true);
    private readonly _loading = signal(false);
    private readonly _error = signal<string | null>(null);

    // Read-only computed signals
    readonly timeSeriesData = this._timeSeriesData.asReadonly();
    readonly currentChartType = this._currentChartType.asReadonly();
    readonly aggregationType = this._aggregationType.asReadonly();
    readonly showTable = this._showTable.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    // Computed values
    readonly chartData = computed(() => {
        try {
            const timeData = this._timeSeriesData();
            const aggregation = this._aggregationType();

            if (!timeData || Object.keys(timeData).length === 0) {
                return null;
            }

            return this.chartDataService.transformTimeData(timeData, aggregation);
        } catch (error) {
            console.error('Error computing chart data:', error);
            this._error.set('Failed to process chart data');
            return null;
        }
    });

    readonly tableData = computed(() => {
        const chartData = this.chartData();
        if (!chartData) return [];

        return chartData.labels.map((time, index) => ({
            time: time,
            value: Number(chartData.data[index].toFixed(2))
        }));
    });

    readonly tableColumns = computed((): TableColumn[] => [
        { key: 'time', label: 'Time' },
        { key: 'value', label: 'Value' }
    ]);

    readonly hasData = computed(() => {
        const data = this.chartData();
        return data !== null && data.data.length > 0;
    });

    readonly chartTitle = computed(() => {
        const aggregation = this._aggregationType();
        switch (aggregation) {
            case 'hourly':
                return 'Hourly Averages';
            default:
                return 'Chart Data';
        }
    });

    constructor(private chartDataService: ChartDataService) {
        this.initializeFromStorage();
    }

    /**
     * Initialize chart state from session storage
     */
    private initializeFromStorage(): void {
        try {
            const savedState = sessionStorage.getItem(this.STORAGE_KEY);
            if (savedState) {
                const state: Partial<ChartState> = JSON.parse(savedState);

                if (state.currentChartType) {
                    this._currentChartType.set(state.currentChartType);
                }

                if (state.aggregationType) {
                    this._aggregationType.set(state.aggregationType);
                }

                if (typeof state.showTable === 'boolean') {
                    this._showTable.set(state.showTable);
                }
            }
        } catch (error) {
            console.warn('Failed to load chart state from storage:', error);
        }
    }

    /**
     * Save current state to session storage
     */
    private saveToStorage(): void {
        try {
            const state: ChartState = {
                currentChartType: this._currentChartType(),
                aggregationType: this._aggregationType(),
                showTable: this._showTable()
            };
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save chart state to storage:', error);
        }
    }

    /**
     * Set chart type
     */
    setChartType(chartType: ChartWidgetType): void {
        this._currentChartType.set(chartType);
        this.saveToStorage();
    }

    /**
     * Set aggregation type
     */
    setAggregationType(aggregationType: ChartAggregationType): void {
        this._aggregationType.set(aggregationType);
        this.saveToStorage();
    }

    /**
     * Toggle table visibility
     */
    toggleTable(): void {
        this._showTable.set(!this._showTable());
        this.saveToStorage();
    }

    /**
     * Set table visibility
     */
    setShowTable(show: boolean): void {
        this._showTable.set(show);
        this.saveToStorage();
    }

    /**
     * Set time series data
     */
    setTimeSeriesData(data: TimeData): void {
        this._timeSeriesData.set(data);
        this._error.set(null);
    }

    /**
     * Load time series data from JSON file or API
     */
    async loadTimeSeriesData(source?: TimeData): Promise<void> {
        this._loading.set(true);
        this._error.set(null);

        try {
            if (source) {
                this.setTimeSeriesData(source);
            } else {
                // Use default data from JSON file
                this.setTimeSeriesData(podaciData as TimeData);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load chart data';
            this._error.set(errorMessage);
            console.error('Error loading time series data:', error);
        } finally {
            this._loading.set(false);
        }
    }

    /**
     * Get available chart types
     */
    getAvailableChartTypes(): ChartWidgetType[] {
        return ['line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea'];
    }

    /**
     * Get available aggregation types
     */
    getAvailableAggregationTypes(): ChartAggregationType[] {
        return ['hourly'];
    }

    /**
     * Reset state to defaults
     */
    resetState(): void {
        this._currentChartType.set('line');
        this._aggregationType.set('hourly');
        this._showTable.set(true);
        this._error.set(null);

        try {
            sessionStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.warn('Failed to clear chart state from storage:', error);
        }
    }

    /**
     * Set error state
     */
    setError(error: string | null): void {
        this._error.set(error);
    }

    /**
     * Set loading state
     */
    setLoading(loading: boolean): void {
        this._loading.set(loading);
    }

    /**
     * Clear error state
     */
    clearError(): void {
        this._error.set(null);
    }
}
