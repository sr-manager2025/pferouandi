import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmployeeAddComponent} from './employee/employee-add/employee-add.component';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [{
    path: 'employee-add',
    component: EmployeeAddComponent,

}];

@NgModule({
    declarations: [
        EmployeeAddComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ]
})
export class RhModule {
}
