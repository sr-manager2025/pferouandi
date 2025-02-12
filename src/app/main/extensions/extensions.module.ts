import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContextMenuBordereauComponent} from './context-menu/context-menu-node-bordereau/context-menu-bordereau.component';
import {CustomToastrComponent} from './toastr/custom-toastr/custom-toastr.component';
import {ContextMenuModule} from '@ctrl/ngx-rightclick';
import {CoreCommonModule} from '../../../@core/common.module';
import {ContentHeaderModule} from '../../layout/components/content-header/content-header.module';
import {ToastrModule} from 'ngx-toastr';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ContextMenuBordereauComponent,
    CustomToastrComponent
  ],
  imports: [
    ContentHeaderModule,
    CommonModule,
    ContextMenuModule,
    CoreCommonModule,
    NgbModule,
    ToastrModule
  ]
})
export class ExtensionsModule { }
