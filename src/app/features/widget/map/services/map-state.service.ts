import { sampleLocations } from '@/data/sample-locations';
import { computed, Injectable, signal } from '@angular/core';
import { MapItem } from '../map.types';

export interface MapState {
    selectedLocationId: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class MapStateService {
    private readonly STORAGE_KEY = 'mapState';

    private readonly _locations = signal<MapItem[]>(sampleLocations);
    private readonly _selectedLocationId = signal<string | null>(null);
    private readonly _defaultZoom = signal<number>(13);
    private readonly _defaultCenter = signal<[number, number]>([45.8150, 15.9819]); // Default to Zagreb coordinates
    private readonly _loading = signal(false);
    private readonly _error = signal<string | null>(null);

    // Read-only computed signals
    readonly locations = this._locations.asReadonly();
    readonly selectedLocationId = this._selectedLocationId.asReadonly();
    readonly defaultZoom = this._defaultZoom.asReadonly();
    readonly defaultCenter = this._defaultCenter.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    // Computed values
    readonly selectedLocation = computed(() => {
        const id = this._selectedLocationId();
        return this.getLocationById(id);
    });

    readonly hasLocations = computed(() => this._locations().length > 0);

    constructor() {
        this.initializeFromStorage();
    }

    /**
     * Initialize map state from session storage
     */
    private initializeFromStorage(): void {
        try {
            const savedState = sessionStorage.getItem(this.STORAGE_KEY);
            if (savedState) {
                const state: Partial<MapState> = JSON.parse(savedState);

                if (state.selectedLocationId) {
                    this._selectedLocationId.set(state.selectedLocationId);
                }
            } else {
                // Set default selection if no saved state
                this.setDefaultSelection();
            }
        } catch (error) {
            console.warn('Failed to load map state from storage:', error);
            this.setDefaultSelection();
        }
    }

    /**
     * Set default selection to first location
     */
    private setDefaultSelection(): void {
        const locations = this._locations();
        if (locations.length > 0) {
            this.selectLocation(locations[0].id);
        }
    }

    /**
     * Save current state to session storage
     */
    private saveToStorage(): void {
        try {
            const state: MapState = {
                selectedLocationId: this._selectedLocationId()
            };
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save map state to storage:', error);
        }
    }

    /**
     * Select a location by ID
     */
    selectLocation(locationId: string): void {
        const location = this.getLocationById(locationId);
        if (location) {
            this._selectedLocationId.set(locationId);
            this.saveToStorage();
        } else {
            console.warn(`Location with ID ${locationId} not found`);
        }
    }

    /**
     * Set locations data
     */
    setLocations(locations: MapItem[]): void {
        this._locations.set(locations);

        // If no location is selected or selected location doesn't exist, select first one
        const currentSelected = this._selectedLocationId();
        if (!currentSelected || !locations.find(loc => loc.id === currentSelected)) {
            if (locations.length > 0) {
                this.selectLocation(locations[0].id);
            }
        }

        this.saveToStorage();
    }

    /**
     * Set the default center of the map
     */
    setDefaultCenter(center: [number, number]): void {
        this._defaultCenter.set(center);
    }

    /**
     * Set default zoom level
     */
    setDefaultZoom(zoom: number): void {
        this._defaultZoom.set(zoom);
        this.saveToStorage();
    }

    /**
     * Get location by ID
     */
    getLocationById(id: string | null): MapItem | null {
        return id ? this._locations().find(location => location.id === id) || null : null;
    }

    /**
     * Clear selected location
     */
    clearSelection(): void {
        this._selectedLocationId.set(null);
        this.saveToStorage();
    }

    /**
     * Clear all state and storage
     */
    clearState(): void {
        this._selectedLocationId.set(null);
        this._defaultZoom.set(13);
        this._error.set(null);

        try {
            sessionStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.warn('Failed to clear map state from storage:', error);
        }

        // Reset to default selection
        this.setDefaultSelection();
    }

    /**
     * Set error state
     */
    setError(error: string | null): void {
        this._error.set(error);
    }

    /**
     * Set loading state
     */
    setLoading(loading: boolean): void {
        this._loading.set(loading);
    }
}