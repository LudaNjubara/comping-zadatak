import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pokemon-error',
  template: `
    <section class="error-container" role="alert">
      <div class="error-icon" aria-hidden="true">⚠️</div>
      <h3 class="error-title">{{ errorTitle || 'Pokémon not found' }}</h3>
      <p class="error-message">{{ errorMessage }}</p>
      <button class="retry-button" (click)="onRetryClick()">Try Again</button>
    </section>
  `,
  styleUrl: './pokemon-error.component.css'
})
export class PokemonErrorComponent {
  @Input() errorTitle?: string;
  @Input() errorMessage: string = '';
  @Output() retryClick = new EventEmitter<void>();

  onRetryClick(): void {
    this.retryClick.emit();
  }
}
