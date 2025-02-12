import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from './auth.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    /**
     * @param {Router} _router
     * @param {AuthService} authService
     */
    constructor(private _router: Router, private authService: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(err => {
                if ([401].indexOf(err.status) !== -1) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                    window.localStorage.removeItem('currentUser');
                    // this.authService.refreshToken();
                    this._router.navigate(['/pages/miscellaneous/not-authorized']);

                    // ? Can also logout and reload if needed
                    // this.authService.logout();
                    // location.reload(true);
                }
                if ([429, 502].indexOf(err.status) !== -1) {
                    console.log('err.status :');
                    console.log(err.status);
                    // ? Can also logout and reload if needed
                    this.authService.logout();
                    // location.reload(true);
                }
                // throwError
                const error = err.error.message || err.statusText;
                return throwError(error);
            })
        );
    }
}
