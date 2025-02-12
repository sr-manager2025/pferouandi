import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CardSnippetModule} from '../../../../@core/components/card-snippet/card-snippet.module';
import {ContentHeaderModule} from '../../../layout/components/content-header/content-header.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule} from '@angular/forms';
import {AuthGuard} from '../../authentication/auth.guards';

const routes: Routes = [

    {
        path: 'vehiculeChantier',
        loadChildren: () => import('./vehicule-chantier/vehicule-chantier.module').then((m) => m.VehiculeChantierModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'enginChantier',
        loadChildren: () => import('./engin-chantier/engin-chantier.module').then((m) => m.EnginChantierModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'recapChantier',
        loadChildren: () => import('./recap-chantier/recap-chantier.module').then((m) => m.RecapChantierModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'locationChantier',
        loadChildren: () => import('./location-chantier/location.module').then((m) => m.LocationModule),
        canActivate: [AuthGuard]
    },

    /* {path: "vehicule",
         loadChildren: () => import("./vehicule-chantier/vehicule/vehicule.module").then((m) => m.VehiculeModule),
         canActivate: [AuthGuard]
     },*/

];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        CardSnippetModule,
        ContentHeaderModule,
        NgxDatatableModule,
        FormsModule,
    ]
})
export class LogistiqueModule {
}
