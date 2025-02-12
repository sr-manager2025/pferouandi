import { Injectable } from '@angular/core';
import { SrManagerService } from '../../../sr-manager.service';
import { environment } from '../../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import {map} from 'rxjs/operators';
import {VehiculeRoute} from '../../vehicule-chantier/models/vehicule-route';

@Injectable({
  providedIn: 'root'
})
export class RecapEnginImputationService {
  onMouvementsListChanged: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private srManagerService: SrManagerService) { }
  getAllImputation(): Promise<any> {
    const url = environment.enginimpapi + '/allImputation';

    return new Promise((resolve, reject) => {
      this.srManagerService.getResource(url).subscribe(
        (response: any) => {
          this.onMouvementsListChanged.next(response);
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  getAllImputationEnginbymounth(month: number, year: number): Promise<any> {
    const url = `${environment.enginimpapi}/enginImputationsByMounth?month=${month}&year=${year}`;

    return new Promise((resolve, reject) => {
      this.srManagerService.getResource(url).subscribe(
          (response: any) => {
            this.onMouvementsListChanged.next(response);
            resolve(response);
          },
          (error) => {
            reject(error);
          }
      );
    });
  }
    getAllImputationEnginbyAffaire(affaireId: number): Promise<any> {
        const url = `${environment.enginimpapi}/imputationsEnginByAffaire/${affaireId}`;

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: any) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    console.error('Error fetching imputations by affaire:', error);
                    reject(error);
                }
            );
        });
    }

    getAllImputationEnginbyEngin(id: number) {
        const url = `${environment.enginimpapi}/getAllImputationEnginbyEngin/${id}`;

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: any) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    console.error('Error fetching imputations by engin:', error);
                    reject(error);
                }
            );
        });
    }

    getAllImputationEnginbyClient(id: number) {
        const url = `${environment.enginimpapi}/getAllImputationEnginbyClient/${id}`;

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: any) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    console.error('Error fetching imputations by client:', error);
                    reject(error);
                }
            );
        });
    }

    getAllImputationEnginbyLot(id: number) {
        const url = `${environment.enginimpapi}/getAllImputationEnginbyLot/${id}`;

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: any) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    console.error('Error fetching imputations by lot:', error);
                    reject(error);
                }
            );
        });
    }

    getAllImputationEnginbySousTraitant(id: number) {
        const url = `${environment.enginimpapi}/getAllImputationEnginbySousTraitant/${id}`;

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: any) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    console.error('Error fetching imputations by Sous traitant:', error);
                    reject(error);
                }
            );
        });
    }
}
