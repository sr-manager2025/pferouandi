import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {Fournisseur} from './models/fournisseur';
import {any} from 'codelyzer/util/function';
import {SrManagerService} from '../sr-manager.service';

@Injectable({
  providedIn: 'root',
})
export class FournisseurService {
  private apiURL = environment.fournisseurapi;
  onFournisseurListChanged: BehaviorSubject<Fournisseur[]>;

  constructor(private srManagerService: SrManagerService) {
    this.onFournisseurListChanged = new BehaviorSubject<Fournisseur[]>([]);
  }

  getAllFournisseurs(): Promise<Fournisseur[]> {
    const url = this.apiURL + '/AllFournisseurs';
    return new Promise((resolve, reject) => {
          this.srManagerService.getResources(url).subscribe(
              (data: Fournisseur[]) => {
                this.onFournisseurListChanged.next(data);
                resolve(data);
              }, reject);
        }
    );
  }

  /* saveFournisseurFromApi(): Observable<string> {
     return this.http.get<string>(`${this.apiURL}/save-fournisseur-from-api`);
   }*/

  saveFournisseurFromApi(): Promise<Fournisseur[]> {
    const url = this.apiURL + '/saveFournisseurFromApi';
    return new Promise((resolve, reject) => {
          this.srManagerService.getResources(url).subscribe(
              (data: Fournisseur[]) => {
                this.onFournisseurListChanged.next(data);
                resolve(data);
              }, reject);
        }
    );
    // return this.http.get<string>(`${this.apiURL}/save-fournisseur-from-api`);
  }

  getFournisseurById(id: number): Observable<Fournisseur> {
    // @ts-ignore
      return this.srManagerService.getResources(`${this.apiURL}/geFournisseurById/${id}`);
  }

  deleteFournisseur(id: number): Observable<void> {
    // @ts-ignore
      return this.srManagerService.deleteRessource(`${this.apiURL}/deleteFournisseur/${id}`);
  }
}
