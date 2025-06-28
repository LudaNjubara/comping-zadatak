
import { ChartWidget } from '@/app/features/widget/chart/chart-widget/chart-widget';
import { GenericTable, TableColumn } from '@/app/shared/components/elements/table/generic-table/generic-table';
import { CommonModule } from '@angular/common';
import { Component, computed, Input, Signal } from '@angular/core';
import {
    ChartWidgetConfig,
    ChartWrapperConfig,
    DataTransformer,
    MultiChartDataSet
} from '../chart.types';

@Component({
    selector: 'app-chart-wrapper',
    imports: [CommonModule, ChartWidget, GenericTable],
    templateUrl: './chart-wrapper.html',
    styleUrl: './chart-wrapper.css'
})
export class ChartWrapper {
    @Input({ required: true }) data: any;
    @Input() tableColumns: TableColumn<any>[] = [];
    @Input({ required: true }) config!: ChartWrapperConfig;
    @Input({ required: true }) transformFn!: DataTransformer;

    processedChartData: Signal<MultiChartDataSet> = computed(() => {
        return this.transformFn(this.data);
    });

    processedTableData: Signal<any[]> = computed(() => {

        const chartData = this.processedChartData();
        if (!chartData.datasets[0]) return [];

        const dataset = chartData.datasets[0];
        return dataset.labels.map((label, index) => ({
            [this.tableColumns[0].key]: label,
            [this.tableColumns[1].key]: dataset.data[index]
        }));
    });

    chartConfig: Signal<ChartWidgetConfig> = computed(() => {
        return {
            type: this.config.chartType,
            height: this.config.height,
            width: this.config.width,
        };
    });
}