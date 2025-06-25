import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PokemonStateService } from '@/app/features/pokemon/services/pokemon-state.service';

@Component({
  selector: 'app-pokemon-detail',
  imports: [CommonModule],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.css'
})
export class PokemonDetailPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private pokemonName: string = '';
  private returnPage: number = 1;

  constructor(
    private pokemonStateService: PokemonStateService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // Expose state service signals
  get pokemon() { return this.pokemonStateService.currentPokemon; }
  get loading() { return this.pokemonStateService.loading; }
  get error() { return this.pokemonStateService.error; }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.pokemonName = params['name'];
      this.loadPokemonData();
    });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.returnPage = params['returnPage'] ? +params['returnPage'] : 1;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadPokemonData(): Promise<void> {
    if (!this.pokemonName) return;

    await this.pokemonStateService.loadPokemonDetails(this.pokemonName);
  }

  retryLoad(): void {
    this.loadPokemonData();
  }

  goBack(): void {
    this.router.navigate(['/pokemon'], {
      queryParams: { page: this.returnPage }
    });
  }

  formatStatName(statName: string): string {
    return statName
      .replace('-', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
