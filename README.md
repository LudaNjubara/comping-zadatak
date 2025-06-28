# Comping Zadatak

Angular aplikacija koja sadrži dashboard s widgetima za prikaz interaktivne mape i podataka u grafičkom/tabličnom prikazu. Također uključuje pregled Pokemon-a s detaljnim informacijama.

## Online demo

Aplikaciju možete isprobati na sljedećem linku: [Demo aplikacija](https://comping-zadatak.vercel.app/)

## Pregled aplikacije

Ova aplikacija je razvijena koristeći Angular 20 i uključuje sljedeće funkcionalnosti:

- **Pokemon preglednik** - pregledavanje Pokemon-a s detaljnim informacijama
- **Interaktivna mapa** - prikaz lokacija u Zagrebu koristeći Leaflet
- **Charts** - grafički prikazi podataka koristeći Chart.js
- **Responsive design** - prilagođeno za različite veličine ekrana

## Tehnologije

- Angular 20
- TypeScript 5.8
- RxJS 7.8
- Leaflet (ngx-leaflet)
- Chart.js (ng2-charts)
- NgIcons
- Karma + Jasmine za testiranje
- Vercel za deployment

## Pokretanje aplikacije

### Development server

Za pokretanje lokalnog development servera:

```bash
pnpm start
```

Aplikacija će biti dostupna na `http://localhost:4200/`.

## Build

Za stvaranje production builda:

```bash
pnpm build
```

Production build dostupan je u `dist/` folderu.

### Production build

Za pokretanje production verzije:

```bash
pnpm serve:prod
```

## Testiranje

### Unit testovi

Za pokretanje unit testova:

```bash
pnpm test
```

Koristi se Karma test runner s Jasmine test framework-om.

## Struktura projekta

```
src/
├── app/
│   ├── core/
│   │   ├── config/
│   │   └── services/
│   ├── features/
│   │   ├── pokemon/
│   │   │   ├── components/
│   │   │   │   ├── navigation/
│   │   │   │   ├── loading/
│   │   │   │   ├── error/
│   │   │   │   ├── image/
│   │   │   │   ├── header/
│   │   │   │   ├── types/
│   │   │   │   ├── abilities/
│   │   │   │   └── stats/
│   │   │   ├── config/
│   │   │   └── services/
│   │   └── widget/
│   │       ├── chart/
│   │       │   ├── chart-widget/
│   │       │   └── services/
│   │       └── map/
│   │           ├── map-widget/
│   │           ├── components/
│   │           └── services/
│   ├── pages/
│   │   ├── home/
│   │   │   └── home-page/
│   │   └── pokemon/
│   │       ├── pokemon-page/
│   │       └── pokemon-detail/
│   └── shared/
│       └── components/
│           ├── common/
│           └── elements/
├── assets/
│   └── fonts/
├── data/
├── types/
└── utils/
```

## Instalacija

1. Clone repo
2. Instalirati dependencies:
   ```bash
   pnpm install
   ```
3. Pokrenuti aplikaciju:
   ```bash
   pnpm start
   ```

## Izradio

© 2025 Mihael Šestak
