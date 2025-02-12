import {Component, OnInit} from '@angular/core';

import {SrNotification} from '../models/sr-notification';
import {AppUser} from '../../../../main/authentication/models/app-user';
import {AuthService} from '../../../../main/authentication/auth.service';
import {Subscription} from 'rxjs';
import {NotifAction} from '../models/notif-action';
import {Router} from '@angular/router';


@Component({
    selector: 'app-navbar-notification',
    templateUrl: './navbar-notification.component.html'
})
export class NavbarNotificationComponent implements OnInit {
    /**
     *
     * @param _router
     * @param authService
     */
    constructor(private _router: Router,
                private authService: AuthService, ) {

        this.currentUserSubscription = this.authService.currentUserSubject.subscribe(
            (data: AppUser) => {
                this.currentUser = data;
            }
        );
        authService.loadCurrentUser();
    }
    // Public
    public notifications: SrNotification[];
    private currentUserSubscription: Subscription;
    private currentUser: AppUser;



    readonly NotifAction = NotifAction;

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

    }
    onNotifSelected(notification: SrNotification) {

        console.log(notification.message);
        console.log(notification.notifAction);

        if (notification.notifAction == NotifAction.VALIDATE_CASH_LINE_CHANTIER) {
            this._router.navigate(['/projets/comptabilite/caisse/registre']);

        }
    }
}
