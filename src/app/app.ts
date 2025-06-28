import { APP_CONFIG } from '@/app/core/config/app.config';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  providers: [provideIcons({ heroUsers })],
  styleUrl: './app.css'
})
export class App {
  title = APP_CONFIG.site.name;
}
