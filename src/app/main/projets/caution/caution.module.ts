import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CautionAddComponent} from './ligne-caution/caution-add/caution-add.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: 'caution-add',
        component: CautionAddComponent,
    }
];

@NgModule({
    declarations: [
        CautionAddComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes), ]
})

export class CautionModule {
}
