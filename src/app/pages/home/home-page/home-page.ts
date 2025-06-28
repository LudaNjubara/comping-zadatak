
import { Component, OnInit, inject } from '@angular/core';

import { TABLE_CONFIGS } from '@/app/core/config/table.config';
import { MetadataService } from '@/app/core/services/metadata.service';
import { ChartWrapper } from '@/app/features/widget/chart/chart-wrapper/chart-wrapper';
import { ChartWrapperConfig } from '@/app/features/widget/chart/chart.types';
import { ChartDataService } from '@/app/features/widget/chart/services/chart-data.service';
import { MapWrapper } from '@/app/features/widget/map/map-wrapper/map-wrapper';
import { MapStateService } from '@/app/features/widget/map/services/map-state.service';
import { TableColumn } from '@/app/shared/components/elements/table/generic-table/generic-table';
import podaciData from '@/data/podaci.json';

interface Charts {
  [key: string]: {
    data: any;
    tableData?: any[];
    tableColumns: TableColumn<any>[];
    config: ChartWrapperConfig;
    transformFn: (data: any) => any;
  };
}

@Component({
  selector: 'app-home-page',
  imports: [ChartWrapper, MapWrapper],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  private metadataService = inject(MetadataService);

  ngOnInit(): void {
    this.metadataService.updateMetadata({
      title: this.metadataService.createPageTitle('Dashboard'),
      description: 'Interaktivni dashboard s widgetima za prikaz podataka, grafova i mapa.',
      keywords: 'dashboard, charts, maps, data visualization, analytics',
      ogTitle: this.metadataService.createPageTitle('Dashboard'),
      ogDescription: 'Interaktivni dashboard s widgetima za prikaz podataka, grafova i mapa.',
      ogUrl: window.location.href
    });
  }
  charts: Charts = {
    timeChart: {
      data: podaciData,
      tableColumns: TABLE_CONFIGS.hourlyData,
      config: {
        chartType: 'line',
        showTable: true,
        height: 300
      },
      transformFn: (data: any): any => {
        return this.chartDataService.transformTimeData(data, 'hourly', 'Hourly Time Data');
      }
    },
  };

  constructor(protected mapState: MapStateService, protected chartDataService: ChartDataService) { }
}
