import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocationChantierComponent} from './location-chantier/location-chantier.component';
import {RouterModule, Routes} from '@angular/router';
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
    {
        path: 'Location',
        component: LocationChantierComponent,
    }
];

@NgModule({
    declarations: [
        LocationChantierComponent
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
    ]
})
export class LocationModule {
}
