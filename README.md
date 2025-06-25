# Comping Zadatak

Angular aplikacija koja sadrži dashboard s widgetima za prikaz interaktivne mape i podataka u grafičkom/tabličnom prikazu. Također uključuje pregled Pokemon-a s detaljnim informacijama.

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
- Karma + Jasmine za testiranje

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
│   ├── features/          # Feature moduli
│   │   └── map/          # Mapa funkcionalnost
│   ├── pages/            # Stranice aplikacije
│   │   └── pokemon/      # Pokemon stranice
│   ├── shared/           # Dijeljene komponente
│   │   └── components/   # Zajedničke komponente
│   └── ...
├── assets/               # Statički resursi
└── ...
```

## Instalacija

1. Clone repo
2. Instaliraj dependencies:
   ```bash
   pnpm install
   ```
3. Pokrenuti aplikaciju:
   ```bash
   pnpm start
   ```

## Izradio

© 2025 Mihael Šestak
