import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

interface Pokemon {
    name: string;
    id: number;
}

@Component({
    selector: 'app-pokemon-header',
    imports: [TitleCasePipe],
    template: `
    <header class="pokemon-header">
      <h1 class="pokemon-name">{{ pokemon.name | titlecase }}</h1>
      <span class="pokemon-id" aria-label="Pokemon ID">
        #{{ pokemon.id.toString().padStart(3, '0') }}
      </span>
    </header>
  `,
    styleUrl: './pokemon-header.component.css'
})
export class PokemonHeaderComponent {
    @Input({ required: true }) pokemon!: Pokemon;
}
