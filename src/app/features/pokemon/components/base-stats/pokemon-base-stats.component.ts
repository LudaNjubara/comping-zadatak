import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

interface PokemonStat {
    stat: {
        name: string;
    };
    base_stat: number;
}

@Component({
    selector: 'app-pokemon-base-stats',
    imports: [NgFor],
    template: `
    <section class="stats-section">
      <h3 class="section-title">Base Stats</h3>
      <div class="stats-container">
        <div
          *ngFor="let stat of stats"
          class="stat-bar gradient-border-card"
        >
          <div class="stat-info">
            <span class="stat-name">{{ formatStatName(stat.stat.name) }}</span>
            <span class="stat-number">{{ stat.base_stat }}</span>
          </div>
          <div
            class="stat-progress"
            role="progressbar"
            [attr.aria-valuenow]="stat.base_stat"
            aria-valuemin="0"
            aria-valuemax="255"
          >
            <div
              class="stat-fill"
              [style.width.%]="(stat.base_stat / 255) * 100"
              [attr.data-stat]="stat.stat.name"
            ></div>
          </div>
        </div>
      </div>
    </section>
  `,
    styleUrl: './pokemon-base-stats.component.css'
})
export class PokemonBaseStatsComponent {
    @Input({ required: true }) stats!: PokemonStat[];

    formatStatName(statName: string): string {
        return statName
            .replace('-', ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}
