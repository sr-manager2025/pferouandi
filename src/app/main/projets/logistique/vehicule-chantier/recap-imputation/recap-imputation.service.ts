import {SrManagerService} from '../../../sr-manager.service';
import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecapImputationService {
    onMouvementsListChanged: BehaviorSubject<any[]> = new BehaviorSubject([]);

    constructor(private srManagerService: SrManagerService) {
    }

    getAllImputation(): Promise<any> {
        const url = environment.tripimpapi + '/allImputation';

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

    getAllImputationbymounth(month: number, year: number): Promise<any> {
        const url = `${environment.tripimpapi}/imputationsByMounth?month=${month}&year=${year}`;

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

    getAllImputationbyAffaire(affaireId: number): Promise<any> {
        const url = `${environment.tripimpapi}/imputationsByAffaire/${affaireId}`; // Correct URL

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: any) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    console.error('Error fetching imputations by affaire:', error); // Log the error
                    reject(error);
                }
            );
        });
    }

    getAllImputationbyVehicule(vehiculeId: number): Promise<any> {
        const url = `${environment.tripimpapi}/imputationsByVehicule/${vehiculeId}`; // Correct URL

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: any) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    console.error('Error fetching imputations by vehicule:', error); // Log the error
                    reject(error);
                }
            );
        });
    }

    getAllImputationbyClient(clientId: number): Promise<any> {
        const url = `${environment.tripimpapi}/imputationsByClient/${clientId}`; // Correct URL

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: any) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    console.error('Error fetching imputations by client:', error); // Log the error
                    reject(error);
                }
            );
        });
    }

    getAllImputationbyLot(lotId: number): Promise<any> {
        const url = `${environment.tripimpapi}/imputationsByLot/${lotId}`; // Correct URL

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: any) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    console.error('Error fetching imputations by lot:', error); // Log the error
                    reject(error);
                }
            );
        });
    }

    getAllImputationbySousTraitant(strId: number): Promise<any> {
        const url = `${environment.tripimpapi}/imputationsBySousTraitant/${strId}`; // Correct URL

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: any) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    console.error('Error fetching imputations by sous traitant:', error); // Log the error
                    reject(error);
                }
            );
        });
    }
}
