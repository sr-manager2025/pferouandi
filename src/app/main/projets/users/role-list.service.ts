import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {BehaviorSubject, Observable} from 'rxjs';
import {SrManagerService} from '../sr-manager.service';
import {environment} from '../../../../environments/environment';
import {AppRole} from '../../authentication/models/app-role';

@Injectable({
    providedIn: 'root'
})
export class RoleListService {
    rows: any;
    onSettingsChanged: BehaviorSubject<any>;
    onRolessChanged: BehaviorSubject<any>;
    private appRoles: AppRole[];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private srManagerService: SrManagerService) {
        // Set the defaults
        this.onSettingsChanged = new BehaviorSubject({});
        this.onRolessChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {
            Promise.all([this.getAppRoles()]).then(() => {
                resolve();
            }, reject);
        });
    }

    /**
     * Get rows
     */
    /*getDataTableRows(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/account-settings-data').subscribe((response: any) => {
                this.rows = response;
                this.onSettingsChanged.next(this.rows);
                resolve(this.rows);
            }, reject);
        });
    }*/

    getAppRoles(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.srManagerService.getResources(environment.authQueryHost + '/appRoles').subscribe((response: any) => {
                this.appRoles = response;
                this.onRolessChanged.next(this.appRoles);
                resolve(this.appRoles);
            }, reject);
        });
    }

    createRole(appRole: AppRole) {
        return this.srManagerService.postRessource(environment.authCmdHost + '/createRole', appRole);

    }

}
