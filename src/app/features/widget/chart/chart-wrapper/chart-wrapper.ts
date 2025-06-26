
import { ChartWidget } from '@/app/features/widget/chart/chart-widget/chart-widget';
import { ChartStateService } from '@/app/features/widget/chart/services/chart-state.service';
import { GenericTable } from '@/app/shared/components/elements/table/generic-table/generic-table';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChartTypeRegistry } from 'chart.js';

@Component({
    selector: 'app-chart-wrapper',
    imports: [CommonModule, ChartWidget, GenericTable],
    templateUrl: './chart-wrapper.html',
    styleUrl: './chart-wrapper.css'
})
export class ChartWrapper implements OnInit {
    @Input() widgetTitle?: string;
    @Input() currentChartType: keyof ChartTypeRegistry = 'line';
    @Input() data: any;
    @Input() chartTitle?: string;
    @Input() withTable: boolean = false;
    @Input() tableData: any[] = [];
    @Input() tableColumns: any[] = [];

    constructor(private chartState: ChartStateService) { }

    ngOnInit(): void {
        // Sync input values with chart state if they differ
        if (this.currentChartType !== this.chartState.currentChartType()) {
            this.chartState.setChartType(this.currentChartType);
        }

        if (this.withTable !== this.chartState.showTable()) {
            this.chartState.setShowTable(this.withTable);
        }
    }
}
