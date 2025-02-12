import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {CoreConfigService} from '../../../../@core/services/config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {CoreConfig} from '../../../../@core/types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class LoginComponent implements OnInit {
//  Public
  public coreConfig: CoreConfig;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  erreurStatusSubscription: Subscription;
  erreurStatus = false;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param _formBuilder
   * @param _route
   * @param _router
   * @param authService
   */
  constructor(
      private _coreConfigService: CoreConfigService,
      private _formBuilder: FormBuilder,
      private _route: ActivatedRoute,
      private _router: Router,
      private authService: AuthService) {

    // redirect to home if already logged in
    if (this.authService.currentUser) {
      this._router.navigate(['/']);
    }

    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Login
    this.loading = true;

    /*this._authenticationService
        .login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {
              this._router.navigate([this.returnUrl]);

              //this._router.navigate(['/']);
            },
            error => {
              this.error = error;
              this.loading = false;
            }
        );*/

    if (this.loginForm.valid) {

        const formValue = this.loginForm.value;
        this.authService.signIn(formValue['username'], formValue['password']);

      /*const formValue = this.loginForm.value;
      this.authService.signIn(formValue['username'], formValue['password'])
          .pipe(first())
          .subscribe(
              data => {
                //this._router.navigate([this.returnUrl]);

                this._router.navigate(['/']);
              },
              error => {
                //console.log('error :'+error)
                this.error = error;
                this.loading = false;
              }
          );*/
    }


  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.erreurStatusSubscription = this.authService.erreurStatusSubject.subscribe(
        (erreur: boolean) => {

          console.log(erreur);
          this.erreurStatus = erreur;
          this.loading = !this.erreurStatus;
        }
    );

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    // console.log(this.returnUrl);
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
