import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {SrManagerService} from '../sr-manager.service';
import {environment} from '../../../../environments/environment';
import {ChampImputation} from '../../../../@core/models/champ-imputation';
import {RequestService} from '../../../../@core/enum/RequestService';

@Injectable({
  providedIn: 'root'
})
export class ImputationService implements Resolve<any> {

  // Public
  public onImputationListChanged: BehaviorSubject<any>;

  public onImputationChanged: BehaviorSubject<any>;
  selectedImputation: ChampImputation;

  /**
   * Constructor
   *
   // tslint:disable-next-line:no-redundant-jsdoc
   * @param srManagerService
   */
  constructor(private srManagerService: SrManagerService) {
    // Set the defaults
    this.onImputationListChanged = new BehaviorSubject({});
    this.onImputationChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   // tslint:disable-next-line:no-redundant-jsdoc
   * @param {ActivatedRouteSnapshot} route
   // tslint:disable-next-line:no-redundant-jsdoc
   * @param {RouterStateSnapshot} state
   // tslint:disable-next-line:no-redundant-jsdoc
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.byRequestService(RequestService.LOGISTIQUE)]).then(() => {
        resolve();
      }, reject);
    });
  }


  byRequestService(requestService: RequestService): Promise<ChampImputation[]> {
    return new Promise((resolve, reject) => {
      const url = environment.imputationQueryHost + '/byRequestService/' + requestService;
      this.srManagerService.getResources(url).subscribe(
          (response: any) => {
            this.onImputationListChanged.next(response);
            resolve(response);
          }, reject);
    });
  }


  champImputationById(id: any): Promise<ChampImputation> {
    const url = environment.imputationQueryHost + `/champImputationById/` + id;
    return new Promise((resolve, reject) => {
      this.srManagerService.getResource(url).subscribe((response: ChampImputation) => {
        this.onImputationChanged.next(response);
        this.selectedImputation = response;
        resolve(response);
      }, reject);
    });
  }


}
