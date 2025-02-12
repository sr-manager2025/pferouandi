import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntreeAddComponent} from './entree/entree-add/entree-add.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: 'entree-add',
        component: EntreeAddComponent,
    }
];

@NgModule({
    declarations: [
        EntreeAddComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ]
})
export class SrBoModule {
}
