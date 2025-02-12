import {Injectable} from '@angular/core';
import {SrManagerService} from '../../sr-manager.service';
import {environment} from '../../../../../environments/environment';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {Affaire} from '../models/affaire';
import {TripImputation} from '../vehicule-chantier/models/TripImputation';
import {catchError, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RecapGeneralService {
    onMouvementsListChanged: BehaviorSubject<any[]> = new BehaviorSubject([]);

    constructor(private srManagerService: SrManagerService) {
    }

    getImputationsByAffaireId(affaireId: number): Observable<TripImputation[]> {
        const url = `${environment.enginimpapi}/imputationsByAffaire/${affaireId}`;
        return this.srManagerService.getResource(url).pipe(
            map((response: any) => response),
            catchError((error) => {
                console.error('Error fetching imputations for affaire:', affaireId, error);
                return [];
            })
        );
    }

    getTotalImputationCostForAllAffaires(affaires: Affaire[]): Observable<any[]> {
        const totalCosts$ = affaires.map((affaire) => {
            return this.getImputationsByAffaireId(affaire.id).pipe(
                map((tripImputations: TripImputation[]) => {
                    const totalCost = tripImputations.reduce((sum, trip) => sum + trip.costImputation, 0);
                    return {
                        affaireId: affaire.id,
                        affaireName: affaire.code,
                        totalCostImputation: totalCost
                    };
                })
            );
        });

        // Use forkJoin to combine the observables and return the results when all requests are complete
        return forkJoin(totalCosts$);
    }

}
