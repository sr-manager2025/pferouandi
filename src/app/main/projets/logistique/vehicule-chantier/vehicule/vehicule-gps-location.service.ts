import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { SrManagerService } from '../../../sr-manager.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VehiculeGpsLocationService {
  public onVehiculeListChanged: BehaviorSubject<any>;

  constructor(private srManagerService: SrManagerService) {
    // @ts-ignore
    this.onVehiculeListChanged = new BehaviorSubject<any>();
  }

  getAllVehiculeGps(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const url = environment.vhgpsapi + '/getAllVehiculeGps';
      this.srManagerService.getResources(url).subscribe((response: any[]) => {
        this.onVehiculeListChanged.next(response);
        resolve(response);
      }, reject);
    });
  }

  saveVehiculeFromApi(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const url = environment.vhgpsapi + '/saveVehiculeFromApi';
      this.srManagerService.getResources(url).subscribe((response: any[]) => {
        this.onVehiculeListChanged.next(response);
        resolve(response);
      }, reject);
    });
  }

  getVehiculeCount() {
    return this.srManagerService.getResources(
      `${environment.vhgpsapi}/getVehiculeGps`
    );
  }

  associateChauffeurAndPrice(
    id: number,
    chauffeurId: number,
    costPerKm: number,
    model: string,
    name: string,
    device: string
  ): Promise<any[]> {
    const url = environment.vhgpsapi + '/associateChauffeurAndPrice';
    const body = {
      vehiculeId: id,
      chauffeurId: chauffeurId,
      costPerKm: costPerKm,
      model: model, // Added model field
      name: name, // Added name field
      device: device,
    };

    return new Promise((resolve, reject) => {
      this.srManagerService
        .postRessource(url, body)
        .subscribe((response: any[]) => {
          this.onVehiculeListChanged.next(response);
          resolve(response);
        }, reject);
    });
  }

  deleteVehicule(id: number): Observable<any> {
    if (!id) {
        console.error('Cannot delete vehicle. Invalid vehicle ID:', id);
        return throwError(() => new Error('Invalid vehicle ID'));
    }

    const url = `${environment.vhgpsapi}/deleteVehicule/${id}`;

    return this.srManagerService.deleteRessource(url).pipe(
        tap((response) => this.onVehiculeListChanged.next(response)),
        catchError((error) => {
            console.error('Error deleting vehicle:', error.status, error.message);
            return throwError(() => new Error(error.message || 'Error deleting vehicle'));
        })
    );
}

}




