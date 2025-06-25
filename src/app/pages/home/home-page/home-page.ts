import { ChartDataService } from '@/app/features/chart/chart-data.service';
import { ChartView } from '@/app/features/chart/chart-view/chart-view';
import { ChartDataSet, ChartViewType } from '@/app/features/chart/chart.types';
import { sampleLocations } from '@/app/features/map/sample-locations';
import { TimeData } from '@/types/global.types';
import { Component, OnInit } from '@angular/core';

import { MapView } from '@/app/features/map/map-view/map-view';
import { GenericTable, TableColumn } from '@/app/shared/components/elements/table/generic-table/generic-table';
import podaciData from '@/data/podaci.json';

@Component({
  selector: 'app-home-page',
  imports: [MapView, ChartView, GenericTable],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {

  locations = sampleLocations;
  selectedLocationId = sampleLocations[0].id;

  timeSeriesData: TimeData = {};
  hourlyData: ChartDataSet | null = null;
  simpleChartData: ChartDataSet | null = null;

  // Table data for hourly data display
  hourlyTableData: { time: string; value: number }[] = [];
  hourlyTableColumns: TableColumn<{ time: string; value: number }>[] = [
    { key: 'time', label: 'Time', sortable: true, type: 'string' },
    { key: 'value', label: 'Average Value', sortable: true, type: 'number' }
  ];

  // Table data for peak values
  peakValuesTableData: { time: string; value: number; rank: number }[] = [];
  peakValuesTableColumns: TableColumn<{ time: string; value: number; rank: number }>[] = [
    { key: 'rank', label: 'Rank', sortable: true, type: 'number' },
    { key: 'time', label: 'Time', sortable: true, type: 'string' },
    { key: 'value', label: 'Peak Value', sortable: true, type: 'number' }
  ];

  chartTypes: ChartViewType[] = ['line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea', "scatter"];
  currentChartType: ChartViewType = 'line';

  constructor(private chartDataService: ChartDataService) { }

  ngOnInit(): void {
    // Load the JSON data
    this.timeSeriesData = podaciData as TimeData;

    // Transform data for different chart types
    this.hourlyData = this.chartDataService.transformTimeData(this.timeSeriesData, 'hourly');

    // Prepare table data from hourly data
    this.prepareHourlyTableData();
  }

  private prepareHourlyTableData(): void {
    if (this.hourlyData) {
      this.hourlyTableData = this.hourlyData.labels.map((time, index) => ({
        time: time,
        value: Number(this.hourlyData!.data[index].toFixed(2))
      }));
    }
  }
}
