import { Component, Input } from '@angular/core';

interface PokemonType {
    type: {
        name: string;
    };
}

interface Pokemon {
    name: string;
    sprites: {
        front_default: string;
    };
    types: PokemonType[];
}

@Component({
    selector: 'app-pokemon-image',
    template: `
    <aside class="pokemon-image-section">
      <div class="image-container">
        <div
          class="gradient-border-2"
          [attr.data-primary-type]="pokemon.types[0].type.name"
        >
          <div class="pokemon-container with-stripes">
            <div class="noise" aria-hidden="true"></div>
            <img
              [src]="pokemon.sprites.front_default"
              [alt]="pokemon.name + ' sprite'"
              class="pokemon-main-image"
            />
          </div>
        </div>
      </div>
    </aside>
  `,
    styleUrl: './pokemon-image.component.css'
})
export class PokemonImageComponent {
    @Input({ required: true }) pokemon!: Pokemon;
}
