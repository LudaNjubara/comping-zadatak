import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-pokemon-page-header',
    template: `
    <header class="page-header">
      <h1 class="pokemon-page-title">{{ title }}</h1>
    </header>
  `,
    styleUrl: './pokemon-page-header.component.css'
})
export class PokemonPageHeaderComponent {
    @Input({ required: true }) title!: string;
}
