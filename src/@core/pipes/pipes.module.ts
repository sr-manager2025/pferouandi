import {NgModule} from '@angular/core';

import {FilterPipe} from '@core/pipes/filter.pipe';

import {InitialsPipe} from '@core/pipes/initials.pipe';

import {SafePipe} from '@core/pipes/safe.pipe';
import {StripHtmlPipe} from '@core/pipes/stripHtml.pipe';
import {LotPipe} from './lot.pipe';
import {EntityPipe} from './entity.pipe';
import { TimeFormatPipe } from './time-format.pipe';

@NgModule({
    declarations: [InitialsPipe, FilterPipe, StripHtmlPipe, SafePipe, LotPipe, EntityPipe, TimeFormatPipe],
    imports: [],
    exports: [InitialsPipe, FilterPipe, StripHtmlPipe, SafePipe, LotPipe, EntityPipe]
})
export class CorePipesModule {
}
