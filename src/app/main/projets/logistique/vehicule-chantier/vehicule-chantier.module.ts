import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardMouvementComponent} from './dashboard-mouvement/dashboard-mouvement.component';
import { VehiculeMouvementListComponent } from './mouvement-vh/vehicule-mouvement-list/vehicule-mouvement-list.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import {ChartsModule} from 'ng2-charts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RecapImputationComponent } from './recap-imputation/recap-imputation.component';
import {CoreCommonModule} from '../../../../../@core/common.module';
import {DatePickerI18nModule} from '../../../forms/form-elements/date-time-picker/date-picker-i18n/date-picker-i18n.module';
import {VehiculeListComponent} from './vehicule/vehicule-list/vehicule-list.component';
import {ChauffeurVhListComponent} from './chauffeur/chauffeur-list/chauffeur-vh-list.component';
import {AffectationAffaireChauffeurComponent} from './vehicule/affectation-affaire-chauffeur/affectation-affaire-chauffeur.component';
import {CoreSidebarModule} from '../../../../../@core/components';
import {AuthGuard} from '../../../authentication/auth.guards';

const routes: Routes = [
    {
        path: 'chauffeur',
        loadChildren: () =>
            import('./chauffeur/chauffeur.module').then((m) => m.ChauffeurModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'chauffeur',
        component: ChauffeurVhListComponent,
    },
  {
      path: 'dashboard',
      component: DashboardMouvementComponent,
  },

  {
      path: 'mouvement',
      component: VehiculeMouvementListComponent
  },

  {
      path: 'recap',
      component: RecapImputationComponent
  },
    {
        path: 'vehicule',
        component: VehiculeListComponent
    },
];

@NgModule({
    declarations: [
        DashboardMouvementComponent,
        VehiculeMouvementListComponent,
        RecapImputationComponent,
        VehiculeListComponent,
        AffectationAffaireChauffeurComponent,

    ],
    exports: [
        DashboardMouvementComponent
    ],
    imports: [
        CommonModule,
        NgApexchartsModule,
        RouterModule.forChild(routes),
        ChartsModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgxDatatableModule,
        CoreCommonModule,
        NgbDropdownModule,
        DatePickerI18nModule,
        CoreSidebarModule,
        NgbModule
    ]
})
export class VehiculeChantierModule { }
