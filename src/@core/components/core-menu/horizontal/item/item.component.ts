import {Component, Input} from '@angular/core';
import {AuthService} from '../../../../../app/main/authentication/auth.service';
import {AppUser} from '../../../../../app/main/authentication/models/app-user';
import {Subscription} from 'rxjs';

@Component({
    selector: '[core-menu-horizontal-item]',
    templateUrl: './item.component.html'
})
export class CoreMenuHorizontalItemComponent {
    @Input() item: any;
    private currentUserSubscription: Subscription;
    currentUser: AppUser;
    constructor( public authService: AuthService) {

        this.currentUserSubscription = this.authService.currentUserSubject.subscribe(
            (data: AppUser) => {
                this.currentUser = data;
            }
        );

        authService.loadCurrentUser();
    }
}
