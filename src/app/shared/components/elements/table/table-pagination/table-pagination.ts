import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { heroArrowLeft, heroArrowRight } from '@ng-icons/heroicons/outline';

export interface PaginationConfig {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Component({
  selector: 'app-table-pagination',
  imports: [CommonModule, NgIcon],
  templateUrl: './table-pagination.html',
  styleUrl: './table-pagination.css'
})
export class TablePagination {
  // Icons
  arrowRight = heroArrowRight;
  arrowLeft = heroArrowLeft;

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
