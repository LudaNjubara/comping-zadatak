import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TABLE_CONFIGS } from '@/app/core/config/table.config';
import { PokemonStateService } from '@/app/features/pokemon/services/pokemon-state.service';
import { PokemonTableData } from '@/app/features/pokemon/services/pokemon.service';
import { GenericTable } from '@/app/shared/components/elements/table/generic-table/generic-table';
import { PaginationConfig, TablePagination } from '@/app/shared/components/elements/table/table-pagination/table-pagination';

@Component({
  selector: 'app-pokemon-page',
  imports: [CommonModule, GenericTable, TablePagination],
  templateUrl: './pokemon-page.html',
  styleUrl: './pokemon-page.css'
})
export class PokemonPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Get table columns from configuration
  columns = TABLE_CONFIGS.pokemon;

  // Create pagination config based on state
  get paginationConfig(): PaginationConfig {
    const pagination = this.pokemonState.pagination();
    return {
      currentPage: pagination.currentPage,
      totalItems: pagination.totalItems,
      itemsPerPage: pagination.itemsPerPage,
      hasNext: pagination.hasNext,
      hasPrevious: pagination.hasPrevious
    };
  }

  constructor(
    protected pokemonState: PokemonStateService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const page = params['page'] ? + params['page'] : 1;
      this.pokemonState.loadPokemon(page);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRowClick(pokemon: PokemonTableData): void {
    const pagination = this.pokemonState.pagination();
    this.router.navigate(['/pokemon', pokemon.name.toLowerCase()], {
      queryParams: { returnPage: pagination.currentPage }
    });
  }

  onPageChange(page: number): void {
    this.navigateToPage(page);
  }

  onFirstPage(): void {
    this.navigateToPage(1);
  }

  private navigateToPage(page: number): void {
    const currentPage = this.pokemonState.pagination().currentPage;
    if (currentPage === page || this.pokemonState.loading()) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      replaceUrl: true
    });
  }
}
