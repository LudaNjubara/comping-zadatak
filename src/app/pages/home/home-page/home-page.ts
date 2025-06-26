
import { TimeData } from '@/types/global.types';
import { Component, OnInit } from '@angular/core';

import { ChartDataService } from '@/app/features/widget/chart/chart-data.service';
import { ChartWrapper } from '@/app/features/widget/chart/chart-wrapper/chart-wrapper';
import { ChartDataSet } from '@/app/features/widget/chart/chart.types';
import { MapWrapper } from '@/app/features/widget/map/map-wrapper/map-wrapper';
import { MapStateService } from '@/app/features/widget/map/services/map-state.service';
import podaciData from '@/data/podaci.json';

@Component({
  selector: 'app-home-page',
  imports: [ChartWrapper, MapWrapper],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {

  timeSeriesData: TimeData = {};
  hourlyData: ChartDataSet | null = null;
  hourlyTableData: Array<{ time: string; value: number }> = [];
  hourlyTableColumns = [
    { key: 'time', label: 'Time' },
    { key: 'value', label: 'Value' }
  ];

  constructor(
    private chartDataService: ChartDataService,
    protected mapState: MapStateService
  ) { }

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
