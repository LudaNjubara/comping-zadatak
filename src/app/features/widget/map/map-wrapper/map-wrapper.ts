
import { MapWidget } from '@/app/features/widget/map/map-widget/map-widget';
import { MapItem } from '@/app/features/widget/map/map.types';
import { MapStateService } from '@/app/features/widget/map/services/map-state.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-map-wrapper',
    imports: [CommonModule, MapWidget],
    templateUrl: './map-wrapper.html',
    styleUrl: './map-wrapper.css'
})
export class MapWrapper implements OnInit {
    @Input() widgetTitle?: string;
    @Input() items: MapItem[] = [];
    @Input() defaultZoom: number = 13;
    @Input() defaultCenter?: [number, number];

    constructor(protected mapState: MapStateService) { }

    ngOnInit(): void {
        if (this.items.length > 0) {
            this.mapState.setLocations(this.items);
        }

        if (this.defaultCenter) {
            this.mapState.setDefaultCenter(this.defaultCenter);
        }

        if (this.defaultZoom !== 13) {
            this.mapState.setDefaultZoom(this.defaultZoom);
        }
    }
}
