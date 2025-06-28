import { Component } from '@angular/core';

@Component({
    selector: 'app-pokemon-loading',
    template: `
    <section class="loading-container" aria-live="polite">
      <div class="loading-spinner" aria-hidden="true"></div>
      <p class="loading-text">Loading Pokémon details...</p>
    </section>
  `,
    styleUrl: './pokemon-loading.component.css'
})
export class PokemonLoadingComponent { }
