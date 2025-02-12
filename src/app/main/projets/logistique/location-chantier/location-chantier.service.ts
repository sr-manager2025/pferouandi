import {Injectable} from '@angular/core';
import {SrManagerService} from '../../sr-manager.service';
import {environment} from '../../../../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {UpdateLocationInvoceDTO} from './dto/update-location-invoce-dto';

@Injectable({
    providedIn: 'root'
})
export class LocationChantierService {
    onLocationListChanged: BehaviorSubject<any[]> = new BehaviorSubject([]);


    constructor(private srManagerService: SrManagerService) {
    }

    getAllLocationInvoice(): Promise<any> {
        const url = environment.locationapi + '/allLocationInvoice';

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).subscribe(
                (response: any) => {
                    this.onLocationListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    updateLocationInvoice(id: number, updatedLocationInvoice: UpdateLocationInvoceDTO): Promise<any> {
        const url = environment.locationapi + `/updatelocation/${id}`;

        return new Promise((resolve, reject) => {
            this.srManagerService.putRessource(
                url, updatedLocationInvoice).subscribe(
                (response: any) => resolve(response),
                (error) => {
                    console.error('Error updating location invoice:', error);
                    reject(error);
                }
            );
        });
    }

    getAllClients() {
        return new Promise((resolve, reject) => {
            const url = `${environment.clientApi}/allClient`;
            this.srManagerService.getResource(url).subscribe(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
}
