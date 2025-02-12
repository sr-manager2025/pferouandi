import {SrManagerService} from 'app/main/projets/sr-manager.service';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {catchError, map} from 'rxjs/operators';
import {EnginRoute} from '../models/EnginRoute';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {EnginRouteDTO} from '../models/dto/EnginRouteDTO';
import {EnginImputationRequestDTO} from '../models/dto/EnginImputationRequestDTO';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MouvementEnginService {
    onEnginListChanged: BehaviorSubject<any[]>;
    onImputationsChanged: BehaviorSubject<any[]>;

    constructor(private srManagerService: SrManagerService) {
        // @ts-ignore
        this.onEnginListChanged = new BehaviorSubject<any[]>();
        // @ts-ignore
        this.onImputationsChanged = new BehaviorSubject<any[]>();

    }

    getEnginRoutesByDate(date: string): Promise<any[]> {
        const url = environment.enginRteapi + '/getEnginRoutesByDate?date=' + date;

        return new Promise((resolve, reject) => {
            this.srManagerService
                .getResource(url)
                .pipe(
                    map((routes: EnginRoute[]) =>
                        routes.sort(
                            (a, b) =>
                                // tslint:disable-next-line:no-non-null-assertion
                                new Date(b.date!).getTime() - new Date(a.date!).getTime()
                        )
                    )
                )
                .subscribe(
                    (response: any[]) => {
                        this.onEnginListChanged.next(response);
                        resolve(response);
                    },
                    (error) => {
                        console.error('Error fetching engine routes:', error);
                        reject(error);
                    }
                );
        });
    }
    getVehiculeByMonth(month: string): Promise<any[]> {
        const url = environment.enginRteapi + '/getAllbymonth?month=' + month;

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).pipe(
                map((routes: EnginRoute[]) =>
                    routes.sort(
                        (a, b) =>
                            // tslint:disable-next-line:no-non-null-assertion
                            new Date(b.date!).getTime() - new Date(a.date!).getTime()
                    )
                )
            )
                .subscribe((response: any[]) => {
                    resolve(response);
                }, reject);
        });
    }

    updateRendement(dto: EnginRouteDTO): Promise<any> {
        const url = environment.enginRteapi + '/updateRendement';

        return new Promise((resolve, reject) => {
            this.srManagerService.putRessource(url, dto).subscribe(
                (response: any) => {
                    this.onEnginListChanged.next(response);
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    imputationByEnginRoute(enginRouteId: number): Promise<any[]> {
        const url = `${environment.enginimpapi}/imputationByEnginRoute/${enginRouteId}`;


        return new Promise((resolve, reject) => {
            this.srManagerService.getResources(url).subscribe(
                (response: any) => {
                    this.onImputationsChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }



    saveImputation(imputationRequest: EnginImputationRequestDTO): Promise<any[]> {
        const url = `${environment.enginimpapi}/saveImputationEngin`;
        return new Promise((resolve, reject) => {
            this.srManagerService.postRessource(url, imputationRequest).subscribe(
                (response: any) => {
                    this.onImputationsChanged.next(response);
                    resolve(response);
                }, reject);
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

    updateImputation(dto: EnginImputationRequestDTO): Promise<any[]> {
        console.log(dto);
        const url = `${environment.enginimpapi}/updateImputation/${dto.id}`;

        return new Promise((resolve, reject) => {
            this.srManagerService
                .putRessource(url, dto)
                .subscribe((response: any) => {
                    this.onImputationsChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }

    deleteImputation(id: number): Observable<void> {
        // @ts-ignore
        return this.srManagerService
            .deleteRessource(`${environment.enginimpapi}/deleteImputation/${id}`)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error('Error occurred:', error);
                    return throwError(error);
                })
            );
    }

}

