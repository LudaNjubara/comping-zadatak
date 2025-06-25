import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  type?: 'string' | 'number' | 'date' | 'image';
}

@Component({
  selector: 'app-generic-table',
  imports: [CommonModule],
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.css'
})
export class GenericTable<T> {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() emptyMessage: string = 'No data available';
  @Input() showRowNumbers: boolean = false;
  @Input() clickableRows: boolean = false;

  @Output() rowClick = new EventEmitter<T>();

  // Sorting
  sortColumn: keyof T | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  get sortedData(): T[] {
    if (!this.sortColumn) {
      return this.data;
    }

    return [...this.data].sort((a, b) => {
      const aVal = a[this.sortColumn!];
      const bVal = b[this.sortColumn!];

      let comparison = 0;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  onSort(column: TableColumn<T>): void {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(column: TableColumn<T>): string {
    if (!column.sortable || this.sortColumn !== column.key) {
      return '↕️';
    }
    return this.sortDirection === 'asc' ? '⬆️' : '⬇️';
  }

  // Add method to check if column is currently sorted
  isColumnSorted(column: TableColumn<T>): boolean {
    return this.sortColumn === column.key;
  }

  // Add method to get CSS class for number cells
  getCellClass(column: TableColumn<T>): string {
    return column.type === 'number' ? 'number' : '';
  }

  onRowClick(row: T): void {
    if (this.clickableRows) {
      this.rowClick.emit(row);
    }
  }

  formatValue(value: any, column: TableColumn<T>): string {
    if (value == null) return '';

    switch (column.type) {
      case 'number':
        return typeof value === 'number' ? value.toFixed(2) : String(value);
      case 'date':
        return value instanceof Date ? value.toLocaleDateString() : String(value);
      case 'image':
        return ''; // Images will be handled separately in template
      default:
        return String(value);
    }
  }
}
