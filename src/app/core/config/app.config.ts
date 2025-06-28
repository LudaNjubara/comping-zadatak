export const APP_CONFIG = {
    site: {
        name: 'CompingZadatak',
    },
    api: {
        baseUrl: 'https://pokeapi.co/api/v2',
        timeout: 10000
    },
    pagination: {
        defaultPageSize: 10,
        maxPageSize: 100
    },
    pokemon: {
        maxResults: 100,
        defaultPageSize: 10
    },
    map: {
        defaultZoom: 10,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
} as const;

export type AppConfig = typeof APP_CONFIG;
