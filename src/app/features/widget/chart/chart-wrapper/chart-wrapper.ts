
import { ChartWidget } from '@/app/features/widget/chart/chart-widget/chart-widget';
import { GenericTable } from '@/app/shared/components/elements/table/generic-table/generic-table';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartTypeRegistry } from 'chart.js';

@Component({
    selector: 'app-chart-wrapper',
    imports: [CommonModule, ChartWidget, GenericTable],
    templateUrl: './chart-wrapper.html',
    styleUrl: './chart-wrapper.css'
})
export class ChartWrapper {
    @Input() widgetTitle?: string;
    @Input() currentChartType: keyof ChartTypeRegistry = 'line';
    @Input() data: any;
    @Input() chartTitle?: string;
    @Input() withTable: boolean = false;
    @Input() tableData: any[] = [];
    @Input() tableColumns: any[] = [];

    constructor() { }
}
