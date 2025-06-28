import { APP_CONFIG } from '@/app/core/config/app.config';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface PageMetadata {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
}

@Injectable({
    providedIn: 'root'
})
export class MetadataService {
    private titleService = inject(Title);
    private metaService = inject(Meta);

    private defaultMetadata: PageMetadata = {
        title: APP_CONFIG.site.name,
        description: 'Angular aplikacija koja sadrži dashboard s widgetima za prikaz interaktivne mape i podataka u grafičkom/tabličnom prikazu. Također uključuje pregled Pokemon-a s detaljnim informacijama.',
        keywords: 'Angular, Dashboard, Pokemon, Charts, Maps, Widgets',
        ogTitle: APP_CONFIG.site.name,
        ogDescription: 'Angular aplikacija s dashboardom i Pokemon pregledom',
        ogImage: '/images/og-image.jpg',
        twitterCard: 'summary_large_image'
    };

    updateMetadata(metadata: Partial<PageMetadata>): void {
        const finalMetadata = { ...this.defaultMetadata, ...metadata };

        // Update title
        if (finalMetadata.title) {
            this.titleService.setTitle(finalMetadata.title);
        }

        // Update or add meta tags
        this.updateMetaTag('description', finalMetadata.description);
        this.updateMetaTag('keywords', finalMetadata.keywords);

        // Open Graph tags
        this.updateMetaTag('og:title', finalMetadata.ogTitle, 'property');
        this.updateMetaTag('og:description', finalMetadata.ogDescription, 'property');
        this.updateMetaTag('og:image', finalMetadata.ogImage, 'property');
        this.updateMetaTag('og:url', finalMetadata.ogUrl, 'property');
        this.updateMetaTag('og:type', 'website', 'property');
        this.updateMetaTag('og:site_name', APP_CONFIG.site.name, 'property');

        // Twitter Card tags
        this.updateMetaTag('twitter:card', finalMetadata.twitterCard, 'name');
        this.updateMetaTag('twitter:title', finalMetadata.twitterTitle);
        this.updateMetaTag('twitter:description', finalMetadata.twitterDescription);
        this.updateMetaTag('twitter:image', finalMetadata.twitterImage);
    }

    private updateMetaTag(name: string, content?: string, attribute: string = 'name'): void {
        if (!content) return;

        const selector = `${attribute}="${name}"`;

        if (this.metaService.getTag(selector)) {
            this.metaService.updateTag({ [attribute]: name, content });
        } else {
            this.metaService.addTag({ [attribute]: name, content });
        }
    }

    resetToDefault(): void {
        this.updateMetadata(this.defaultMetadata);
    }

    getSiteName(): string {
        return APP_CONFIG.site.name;
    }

    // Helper method to create page titles with site name
    createPageTitle(pageTitle: string): string {
        return `${pageTitle} - ${APP_CONFIG.site.name}`;
    }
}
