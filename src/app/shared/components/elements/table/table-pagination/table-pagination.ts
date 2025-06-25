import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface PaginationConfig {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

@Component({
    selector: 'app-table-pagination',
    imports: [CommonModule],
    template: `
    <div class="pagination-container">
      <div class="pagination-info">
        <span class="info-text">
          Showing {{ startItem }} - {{ endItem }} of {{ config.totalItems }} items
        </span>
      </div>
      
      <div class="pagination-controls">
        <button 
          class="pagination-btn first-page"
          [disabled]="config.currentPage === 1"
          (click)="goToFirstPage()"
          title="First page">
          ⏮️ First
        </button>
        
        <button 
          class="pagination-btn prev"
          [disabled]="!config.hasPrevious"
          (click)="previousPage()"
          title="Previous page">
          ⬅️ Previous
        </button>
        
        <span class="page-info">
          Page {{ config.currentPage }} of {{ totalPages }}
        </span>
        
        <button 
          class="pagination-btn next"
          [disabled]="!config.hasNext"
          (click)="nextPage()"
          title="Next page">
          Next ➡️
        </button>
      </div>
    </div>
  `,
    styles: [`
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--padding-lg);
      background: var(--secondary-color-800);
      border-top: 1px solid var(--secondary-color-600);
      border-radius: 0 0 var(--border-radius-sm) var(--border-radius-sm);
    }

    .pagination-info {
      color: var(--secondary-color-300);
      font-size: var(--text-sm);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: var(--padding-sm);
    }

    .pagination-btn {
      padding: var(--padding-sm) var(--padding-md);
      background: var(--secondary-color-700);
      color: var(--text-color);
      border: 1px solid var(--secondary-color-600);
      border-radius: var(--border-radius-xs);
      cursor: pointer;
      font-size: var(--text-sm);
      transition: all 0.2s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      background: var(--primary-color-600);
      border-color: var(--primary-color-500);
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      color: var(--secondary-color-400);
    }

    .pagination-btn.first-page {
      font-weight: var(--font-medium);
    }

    .page-info {
      padding: 0 var(--padding-md);
      color: var(--text-color);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
    }

    @media (max-width: 768px) {
      .pagination-container {
        flex-direction: column;
        gap: var(--padding-md);
      }
      
      .pagination-controls {
        justify-content: center;
      }
      
      .pagination-btn {
        padding: var(--padding-xs) var(--padding-sm);
        font-size: var(--text-xs);
      }
    }
  `]
})
export class TablePagination {
    @Input() config: PaginationConfig = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNext: false,
        hasPrevious: false
    };

    @Output() pageChange = new EventEmitter<number>();
    @Output() firstPage = new EventEmitter<void>();

    get totalPages(): number {
        return Math.ceil(this.config.totalItems / this.config.itemsPerPage);
    }

    get startItem(): number {
        return (this.config.currentPage - 1) * this.config.itemsPerPage + 1;
    }

    get endItem(): number {
        return Math.min(this.config.currentPage * this.config.itemsPerPage, this.config.totalItems);
    }

    nextPage(): void {
        if (this.config.hasNext) {
            this.pageChange.emit(this.config.currentPage + 1);
        }
    }

    previousPage(): void {
        if (this.config.hasPrevious) {
            this.pageChange.emit(this.config.currentPage - 1);
        }
    }

    goToFirstPage(): void {
        this.firstPage.emit();
        this.pageChange.emit(1);
    }
}
