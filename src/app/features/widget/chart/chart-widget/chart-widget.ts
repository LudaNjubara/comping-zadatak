import { ChartDataSet, ChartWidgetType, MultiChartDataSet } from '@/app/features/widget/chart/chart.types';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnChanges, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
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
  @Input() chartType: ChartWidgetType = 'line';
  @Input() data: ChartDataSet | MultiChartDataSet | null = null;
  @Input() title?: string;
  @Input() width: number = 600;
  @Input() height: number = 400;
  @Input() responsive: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
  ) { }

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  chartData: ChartData<any> = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true
        }
      },
      y: {
        display: true,
        grid: {
          display: true
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['chartType']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.data) return;

    if (this.isMultiDataSet(this.data)) {
      this.processMultiDataSet(this.data);
    } else {
      this.processSingleDataSet(this.data);
    }
  }

  private isMultiDataSet(data: ChartDataSet | MultiChartDataSet): data is MultiChartDataSet {
    return 'datasets' in data;
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

  private processSingleDataSet(dataSet: ChartDataSet): void {
    this.chartData = {
      labels: dataSet.labels,
      datasets: [{
        label: dataSet.label,
        data: dataSet.data,
        backgroundColor: dataSet.backgroundColor,
        borderColor: dataSet.borderColor,
        borderWidth: dataSet.borderWidth || 2,
        fill: dataSet.fill || false,
        tension: 0.4
      }]
    };
  }
}
