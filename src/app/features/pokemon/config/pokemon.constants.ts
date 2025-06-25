import { APP_CONFIG } from '@/app/core/config/app.config';

export const POKEMON_CONSTANTS = {
    MAX_TOTAL_RESULTS: APP_CONFIG.pokemon.maxResults,
    DEFAULT_PAGE_SIZE: APP_CONFIG.pokemon.defaultPageSize
} as const;
