import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnginMouvementListComponent } from './mouvement-engin/engin-mouvement-list/engin-mouvement-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreCommonModule } from '../../../../../@core/common.module';
import {NgbAccordionModule, NgbDropdownModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18nModule } from '../../../forms/form-elements/date-time-picker/date-picker-i18n/date-picker-i18n.module';
import { CorePipesModule } from '../../../../../@core/pipes/pipes.module';
import { EnginListComponent } from './engin/engin-list/engin-list.component';
import { CoreSidebarModule } from '../../../../../@core/components';
import { AffectationChauffeurCoutComponent } from './engin/affectation-chauffeur-cout/affectation-chauffeur-cout.component';
import { AuthGuard } from '../../../authentication/auth.guards';
import { AddEnginComponent } from './engin/add-engin/add-engin.component';
import { RecapEnginImputationComponent } from './recap-engin-imputation/recap-engin-imputation.component';


const routes: Routes = [
   {
    path: 'chauffeur',
    loadChildren: () =>
      import('./chauffeur/chauffeur.module').then((m) => m.ChauffeurModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'mouvement',
    component: EnginMouvementListComponent,
  },
  {
    path: 'engin',
    component: EnginListComponent,
  },
  { path: 'recap',
    component: RecapEnginImputationComponent },

 /* {
    path: "chauffeur",
    loadChildren: () =>
      import("./chauffeur/chauffeur.module").then((m) => m.ChauffeurModule),
    canActivate: [AuthGuard],
  },*/
];

@NgModule({
  declarations: [
    EnginMouvementListComponent,
    EnginListComponent,
    AffectationChauffeurCoutComponent,
    AddEnginComponent,
    RecapEnginImputationComponent,


  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ChartsModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgxDatatableModule,
        CoreCommonModule,
        NgbDropdownModule,
        DatePickerI18nModule,
        CorePipesModule,
        CoreSidebarModule,
        NgbNavModule,
        NgbAccordionModule,
    ],
})
export class EnginChantierModule {}
