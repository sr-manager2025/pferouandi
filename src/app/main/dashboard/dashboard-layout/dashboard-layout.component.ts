import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../authentication/auth.service';
import {Subscription} from 'rxjs';
import {AppUser} from '../../authentication/models/app-user';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {

  private currentUserSubscription: Subscription;
  public currentUser: AppUser;

  constructor(public authService: AuthService, ) {
    this.currentUserSubscription = this.authService.currentUserSubject.subscribe(
        (data: AppUser) => {
          this.currentUser = data;
        }
    );
    authService.loadCurrentUser();
  }

  ngOnInit(): void {
  }

}
