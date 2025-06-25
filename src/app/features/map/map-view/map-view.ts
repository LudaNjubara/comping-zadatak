import { MapItemsList } from '@/app/features/map/components/map-items-list/map-items-list';
import { MapItem } from '@/app/features/map/map.types';
import { sampleLocations } from '@/app/features/map/sample-locations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  imports: [CommonModule, MapItemsList],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css'
})
export class MapView implements OnChanges, AfterViewInit {
  @Input() items: MapItem[] = [];
  @Input() selectedItemId: string | null = null;
  @Input() defaultCenter: [number, number] = [sampleLocations[0].lat, sampleLocations[0].lng];
  @Input() defaultZoom: number = 10;

  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  map: L.Map | null = null;
  selectedItem: MapItem | null = null;
  currentMarker: L.Marker | null = null;
  mapReady = false;

  constructor() { }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    try {
      this.fixDefaultMarkers();

      // Create map
      this.map = L.map(this.mapElement.nativeElement, {
        zoom: this.defaultZoom,
        center: L.latLng(this.defaultCenter[0], this.defaultCenter[1])
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.mapReady = true;

      // Initialize with items if available - defer to next tick to avoid ExpressionChangedAfterItHasBeenCheckedError
      if (this.items.length > 0) {
        setTimeout(() => {
          this.initializeDefaultSelection();
        }, 0);
      }

    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }

  private fixDefaultMarkers(): void {
    // Fix for default marker icons
    try {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    } catch (error) {
      console.warn('Failed to fix default markers:', error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.mapReady) return;

    if (changes['items'] && this.items.length > 0) {
      setTimeout(() => {
        this.initializeDefaultSelection();
      }, 0);
    }

    if (changes['selectedItemId'] || changes['items']) {
      setTimeout(() => {
        this.updateSelectedItem();
      }, 0);
    }
  }

  private initializeDefaultSelection(): void {
    if (this.items.length > 0 && !this.selectedItem && this.mapReady) {
      const defaultItem = this.selectedItemId
        ? this.items.find(item => item.id === this.selectedItemId) || this.items[0]
        : this.items[0];

      this.selectItem(defaultItem);
    }
  }

  private updateSelectedItem(): void {
    if (this.selectedItemId && this.mapReady) {
      const item = this.items.find(item => item.id === this.selectedItemId);
      if (item) {
        this.selectItem(item);
      }
    }
  }

  selectItem(item: MapItem): void {
    if (!this.mapReady) return;

    this.selectedItem = item;
    this.updateMapMarker(item);
    this.centerMapOnItem(item);
  }

  private updateMapMarker(item: MapItem): void {
    if (!this.mapReady) return;

    // Remove existing marker
    if (this.currentMarker && this.map) {
      this.map.removeLayer(this.currentMarker);
    }

    // Create new marker
    const customIcon = L.icon({
      iconUrl: item.icon || 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.currentMarker = L.marker([item.lat, item.lng], { icon: customIcon })
      .bindPopup(`<strong>${item.name}</strong><br>${item.description || ''}`);

    // Add marker to map
    if (this.map) {
      this.currentMarker.addTo(this.map);
    }
  }

  private centerMapOnItem(item: MapItem): void {
    if (this.map && this.mapReady) {
      this.map.setView([item.lat, item.lng], this.defaultZoom);
    }
  }

  onItemSelected(item: MapItem): void {
    this.selectItem(item);
  }
}
