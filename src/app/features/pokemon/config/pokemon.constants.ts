import { APP_CONFIG } from '@/app/core/config/app.config';

export const POKEMON_CONSTANTS = {
    MAX_TOTAL_RESULTS: APP_CONFIG.pokemon.maxResults,
    DEFAULT_PAGE_SIZE: APP_CONFIG.pokemon.defaultPageSize
} as const;

export const pokemonTypes = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic',
    'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel',
    'fairy', 'stellar'] as const;