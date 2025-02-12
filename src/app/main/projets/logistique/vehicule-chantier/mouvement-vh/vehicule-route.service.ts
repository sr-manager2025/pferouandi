import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {VehiculeRoute} from '../models/vehicule-route';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {AssociateFromToRequestDTO} from '../models/DTO/AssociateFromToRequestDTO';
import {UpdateFillingPercentageDTO} from '../models/DTO/UpdateFillingPercentageDTO';
import {PerformanceOverTimeRequestDTO} from '../models/DTO/PerformanceOverTimeRequestDTO';
import {UpdateMouvementDTO} from '../models/DTO/UpdateMouvementDTO';
import {TripImputationRequestDTO} from '../models/DTO/TripImputationRequestDTO';
import {FromMouvementRequestDTO} from '../models/DTO/FromMouvementRequestDTO';
import {SrManagerService} from '../../../sr-manager.service';
import {environment} from '../../../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class VehiculeRouteService {
    onMouvementsListChanged: BehaviorSubject<any[]>;
    onImputationsChanged: BehaviorSubject<any[]>;
    onFromMouvementChanged: BehaviorSubject<any[]>;

    constructor(private srManagerService: SrManagerService) {
        // @ts-ignore
        this.onMouvementsListChanged = new BehaviorSubject<any[]>();
        // @ts-ignore
        this.onImputationsChanged = new BehaviorSubject<any[]>();
        // @ts-ignore
        this.onFromMouvementChanged = new BehaviorSubject<any[]>();
    }

    getVehiculeByDate(date: string): Promise<any[]> {
        const url = environment.vhrouteapi + '/getAllbydate?date=' + date;

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).pipe(
                map((routes: VehiculeRoute[]) =>
                    routes.sort(
                        (a, b) =>
                            // tslint:disable-next-line:no-non-null-assertion
                            new Date(b.date!).getTime() - new Date(a.date!).getTime()
                    )
                )
            )
                .subscribe((response: any[]) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }

    getVehiculeByMonth(month: string): Promise<any[]> {
        const url = environment.vhrouteapi + '/getAllbymonth?month=' + month;

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).pipe(
                map((routes: VehiculeRoute[]) =>
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


    /*getAllVehiculeRoutes(): Promise<any[]> {
        let url = environment.vhrouteapi + "/getAllVehiculeRoutes";

        return new Promise((resolve, reject) => {
            this.srManagerService.getResource(url).pipe(map(
                (routes: VehiculeRoute[]) =>
                    routes.sort((a, b) =>
                        new Date(b.date!).getTime() - new Date(a.date!).getTime())))
                .subscribe((response: any[]) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }
*/
    deleteVehiculeRoute(id: number): Observable<any> {
        return this.srManagerService
            .deleteRessource(`${environment.vhrouteapi}/deleteVehiculeroute/${id}`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // Client-side error (e.g., network issue)
            console.error('An error occurred:', error.error.message);
        } else {
            // Backend returned an unsuccessful response code
            console.error(
                `Backend returned status ${error.status}, ` + `body was: ${error.error}`
            );
        }
        // Return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    }

    totalRouteLength(): Observable<any> {
        return this.srManagerService.getResource(
            `${environment.vhrouteapi}/totalRouteLength`
        );
    }


    performanceOverTime(startDate: string, endDate: string): Observable<any> {
        const dto: PerformanceOverTimeRequestDTO = new PerformanceOverTimeRequestDTO(
            startDate,
            endDate
        );
        return this.srManagerService
            .postRessource(`${environment.vhrouteapi}/performanceOverTime`, dto)
            .pipe(catchError(this.handleError));
    }

    totalCostPerTripByMonth(year: string, month: string) {
        return this.srManagerService.getResource(
            `${environment.vhrouteapi}/totalCostPerTripByMonth/` + year + '/' + month
        );
    }


    associateFromTo(request: FromMouvementRequestDTO): Observable<VehiculeRoute> {
        const url = `${environment.vhrouteapi}/associateFromTo`;
        // @ts-ignore
        return this.srManagerService.postRessource(url, request);
    }

    getVehiculeRouteById(vehiculeRouteId: number): Observable<any[]> {
        // @ts-ignore
        return this.srManagerService.getResources(
            `${environment.vhrouteapi}/getVehiculeRouteById/${vehiculeRouteId}`
        );
    }


    imputationByVehiculeRoute(vehiculeRouteId: number): Promise<any[]> {
        const url = `${environment.tripimpapi}/imputationByVehiculeRoute/${vehiculeRouteId}`;

        return new Promise((resolve, reject) => {
            this.srManagerService.getResources(url).subscribe((response: any) => {
                this.onImputationsChanged.next(response);
                resolve(response);
            }, reject);
        });
    }

    /* updateFillingPercentage(dto: UpdateFillingPercentageDTO): Promise<any> {

          console.log(dto.vehiculeRouteId)
          console.log(dto.fillingPercentage)
          let url = environment.vhrouteapi + '/updateFillingPercentage';

          return new Promise((resolve, reject) => {
              // @ts-ignore
              this.srManagerService.putRessource(url, dto).subscribe(
                  (response: any) => {
                      this.onMouvementsListChanged.next(response);
                      resolve(response);
                  }, reject);
          });
      } */

    updateFillingPercentage(dto: UpdateFillingPercentageDTO): Promise<any> {
        const url = environment.vhrouteapi + '/updateFillingPercentage';

        return new Promise((resolve, reject) => {
            this.srManagerService
                .putRessource(url, dto)
                .pipe(
                    map((routes: VehiculeRoute[]) =>
                        routes.sort(
                            (a, b) =>
                                // tslint:disable-next-line:no-non-null-assertion
                                new Date(b.date!).getTime() - new Date(a.date!).getTime()
                        )
                    )
                )
                .subscribe((response: any[]) => {
                    this.onMouvementsListChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }

    updateMouvement(dto: UpdateMouvementDTO): Observable<any> {
        const url = environment.vhrouteapi + '/updateMouvement';
        return this.srManagerService.putRessource(url, dto).pipe(
            tap((response) => {
                this.onMouvementsListChanged.next(response);
                console.log('API Response Time: ', response);
            })
        );
    }


    // -----------------------------------------------------------------------

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

    /*getAllLots() {
      return new Promise((resolve, reject) => {
        const url = `${environment.lotQueryHost}/allLots`;
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
  */


    getImputationByVehiculeRouteId(vehiculeRouteId: number) {
        return new Promise((resolve, reject) => {
            const url = `${environment.tripimpapi}/imputationByVehiculeRoute/${vehiculeRouteId}`;
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

    getFromMouvementByVehiculeRouteId(vehiculeRouteId: number) {
        const url = `${environment.frommvtapi}/byVehiculeRoute/${vehiculeRouteId}`;

        return new Promise((resolve, reject) => {
            this.srManagerService.getResources(url).subscribe((response: any) => {
                this.onFromMouvementChanged.next(response);
                resolve(response);
            }, reject);
        });


    }

    deleteFromMouvement(id: number): Observable<void> {
        // @ts-ignore
        return this.srManagerService
            .deleteRessource(`${environment.frommvtapi}/${id}`)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error('Error occurred:', error);
                    return throwError(error);
                })
            );
    }

    deleteImputation(id: number): Observable<void> {
        // @ts-ignore
        return this.srManagerService
            .deleteRessource(`${environment.tripimpapi}/deleteImputation/${id}`)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error('Error occurred:', error);
                    return throwError(error);
                })
            );
    }

    /*   updateImputation(dto: TripImputationDTO): Promise<any> {
      const url = `${environment.tripimpapi}/updateImputation/${dto.id}`;

      return new Promise((resolve, reject) => {
          this.srManagerService.putRessource(url, dto).subscribe(
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
   */
    saveFromMouvement(FromRequest: FromMouvementRequestDTO): Promise<any[]> {
        const url = `${environment.frommvtapi}/saveFromMouvement`;
        console.log('Sending request to:', url);
        console.log('Request payload:', FromRequest);

        return new Promise((resolve, reject) => {
            this.srManagerService.postRessource(url, FromRequest).subscribe((response: any) => {
                this.onFromMouvementChanged.next(response);
                resolve(response);
            }, reject);
        });

        // return this.srManagerService.postRessource(url, imputationRequest);
    }

    updateFrom(dto: FromMouvementRequestDTO): Promise<any[]> {
        console.log(dto);
        const url = `${environment.frommvtapi}/updateMouvement`;

        return new Promise((resolve, reject) => {
            this.srManagerService
                .putRessource(url, dto)
                .subscribe((response: any) => {
                    this.onFromMouvementChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }

    saveImputation(imputationRequest: TripImputationRequestDTO): Promise<any[]> {
        const url = `${environment.tripimpapi}/saveImputation`;
        console.log('Sending request to:', url);
        console.log('Request payload:', imputationRequest);

        return new Promise((resolve, reject) => {
            this.srManagerService
                .postRessource(url, imputationRequest)
                .subscribe((response: any) => {
                    this.onImputationsChanged.next(response);
                    resolve(response);
                }, reject);
        });

        // return this.srManagerService.postRessource(url, imputationRequest);
    }

    updateImputation(dto: TripImputationRequestDTO): Promise<any[]> {
        console.log(dto);
        const url = `${environment.tripimpapi}/updateImputation/${dto.id}`;

        return new Promise((resolve, reject) => {
            this.srManagerService
                .putRessource(url, dto)
                .subscribe((response: any) => {
                    this.onImputationsChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }
}
