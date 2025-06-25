import { HomePage } from '@/app/pages/home/home-page/home-page';
import { PokemonDetailPage } from '@/app/pages/pokemon/pokemon-detail/pokemon-detail';
import { PokemonPage } from '@/app/pages/pokemon/pokemon-page/pokemon-page';
import { MainLayout } from '@/app/shared/components/common/layout/main-layout/main-layout';
import { Routes } from '@angular/router';


export const routes: Routes = [

    {
        path: '',
        component: MainLayout,
        children: [
            { path: '', component: HomePage },
            { path: 'pokemon', component: PokemonPage },
            { path: 'pokemon/:name', component: PokemonDetailPage }
        ]
    },

];
