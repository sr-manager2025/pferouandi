import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AppUser} from '../../../authentication/models/app-user';
import {SrManagerService} from '../../sr-manager.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserEditService {

  onUserChanged: BehaviorSubject<any>;
  private appUser: AppUser[];
  private id: string;


  /**
   *
   * @param srManagerService
   */
  constructor(private srManagerService: SrManagerService) {
    // Set the defaults
    this.onUserChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.id = (route.paramMap.get('id'));

    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getOneUseById(this.id)]).then(() => {
        resolve();
      }, reject);
    });
  }


  getOneUseById(id: string): Promise<any[]> {
    const url = environment.authQueryHost + '/getOneUseById/' + id;
    return new Promise((resolve, reject) => {
      this.srManagerService.getResource(url).subscribe((response: any) => {
        this.onUserChanged.next(response);
        resolve(response);
      }, reject);
    });
  }

  initPwd(username: string) {
    return this.srManagerService.getResource(environment.authCmdHost + '/initPwd/' + username);
  }
}
