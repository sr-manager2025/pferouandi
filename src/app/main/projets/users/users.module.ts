import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserEditComponent} from './user-edit/user-edit.component';
import {RouterModule, Routes} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CoreCommonModule} from '../../../../@core/common.module';
import {ContentHeaderModule} from '../../../layout/components/content-header/content-header.module';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {NgSelectModule} from '@ng-select/ng-select';
import {BlockUIModule} from 'ng-block-ui';
import {RoleListService} from './role-list.service';
import {UserEditService} from './user-edit/user-edit.service';
import {AccountSettingsComponent} from './account-settings/account-settings.component';
import {UsersListComponent} from './users-list/users-list.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {CoreSidebarModule} from '../../../../@core/components';
import {UsersListService} from './users-list/users-list.service';
import {Role} from '../../authentication/models/role';
import {AuthGuard} from '../../authentication/auth.guards';
import {UserAddComponent} from './user-add/user-add.component';


const routes: Routes = [
    {
        path: 'account-settings',
        component: AccountSettingsComponent,
        resolve: {
            roleListService: RoleListService,
        },
        data: {animation: 'account-settings'},
        canActivate: [AuthGuard]

    },
    {
        path: 'add',
        component: UserAddComponent,
        resolve: {
            roleListService: RoleListService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'edit/:id',
        component: UserEditComponent,
        resolve: {
            roleListService: RoleListService, UserEditService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'list',
        component: UsersListComponent,
        resolve: {
            roleListService: RoleListService, UsersListService
        },
        data: {roles: [Role.ADMIN]},
        canActivate: [AuthGuard]
    }
];


@NgModule({
    declarations: [UserEditComponent, AccountSettingsComponent, UsersListComponent, UserAddComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbModule,
        CoreCommonModule,
        ContentHeaderModule,
        Ng2FlatpickrModule,
        NgSelectModule,
        BlockUIModule,
        NgxDatatableModule,
        CoreSidebarModule
    ]
})
export class UsersModule {
}
