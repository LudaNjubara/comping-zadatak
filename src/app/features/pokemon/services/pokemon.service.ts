import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { APP_CONFIG } from '@/app/core/config/app.config';
import { ErrorHandlerService } from '@/app/core/services/error-handler.service';
import { capitalizeFirstLetter } from '@/utils/string.utils';

export interface PokemonListItem {
    name: string;
    url: string;
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
}

export interface PokemonSprites {
    front_default: string;
    front_shiny: string;
    back_default: string;
    back_shiny: string;
}

export interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
}

export interface PokemonAbility {
    ability: {
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
}

export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: PokemonSprites;
    types: PokemonType[];
    stats: PokemonStat[];
    abilities: PokemonAbility[];
    base_experience: number;
}

export interface PokemonTableData {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: string;
    image: string;
}

export interface PokemonListResult {
    data: PokemonTableData[];
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PokemonService {
    private readonly baseUrl = APP_CONFIG.api.baseUrl;

    constructor(
        private http: HttpClient,
        private errorHandler: ErrorHandlerService
    ) { }

    /**
     * Get list of Pokemon with pagination
     */
    getPokemonList(limit: number = APP_CONFIG.pokemon.defaultPageSize, offset: number = 0): Observable<PokemonListResponse> {
        return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`)
            .pipe(
                catchError(error => {
                    this.errorHandler.logError(error, 'PokemonService.getPokemonList');
                    throw error;
                })
            );
    }

    /**
     * Get detailed Pokemon data
     */
    getPokemon(name: string): Observable<Pokemon> {
        return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${name}`)
            .pipe(
                catchError(error => {
                    this.errorHandler.logError(error, 'PokemonService.getPokemon');
                    throw error;
                })
            );
    }

    /**
     * Get Pokemon data formatted for table display
     */
    getPokemonTableData(limit: number = APP_CONFIG.pokemon.defaultPageSize, offset: number = 0): Observable<PokemonListResult> {
        return this.getPokemonList(limit, offset).pipe(
            switchMap(response => {
                // Get detailed data for each Pokemon in the list
                const pokemonRequests = response.results.map(pokemon =>
                    this.getPokemon(pokemon.name)
                );

                return forkJoin(pokemonRequests).pipe(
                    map(pokemonDetails => ({
                        data: pokemonDetails.map(pokemon => ({
                            id: pokemon.id,
                            name: capitalizeFirstLetter(pokemon.name),
                            height: pokemon.height,
                            weight: pokemon.weight,
                            types: pokemon.types.map(t => capitalizeFirstLetter(t.type.name)).join(', '),
                            image: pokemon.sprites.front_default || ''
                        })),
                        total: Math.min(response.count, APP_CONFIG.pokemon.maxResults),
                        hasNext: response.next !== null && offset + limit < APP_CONFIG.pokemon.maxResults,
                        hasPrevious: response.previous !== null
                    }))
                );
            }),
            catchError(error => {
                this.errorHandler.logError(error, 'PokemonService.getPokemonTableData');
                throw error;
            })
        );
    }

    /**
     * Get detailed Pokemon data by name or ID
     */
    getPokemonDetails(name: string): Observable<Pokemon> {
        return this.getPokemon(name);
    }
}
