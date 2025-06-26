
import { Component, OnInit } from '@angular/core';

import { ChartWrapper } from '@/app/features/widget/chart/chart-wrapper/chart-wrapper';
import { ChartStateService } from '@/app/features/widget/chart/services/chart-state.service';
import { MapWrapper } from '@/app/features/widget/map/map-wrapper/map-wrapper';
import { MapStateService } from '@/app/features/widget/map/services/map-state.service';

@Component({
  selector: 'app-home-page',
  imports: [ChartWrapper, MapWrapper],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {

  constructor(
    protected mapState: MapStateService,
    protected chartState: ChartStateService
  ) { }

  ngOnInit(): void {
    // Initialize chart data
    this.chartState.loadTimeSeriesData();
  }
}
