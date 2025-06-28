import { Component, EventEmitter, Output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { heroChevronLeft } from '@ng-icons/heroicons/outline';

@Component({
    selector: 'app-pokemon-navigation',
    imports: [NgIcon],
    templateUrl: './pokemon-navigation.component.html',
    styleUrl: './pokemon-navigation.component.css'
})
export class PokemonNavigationComponent {
    @Output() backClick = new EventEmitter<void>();

    chevronLeftIcon = heroChevronLeft;

    onBackClick(): void {
        this.backClick.emit();
    }
}
