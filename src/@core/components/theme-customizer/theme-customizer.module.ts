import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {CoreDirectivesModule} from '@core/directives/directives';
import {CoreSidebarModule} from '@core/components/core-sidebar/core-sidebar.module';

import {CoreThemeCustomizerComponent} from '@core/components/theme-customizer/theme-customizer.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: false
};

@NgModule({
    declarations: [CoreThemeCustomizerComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        PerfectScrollbarModule,
        CoreDirectivesModule,
        CoreSidebarModule
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    exports: [CoreThemeCustomizerComponent]
})
export class CoreThemeCustomizerModule {
}
