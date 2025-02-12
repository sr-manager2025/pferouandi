import {Component, HostBinding, HostListener, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MediaObserver} from '@angular/flex-layout';

import * as _ from 'lodash';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {CoreConfigService} from '@core/services/config.service';
import {CoreMediaService} from '@core/services/media.service';

import {Router} from '@angular/router';
import {SrManagerService} from '../../../main/projets/sr-manager.service';
import {AuthService} from '../../../main/authentication/auth.service';
import {AppUser} from '../../../main/authentication/models/app-user';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CoreConfig} from '../../../../@core/types';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, OnDestroy {

    /**
     * Constructor
     *
     * @param srManagerService
     * @param {Router} _router
     * @param modalService
     * @param {AuthenticationService} authService
     * @param {CoreConfigService} _coreConfigService
     * @param {CoreSidebarService} _coreSidebarService
     * @param {CoreMediaService} _coreMediaService
     * @param {MediaObserver} _mediaObserver
     * @param {TranslateService} _translateService
     */
    constructor(
        private srManagerService: SrManagerService,
        private _router: Router,
        public modalService: NgbModal,
        public authService: AuthService,
        private _coreConfigService: CoreConfigService,
        private _coreMediaService: CoreMediaService,
        private _coreSidebarService: CoreSidebarService,
        private _mediaObserver: MediaObserver,
        public _translateService: TranslateService
    ) {

        this.currentUserSubscription = this.authService.currentUserSubject.subscribe(
            (data: AppUser) => {
                this.currentUser = data;
                this.avatarImage =  this.currentUser ? 'assets/images/portrait/small/' + this.currentUser?.avatar : 'assets/images/portrait/small/unknown.png';
            }
        );
        authService.loadCurrentUser();


        this.languageOptions = {
            en: {
                title: 'English',
                flag: 'us'
            },
            fr: {
                title: 'French',
                flag: 'fr'
            },
            de: {
                title: 'German',
                flag: 'de'
            },
            pt: {
                title: 'Portuguese',
                flag: 'pt'
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    public horizontalMenu: boolean;
    public hiddenMenu: boolean;
    public avatarImage: string;

    public coreConfig: CoreConfig;
    public currentSkin: string;
    public prevSkin: string;

    public currentUser: AppUser;

    public languageOptions: any;
    public navigation: any;
    public selectedLanguage: any;

    @HostBinding('class.fixed-top')
    public isFixed = false;

    @HostBinding('class.navbar-static-style-on-scroll')
    public windowScrolled = false;

    // Add .navbar-static-style-on-scroll on scroll using HostListener & HostBinding
    private currentUserSubscription: Subscription;

    // Private
    private _unsubscribeAll: Subject<any>;

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
    username: string;
    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (
            (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) &&
            this.coreConfig.layout.navbar.type == 'navbar-static-top' &&
            this.coreConfig.layout.type == 'horizontal'
        ) {
            this.windowScrolled = true;
        } else if (
            (this.windowScrolled && window.pageYOffset) ||
            document.documentElement.scrollTop ||
            document.body.scrollTop < 10
        ) {
            this.windowScrolled = false;
        }
    }

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebar(key): void {
        this._coreSidebarService.getSidebarRegistry(key).toggleOpen();
    }

    /**
     * Set the language
     *
     * @param language
     */
    setLanguage(language): void {
        // Set the selected language for the navbar on change
        this.selectedLanguage = language;

        // Use the selected language id for translations
        this._translateService.use(language);

        this._coreConfigService.setConfig({app: {appLanguage: language}}, {emitEvent: true});
    }

    /**
     * Toggle Dark Skin
     */
    toggleDarkSkin() {
        // Get the current skin
        this._coreConfigService
            .getConfig()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(config => {
                this.currentSkin = config.layout.skin;
            });

        // Toggle Dark skin with prevSkin skin
        this.prevSkin = localStorage.getItem('prevSkin');

        if (this.currentSkin === 'dark') {
            this._coreConfigService.setConfig(
                {layout: {skin: this.prevSkin ? this.prevSkin : 'default'}},
                {emitEvent: true}
            );
        } else {
            localStorage.setItem('prevSkin', this.currentSkin);
            this._coreConfigService.setConfig({layout: {skin: 'dark'}}, {emitEvent: true});
        }
    }

    /**
     * Logout method
     */
    logout() {
        this.authService.logout();
        // this._router.navigate(['/pages/authentication/login-v2']);
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // get the currentUser details from localStorage
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Subscribe to the config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
            this.horizontalMenu = config.layout.type === 'horizontal';
            this.hiddenMenu = config.layout.menu.hidden === true;
            this.currentSkin = config.layout.skin;

            // Fix: for vertical layout if default navbar fixed-top than set isFixed = true
            if (this.coreConfig.layout.type === 'vertical') {
                setTimeout(() => {
                    if (this.coreConfig.layout.navbar.type === 'fixed-top') {
                        this.isFixed = true;
                    }
                }, 0);
            }
        });

        // Horizontal Layout Only: Add class fixed-top to navbar below large screen
        if (this.coreConfig.layout.type == 'horizontal') {
            // On every media(screen) change
            this._coreMediaService.onMediaUpdate.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                const isFixedTop = this._mediaObserver.isActive('bs-gt-xl');
                if (isFixedTop) {
                    this.isFixed = false;
                } else {
                    this.isFixed = true;
                }
            });
        }

        // Set the selected language from default languageOptions
        this.selectedLanguage = _.find(this.languageOptions, {
            id: this._translateService.currentLang
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


    onAccountSettings() {
        this._router.navigate(['/projets/users/account-settings']);
    }

    onInitPwd(modalInitPwd: any) {
        this.username = '';
        this.modalService.open(modalInitPwd, {
            centered: true,
            backdrop: false,
            size: 'sm'
        });
    }

    onSaveInitPwd(modal: any) {
        this.authService.initPwd(this.username).subscribe(
            data => {
                console.log('Pwd initialized....');
            }
        );
        modal.close('Accept click');
    }

    onViewDemandesAvances() {

        this._router.navigate(['/projets/comptabilite/caisse/demandes']);
    }
}
