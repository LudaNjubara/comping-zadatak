import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

interface PokemonAbility {
    ability: {
        name: string;
    };
    is_hidden: boolean;
}

@Component({
    selector: 'app-pokemon-abilities',
    imports: [NgFor, NgIf, TitleCasePipe],
    template: `
    <article class="info-card gradient-border-card">
      <h3 class="info-title">Abilities</h3>
      <div class="abilities-container">
        <div
          *ngFor="let ability of abilities"
          class="ability-item"
          [class.hidden]="ability.is_hidden"
        >
          <span class="ability-name">{{ ability.ability.name | titlecase }}</span>
          <span
            *ngIf="ability.is_hidden"
            class="hidden-tag"
            aria-label="Hidden ability"
          >
            Hidden
          </span>
        </div>
      </div>
    </article>
  `,
    styleUrl: './pokemon-abilities.component.css'
})
export class PokemonAbilitiesComponent {
    @Input({ required: true }) abilities!: PokemonAbility[];
}
