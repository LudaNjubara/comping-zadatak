import { NgFor, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

interface PokemonType {
    type: {
        name: string;
    };
}

@Component({
    selector: 'app-pokemon-types',
    imports: [NgFor, TitleCasePipe],
    template: `
    <article class="info-card gradient-border-card">
      <h3 class="info-title">Types</h3>
      <div class="types-container">
        <span
          *ngFor="let type of types"
          class="type-badge"
          [attr.data-type]="type.type.name"
          [attr.aria-label]="type.type.name + ' type'"
        >
          {{ type.type.name | titlecase }}
        </span>
      </div>
    </article>
  `,
    styleUrl: './pokemon-types.component.css'
})
export class PokemonTypesComponent {
    @Input({ required: true }) types!: PokemonType[];
}
