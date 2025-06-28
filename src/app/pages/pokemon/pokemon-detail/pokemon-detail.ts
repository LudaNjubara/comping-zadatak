import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MetadataService } from '@/app/core/services/metadata.service';
import { PokemonAbilitiesComponent } from '@/app/features/pokemon/components/abilities/pokemon-abilities.component';
import { PokemonBaseStatsComponent } from '@/app/features/pokemon/components/base-stats/pokemon-base-stats.component';
import { PokemonErrorComponent } from '@/app/features/pokemon/components/error/pokemon-error.component';
import { PokemonHeaderComponent } from '@/app/features/pokemon/components/header/pokemon-header.component';
import { PokemonImageComponent } from '@/app/features/pokemon/components/image/pokemon-image.component';
import { PokemonLoadingComponent } from '@/app/features/pokemon/components/loading/pokemon-loading.component';
import { PokemonNavigationComponent } from '@/app/features/pokemon/components/navigation/pokemon-navigation.component';
import { PokemonPhysicalStatsComponent } from '@/app/features/pokemon/components/physical-stats/pokemon-physical-stats.component';
import { PokemonTypesComponent } from '@/app/features/pokemon/components/types/pokemon-types.component';
import { PokemonStateService } from '@/app/features/pokemon/services/pokemon-state.service';

@Component({
  selector: 'app-pokemon-detail',
  imports: [
    CommonModule,
    PokemonNavigationComponent,
    PokemonLoadingComponent,
    PokemonErrorComponent,
    PokemonImageComponent,
    PokemonHeaderComponent,
    PokemonPhysicalStatsComponent,
    PokemonTypesComponent,
    PokemonAbilitiesComponent,
    PokemonBaseStatsComponent
  ],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.css'
})
export class PokemonDetailPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private metadataService = inject(MetadataService);

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

    // Update metadata when Pokemon data is loaded
    const pokemon = this.pokemon();
    if (pokemon) {
      const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      const pokemonId = pokemon.id.toString().padStart(3, '0');

      this.metadataService.updateMetadata({
        title: `${pokemonName} (#${pokemonId}) - Pokemon Directory`,
        description: `Detaljne informacije o ${pokemonName} Pokemon-u. Pogledajte statistike, sposobnosti, tipove i više. Visina: ${pokemon.height / 10}m, Težina: ${pokemon.weight / 10}kg.`,
        keywords: `${pokemon.name}, pokemon, stats, abilities, ${pokemon.types.map(t => t.type.name).join(', ')}`,
        ogTitle: this.metadataService.createPageTitle(`${pokemonName} (#${pokemonId})`),
        ogDescription: `Detaljne informacije o ${pokemonName} Pokemon-u. ${pokemon.types.map(t => t.type.name).join('/')} tip.`,
        ogImage: pokemon.sprites.front_default || undefined,
        ogUrl: window.location.href
      });
    }
  }

  retryLoad(): void {
    this.loadPokemonData();
  }

  goBack(): void {
    this.router.navigate(['/pokemon'], {
      queryParams: { page: this.returnPage }
    });
  }
}
