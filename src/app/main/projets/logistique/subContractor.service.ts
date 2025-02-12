import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {SrManagerService} from '../sr-manager.service';
import {SubContractor} from '../../../../@core/models/sub-contractor';

@Injectable({
    providedIn: 'root',
})
export class SubContractorService {
    onSubContractorListChanged: BehaviorSubject<SubContractor[]>;

    constructor(private srManagerService: SrManagerService) {
        this.onSubContractorListChanged = new BehaviorSubject<SubContractor[]>([]);
    }

    byProject(projectId: number): Promise<SubContractor[]> {
        console.log('Subcontractors byProject==>' + projectId);
        return new Promise((resolve, reject) => {
            const url = `${environment.subcontractorQueryHost}/byProject/` + projectId;
            this.srManagerService.getResource(url).subscribe(
                (response: SubContractor[]) => {
                    this.onSubContractorListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    allSousTraitant() {
        return new Promise((resolve, reject) => {
            const url = `${environment.subcontractorQueryHost}/all`;
            this.srManagerService.getResource(url).subscribe(
                (response: SubContractor[]) => {
                    this.onSubContractorListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
}
