import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {AppUser} from '../../../main/authentication/models/app-user';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  // private
  private profilUserSubject: BehaviorSubject<AppUser>;
  public profilUser: Observable<AppUser>;

  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.profilUserSubject = new BehaviorSubject<AppUser>(JSON.parse(localStorage.getItem('profil')));
    this.profilUser = this.profilUserSubject.asObservable();
  }



}
