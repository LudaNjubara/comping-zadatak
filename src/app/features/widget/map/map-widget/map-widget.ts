import { MapItemsList } from '@/app/features/widget/map/components/map-items-list/map-items-list';
import { MapItem } from '@/app/features/widget/map/map.types';
import { MapStateService } from '@/app/features/widget/map/services/map-state.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-widget',
  imports: [CommonModule, MapItemsList],
  templateUrl: './map-widget.html',
  styleUrl: './map-widget.css'
})
export class MapWidget implements AfterViewInit {
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  map: L.Map | null = null;
  currentMarker: L.Marker | null = null;
  mapReady = false;

  constructor(protected mapState: MapStateService) { }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    try {
      this.fixDefaultMarkers();

      // Use center from selected item or default center
      const centerCoords = this.getInitialCenter();

      // Create map
      this.map = L.map(this.mapElement.nativeElement, {
        zoom: this.mapState.defaultZoom(),
        center: L.latLng(centerCoords[0], centerCoords[1])
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.mapReady = true;

      // Initialize with items if available - defer to next tick to avoid ExpressionChangedAfterItHasBeenCheckedError
      if (this.mapState.hasLocations()) {
        setTimeout(() => {
          this.initializeDefaultSelection();
        }, 0);
      }

    } catch (error) {
      console.error('Failed to initialize map:', error);
      this.mapState.setError('Failed to initialize map');
    }
  }

  private getInitialCenter(): [number, number] {
    // Use selected location from state service
    const selectedLocation = this.mapState.selectedLocation();
    if (selectedLocation) {
      return [selectedLocation.lat, selectedLocation.lng];
    }

    // If there are locations, use the first one
    const locations = this.mapState.locations();
    if (locations.length > 0) {
      return [locations[0].lat, locations[0].lng];
    }

    // Use default center
    return this.mapState.defaultCenter();
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

  private initializeDefaultSelection(): void {
    if (this.mapState.hasLocations() && this.mapReady) {
      const selectedLocation = this.mapState.selectedLocation();
      if (selectedLocation) {
        this.updateMapForLocation(selectedLocation);
      } else {
        // Select first location if none selected
        const locations = this.mapState.locations();
        if (locations.length > 0) {
          this.mapState.selectLocation(locations[0].id);
        }
      }
    }
  }

  selectItem(item: MapItem): void {
    if (!this.mapReady) return;

    this.updateMapMarker(item);
    this.centerMapOnItem(item);

    // Update state service
    this.mapState.selectLocation(item.id);
  }

  private updateMapForLocation(location: MapItem): void {
    this.updateMapMarker(location);
    this.centerMapOnItem(location);
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
      this.map.setView([item.lat, item.lng], this.mapState.defaultZoom());
    }
  }

  onItemSelected(item: MapItem): void {
    this.selectItem(item);
  }
}
