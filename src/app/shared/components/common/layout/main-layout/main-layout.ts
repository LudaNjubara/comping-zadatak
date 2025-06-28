import { MetadataService } from '@/app/core/services/metadata.service';
import { Footer } from '@/app/shared/components/common/footer/footer/footer';
import { Header } from '@/app/shared/components/common/header/header/header';
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit {
  private metadataService = inject(MetadataService);
  private router = inject(Router);

  ngOnInit(): void {
    // Set default metadata
    this.metadataService.resetToDefault();

    // Optional: Reset to default on route changes if needed
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // You can add logic here to reset metadata for specific routes
        // or let individual pages handle their own metadata
      });
  }
}
