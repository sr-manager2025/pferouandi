import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {Chauffeur} from '../../models/chauffeur';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {SrManagerService} from '../../../sr-manager.service';
import {Fournisseur} from '../../models/fournisseur';

@Injectable({
  providedIn: 'root'
})
export class ChauffeurService {
  private apiUrl = environment.chauffeurapi;
  public onChauffeurListChanged: BehaviorSubject<any>;
  public onChauffeurViewChanged: BehaviorSubject<any>;
  public onChauffeurEditChanged: BehaviorSubject<any>;

  constructor(private srManagerService: SrManagerService) {
    this.onChauffeurListChanged = new BehaviorSubject({});
    this.onChauffeurViewChanged = new BehaviorSubject({});
    this.onChauffeurEditChanged = new BehaviorSubject({});
  }


  getAllChauffeurs(): Promise<Chauffeur[]> {
    const url = this.apiUrl + '/getAllChauffeurs';
    return new Promise((resolve, reject) => {
          this.srManagerService.getResources(url).subscribe(
              (data: Chauffeur[]) => {
                this.onChauffeurListChanged.next(data);
                resolve(data);
              }, reject);
        }
    );
  }

  getChauffeurById(id: number): Observable<Chauffeur> {
    // @ts-ignore
    return this.srManagerService.getResource(`${this.apiUrl}/getChauffeurById/${id}`);
  }

  /*createChauffeur(chauffeur: Chauffeur, file: File): Observable<Chauffeur> {
    const formData: FormData = new FormData();
    formData.append('chauffeur', new Blob([JSON.stringify(chauffeur)], { type: 'application/json' }));
    formData.append('file', file);

    // @ts-ignore
    return this.srManagerService.postRessource(`${this.apiUrl}/createChauffeur`, formData);
  }
*/

  createChauffeur(chauffeur: Chauffeur, file: File): Promise<Chauffeur[]> {

    const formData: FormData = new FormData();
    formData.append('chauffeur', new Blob([JSON.stringify(chauffeur)], { type: 'application/json' }));
    formData.append('file', file);

    const url = this.apiUrl + '/createChauffeur';

    return new Promise((resolve, reject) => {
          this.srManagerService.postRessource(url, formData).subscribe(
              (data: Chauffeur[]) => {
                this.onChauffeurListChanged.next(data);
                resolve(data);
              }, reject);
        }
    );
  }

  /*updateChauffeur(id: number, chauffeur: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('chauffeur', new Blob([JSON.stringify(chauffeur)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file, file.name);
    }

    console.log(formData)
    return this.srManagerService.putRessource(`${this.apiUrl}/updateChauffeur/${id}`, formData);


  }*/

  updateChauffeur(id: number, chauffeur: any, file: File): Promise<Chauffeur[]> {

    const formData: FormData = new FormData();
    formData.append('chauffeur', new Blob([JSON.stringify(chauffeur)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file, file.name);
    }
    const url = this.apiUrl + '/updateChauffeur/' + id;

    return new Promise((resolve, reject) => {
          this.srManagerService.putRessource(url, formData).subscribe(
              (data: Chauffeur[]) => {
                this.onChauffeurListChanged.next(data);
                resolve(data);
              }, reject);
        }
    );
  }

  deleteChauffeur(id: number): Observable<void> {
    // @ts-ignore
    return this.srManagerService.deleteRessource<void>(`${this.apiUrl}/deleteChauffeur/${id}`).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
    );
  }
  getChauffeurCount() {
    // @ts-ignore
    return this.srManagerService.getResources(`${this.apiUrl}/getAll`);
  }


}
