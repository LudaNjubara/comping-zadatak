import { CHART_WIDGET_OPTIONS } from '@/app/features/widget/chart/chart.constants';
import { ChartWidgetConfig, MultiChartDataSet } from '@/app/features/widget/chart/chart.types';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

/**
 * ChartWidget component displays various types of charts using Chart.js.
 */
@Component({
  selector: 'app-chart-widget',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart-widget.html',
  styleUrl: './chart-widget.css'
})
export class ChartWidget implements OnChanges {
  @Input() data: MultiChartDataSet | null = null;
  @Input() chartConfig: ChartWidgetConfig = {
    type: 'line',
    width: 600,
    height: 400,
  }

  chartData: ChartData<any> = {
    labels: [],
    datasets: []
  };

  chartOptions = CHART_WIDGET_OPTIONS;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['chartType']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.data) return;

    this.processMultiDataSet(this.data);
  }

  private processMultiDataSet(multiDataSet: MultiChartDataSet): void {
    this.chartData = {
      labels: multiDataSet.labels,
      datasets: multiDataSet.datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor,
        borderColor: dataset.borderColor,
        borderWidth: dataset.borderWidth || 2,
        fill: dataset.fill || false,
        tension: 0.4
      }))
    };
  }
}
