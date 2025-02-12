import { Injectable } from '@angular/core';
import { SrManagerService } from 'app/main/projets/sr-manager.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { EnginGpsLocationDTO } from '../models/dto/EnginGpsLocationDTO';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EnginGpsLocationService {
  public onEnginListChanged: BehaviorSubject<any>;
  constructor(private srManagerService: SrManagerService) {
    // @ts-ignore
    this.onEnginListChanged = new BehaviorSubject<any>();
  }

  getAllEnginGps(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const url = environment.enginGpsapi + '/getAllEnginGps';
      this.srManagerService.getResources(url).subscribe((response: any[]) => {
        this.onEnginListChanged.next(response);
        resolve(response);
      }, reject);
    });
  }

  saveEnginFromApi(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const url = environment.enginGpsapi + '/saveLocations';
      this.srManagerService.getResources(url).subscribe((response: any[]) => {
        this.onEnginListChanged.next(response);
        resolve(response);
      }, reject);
    });
  }
  AddEnginLocation(
    chauffeurId: number,
    coutH: number,
    model: string,
    name: string,
    device: string
  ): Promise<any[]> {
    const url = environment.enginGpsapi + '/createEngin';
    const body = {
      chauffeurId: chauffeurId,
      coutH: coutH,
      model: model,
      name: name,
      device: device,
    };

    return new Promise((resolve, reject) => {
      this.srManagerService
        .postRessource(url, body)
        .subscribe((response: any[]) => {
          this.onEnginListChanged.next(response);
          resolve(response);
        }, reject);
    });
  }

  updateEnginGpsLocation(
    id: number,
    chauffeurId: number,
    coutH: number,
    model: string,
    name: string,
    device: string
  ): Promise<any[]> {
    const url = environment.enginGpsapi + '/updateEnginGps';
    const body = {
      enginId: id,
      chauffeurId: chauffeurId,
      coutH: coutH,
      model: model,
      name: name,
      device: device,
    };

    return new Promise((resolve, reject) => {
      this.srManagerService
        .postRessource(url, body)
        .subscribe((response: any[]) => {
          this.onEnginListChanged.next(response);
          resolve(response);
        }, reject);
    });
  }
   deleteEngin(id: number): Observable<any> {
      if (!id) {
          console.error('Cannot delete vehicle. Invalid Engin ID:', id);
          return throwError(() => new Error('Invalid vehicle ID'));
      }

      const url = `${environment.enginGpsapi}/deleteEngin/${id}`;

      return this.srManagerService.deleteRessource(url).pipe(
          tap((response) => this.onEnginListChanged.next(response)),
          catchError((error) => {
              console.error('Error deleting Engin:', error.status, error.message);
              return throwError(() => new Error(error.message || 'Error deleting Engin'));
          })
      );
}
}
