import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {SrManagerService} from '../sr-manager.service';
import {environment} from '../../../../environments/environment';
import {Lot} from './models/lot';

@Injectable({
    providedIn: 'root'
})
export class LotService implements Resolve<any> {

    // Public
    public onLotListChanged: BehaviorSubject<any>;

    public onLotChanged: BehaviorSubject<any>;
    selectedlot: Lot;

    /**
     * Constructor
     *
     * @param srManagerService
     */
    constructor(private srManagerService: SrManagerService) {
        // Set the defaults
        this.onLotListChanged = new BehaviorSubject({});
        this.onLotChanged = new BehaviorSubject({});
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
            Promise.all([this.allLots()]).then(() => {
                resolve();
            }, reject);
        });
    }


    allLots(): Promise<Lot[]> {
        return new Promise((resolve, reject) => {
            const url = environment.lotQueryHost + '/allLots/';
            this.srManagerService.getResources(url).subscribe(
                (response: any) => {
                    this.onLotListChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }


    lotById(id: any): Promise<Lot> {
        const url = environment.lotQueryHost + `/lotById/` + id;
        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: Lot) => {
                    this.onLotChanged.next(response);
                    this.selectedlot = response;
                    resolve(response);
                }, reject);
        });
    }


}
