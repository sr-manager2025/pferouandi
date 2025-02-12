import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {Observable} from 'rxjs';
import {SrManagerService} from '../../../sr-manager.service';

@Injectable({
  providedIn: 'root'
})
export class KpiVehiculeService {



  constructor(private srManagerService: SrManagerService) {}

  /*getCostPerAffaire(): Observable<{ [key: string]: number }> {
    return this.srManagerService.getResource(`${environment.vhrouteapi}/costPerAffaire`);
  }*/

  getCostPerAffaire() {
    return this.srManagerService.getResource(`${environment.vhrouteapi}/costPerAffaire`);
  }
  /*getCostByGroupName(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${environment.vhrouteapi}/costByGroup`);
  }*/

  getCostByGroupName() {
    return this.srManagerService.getResource(`${environment.vhrouteapi}/costByGroup`);
  }
}
