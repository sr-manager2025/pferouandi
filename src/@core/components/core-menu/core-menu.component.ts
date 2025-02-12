import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {CoreMenuService} from '@core/components/core-menu/core-menu.service';
import {AuthService} from '../../../app/main/authentication/auth.service';
import {AppUser} from '../../../app/main/authentication/models/app-user';
import {CoreMenu} from '../../types';

@Component({
    selector: '[core-menu]',
    templateUrl: './core-menu.component.html',
    styleUrls: ['./core-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
    currentUser: AppUser;

    @Input() layout = 'vertical';

    @Input() menu: CoreMenu[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {CoreMenuService} _coreMenuService
     */

    private currentUserSubscription: Subscription;

    constructor(private _changeDetectorRef: ChangeDetectorRef,
                public authService: AuthService,
                private _coreMenuService: CoreMenuService) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.currentUserSubscription = this.authService.currentUserSubject.subscribe(
            (data: AppUser) => {
                this.currentUser = data;
            }
        );

        authService.loadCurrentUser();

    }

    // Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Set the menu either from the input or from the service
        this.menu = this.menu || this._coreMenuService.getCurrentMenu();

        // Subscribe to the current menu changes
        this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
            this.currentUser = this._coreMenuService.currentUser;

            // Load menu
            this.menu = this._coreMenuService.getCurrentMenu();

            this._changeDetectorRef.markForCheck();
        });
    }


}
