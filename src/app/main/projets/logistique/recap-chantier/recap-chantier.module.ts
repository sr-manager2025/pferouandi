import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecapGeneralComponent } from './recap-general/recap-general.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../authentication/auth.guards';
import {EnginMouvementListComponent} from '../engin-chantier/mouvement-engin/engin-mouvement-list/engin-mouvement-list.component';
import {EnginListComponent} from '../engin-chantier/engin/engin-list/engin-list.component';
import {RecapEnginImputationComponent} from '../engin-chantier/recap-engin-imputation/recap-engin-imputation.component';
import {ChartsModule} from 'ng2-charts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {CoreCommonModule} from '../../../../../@core/common.module';
import {NgbDropdownModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {DatePickerI18nModule} from '../../../forms/form-elements/date-time-picker/date-picker-i18n/date-picker-i18n.module';
import {CorePipesModule} from '../../../../../@core/pipes/pipes.module';
import {CoreSidebarModule} from '../../../../../@core/components';


const routes: Routes = [
  { path: 'RecapGeneral',
    component: RecapGeneralComponent},
];

@NgModule({
  declarations: [
    RecapGeneralComponent
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
    NgbNavModule,  ]
})
export class RecapChantierModule { }
