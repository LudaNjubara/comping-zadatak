import { TableColumn } from '@/app/shared/components/elements/table/generic-table/generic-table';

export const TABLE_CONFIGS = {
    pokemon: [
        { key: 'id', label: 'ID', sortable: true, type: 'number' },
        { key: 'image', label: 'Image', sortable: false, type: 'image' },
        { key: 'name', label: 'Name', sortable: true, type: 'string' },
        { key: 'height', label: 'Height', sortable: true, type: 'number' },
        { key: 'weight', label: 'Weight', sortable: true, type: 'number' },
        { key: 'types', label: 'Types', sortable: true, type: 'string' }
    ] as TableColumn<any>[],

    hourlyData: [
        { key: 'time', label: 'Time', sortable: true, type: 'string' },
        { key: 'value', label: 'Average Value', sortable: true, type: 'number' }
    ] as TableColumn<any>[],

    peakValues: [
        { key: 'rank', label: 'Rank', sortable: true, type: 'number' },
        { key: 'time', label: 'Time', sortable: true, type: 'string' },
        { key: 'value', label: 'Peak Value', sortable: true, type: 'number' }
    ] as TableColumn<any>[]
} as const;
