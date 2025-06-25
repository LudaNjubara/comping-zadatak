import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { APP_CONFIG } from '@/app/core/config/app.config';
import { ErrorHandlerService } from '@/app/core/services/error-handler.service';
import { Pokemon, PokemonService, PokemonTableData } from './pokemon.service';

export interface PaginationState {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PokemonStateService {
    private readonly _pokemon = signal<PokemonTableData[]>([]);
    private readonly _currentPokemon = signal<Pokemon | null>(null);
    private readonly _loading = signal(false);
    private readonly _error = signal<string | null>(null);
    private readonly _pagination = signal<PaginationState>({
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: APP_CONFIG.pokemon.defaultPageSize,
        hasNext: false,
        hasPrevious: false
    });

    // Read-only computed signals
    readonly pokemon = this._pokemon.asReadonly();
    readonly currentPokemon = this._currentPokemon.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly pagination = this._pagination.asReadonly();

    // Computed values
    readonly totalPages = computed(() => {
        const pagination = this._pagination();
        return Math.ceil(pagination.totalItems / pagination.itemsPerPage);
    });

    constructor(
        private pokemonService: PokemonService,
        private errorHandler: ErrorHandlerService
    ) { }

    async loadPokemon(page: number = 1): Promise<void> {
        this._loading.set(true);
        this._error.set(null);

        try {
            const offset = (page - 1) * APP_CONFIG.pokemon.defaultPageSize;
            const response = await firstValueFrom(
                this.pokemonService.getPokemonTableData(APP_CONFIG.pokemon.defaultPageSize, offset)
            );

            this._pokemon.set(response.data);
            this._pagination.set({
                currentPage: page,
                totalItems: response.total,
                itemsPerPage: APP_CONFIG.pokemon.defaultPageSize,
                hasNext: response.hasNext,
                hasPrevious: response.hasPrevious
            });
        } catch (error) {
            const errorMessage = this.errorHandler.handleError(error, 'PokemonStateService.loadPokemon');
            this._error.set(errorMessage);
        } finally {
            this._loading.set(false);
        }
    }

    async loadPokemonDetails(name: string): Promise<void> {
        this._loading.set(true);
        this._error.set(null);

        try {
            const pokemon = await firstValueFrom(
                this.pokemonService.getPokemonDetails(name)
            );
            this._currentPokemon.set(pokemon);
        } catch (error) {
            const errorMessage = this.errorHandler.handleError(error, 'PokemonStateService.loadPokemonDetails');
            this._error.set(errorMessage);
            this._currentPokemon.set(null);
        } finally {
            this._loading.set(false);
        }
    }

    clearCurrentPokemon(): void {
        this._currentPokemon.set(null);
    }

    clearError(): void {
        this._error.set(null);
    }
}
