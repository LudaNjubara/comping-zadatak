import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MapItem } from '../../map.types';

@Component({
    selector: 'app-map-items-list',
    imports: [CommonModule],
    templateUrl: './map-items-list.html',
    styleUrl: './map-items-list.css'
})
export class MapItemsList {
    @Input() items: MapItem[] = [];
    @Input() selectedItemId: string | null = null;
    @Input() title: string = 'Locations';

    @Output() itemSelected = new EventEmitter<MapItem>();

    onItemClick(item: MapItem): void {
        this.itemSelected.emit(item);
    }
}
