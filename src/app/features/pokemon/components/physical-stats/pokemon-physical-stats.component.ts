import { Component, Input } from '@angular/core';

interface Pokemon {
    height: number;
    weight: number;
    base_experience: number;
}

@Component({
    selector: 'app-pokemon-physical-stats',
    template: `
    <article class="info-card gradient-border-card">
      <h3 class="info-title">Physical</h3>
      <div class="info-content">
        <div class="stat-item">
          <span class="stat-label">Height:</span>
          <span class="stat-value">{{ (pokemon.height / 10).toFixed(1) }} m</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Weight:</span>
          <span class="stat-value">{{ (pokemon.weight / 10).toFixed(1) }} kg</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Base Experience:</span>
          <span class="stat-value">{{ pokemon.base_experience }}</span>
        </div>
      </div>
    </article>
  `,
    styleUrl: './pokemon-physical-stats.component.css'
})
export class PokemonPhysicalStatsComponent {
    @Input({ required: true }) pokemon!: Pokemon;
}
