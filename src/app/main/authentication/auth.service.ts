import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';
import {ToastrService} from 'ngx-toastr';
import {AppUser} from './models/app-user';
import {Role} from './models/role';
import {AppRole} from './models/app-role';

// import * as Stomp from '@stomp/stompjs';
import {SrNotification} from '../../layout/components/navbar/models/sr-notification';

@Injectable({
    providedIn: 'root'
})
export class AuthService {


    public onSrNotificationChanged: BehaviorSubject<SrNotification>;

    isAuth = false;
    // entreprise: Entreprise;

    currentUser: AppUser = new AppUser();
    currentUserSubject = new Subject<AppUser>();


    isErreur: boolean = undefined;
    erreurStatusSubject = new Subject<boolean>();

    private stompClient = null;


    constructor(private http: HttpClient,
                private router: Router,
                private _toastrService: ToastrService) {
        // @ts-ignore
        this.onIntituleCaisseChanged = new BehaviorSubject<IntituleCaisse>();

        // @ts-ignore
        this.onSrNotificationChanged = new BehaviorSubject<SrNotification>();
        // this.emitIntituleCaisse(IntituleCaisse.CAISSE_ADMINISTRATION);
    }


    signIn(username, password) {
        this.http.post(environment.authHost + '/login', {username, password}).subscribe(
            data => {
                if (!this.currentUser) {
                    this.currentUser = new AppUser();
                }
                console.log(this.currentUser);
                this.currentUser.accessToken = data['accessToken'];
                this.currentUser.refreshToken = data['refreshToken'];

                const jwtHelper = new JwtHelperService();
                const objJwt = jwtHelper.decodeToken(this.currentUser.accessToken);
                console.log(objJwt);
                this.currentUser.username = objJwt.sub;
                this.currentUser.roles = objJwt.roles;
                this.currentUser.roles.forEach(role => {
                    const appRole: AppRole = new AppRole(role, null);
                    this.currentUser.appRoles.push(appRole);
                });
                this.isAuth = true;
                this.getProfile();
                // this.getTokenPointage();


                // this.saveToken(this.currentUser.accessToken, this.currentUser.refreshToken);
                this.isErreur = false;
                this.emitErreurStatusSubject();
            }, error1 => {
                // console.log(error1);
                this.isErreur = true;
                this.emitErreurStatusSubject();
            }
        );
    }

    refreshToken() {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.currentUser.refreshToken});
        // console.log(this.currentUser.refreshToken);

        return this.http.get(environment.authCmdHost + '/refreshtoken', {headers: headers}).subscribe(
            data => {
                if (!this.currentUser) {
                    this.currentUser = new AppUser();
                }
                // console.log(this.currentUser);
                this.currentUser.accessToken = data['accessToken'];
                this.currentUser.refreshToken = data['refreshToken'];

                const jwtHelper = new JwtHelperService();
                const objJwt = jwtHelper.decodeToken(this.currentUser.accessToken);
                this.currentUser.username = objJwt.sub;
                this.currentUser.roles = objJwt.roles;
                this.currentUser.roles.forEach(role => {
                    const appRole: AppRole = new AppRole(role, null);
                    this.currentUser.appRoles.push(appRole);
                });
                this.isAuth = true;
                this.getProfile();
                // this.getTokenPointage();


                // this.saveToken(this.currentUser.accessToken, this.currentUser.refreshToken);
                this.isErreur = false;
                this.emitErreurStatusSubject();
            }, error1 => {
                // console.log(error1);
                this.isErreur = true;
                this.emitErreurStatusSubject();
            }
        );
    }

    /*signIn(username, password) {
       var datauser: DataUser = new DataUser(username, password);
        this.http.post(environment.hostAuth+ '/login', datauser, {observe: 'response'}).subscribe(
            response => {
                //console.log(response.headers.get('Authorization'));
                let accessToken = response.headers.get('Authorization');

                this.saveToken(accessToken,null);
                this.router.navigate(['dashboard']);
            }, error1 => {
                //console.log(error1);
            }
        );
    }*/

    public emitErreurStatusSubject() {
        this.erreurStatusSubject.next(this.isErreur);
    }



    getProfile() {
        const headers = new HttpHeaders({'authorization': 'Bearer ' + this.currentUser.accessToken});
        return this.http.get(environment.authQueryHost + '/profile', {headers: headers}).subscribe(
            (data: AppUser) => {
                console.log('getProfile');
                console.log(data);

                this.currentUser.id = data.id;
                this.currentUser.firstName = data.firstName;
                this.currentUser.lastName = data.lastName;
                this.currentUser.email = data.email;
                this.currentUser.avatar = data.avatar;
                this.currentUser.date = data.date;
                this.currentUser.workingDays = data.workingDays;
                this.currentUser.sessionExpired = data.sessionExpired;
                this.currentUserSubject.next(this.currentUser);
                window.localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

                if (!this.currentUser.sessionExpired) {
                    // Display welcome toast!
                    setTimeout(() => {
                        this._toastrService.success(
                            'Vous vous êtes connecté avec succès en tant que ' + this.currentUser.roles[0] +
                            ' à SrManager. Vous pouvez maintenant commencer à explorer.',
                            '👋 Bienvenue, ' + this.currentUser.firstName + ' ' + this.currentUser.lastName + '!',
                            {toastClass: 'toast ngx-toastr', closeButton: true}
                        );
                    }, 1500);

                }
                this.router.navigate(['/']);

            }, error => {
                console.log(error);
            });
    }

    loadCurrentUser() {
        // let myProfile = localStorage.getItem('currentUser');
        this.currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
        this.currentUser?.roles.forEach(role => {
            const appRole: AppRole = new AppRole(role, null);
            this.currentUser?.appRoles.push(appRole);
        });
        this.currentUserSubject.next(this.currentUser);
        /*if (this.isComptableChantier(this.currentUser)) {
            this.emitIntituleCaisse(IntituleCaisse.CAISSE_CHANTIER);
        } else {
            this.emitIntituleCaisse(IntituleCaisse.CAISSE_ADMINISTRATION);
        }*/
        //// console.log(this.currentUser);
    }

    /* loadToken() {
         this.accessToken = localStorage.getItem('accessToken');
         this.refreshToken = localStorage.getItem('refreshToken');
         if (this.accessToken) {
             this.parseJwt(this.accessToken);
         } else {
             this.isAuth = false;
         }
     }*/

    logout() {
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        window.localStorage.removeItem('currentUser');
        this.intParams();
        this.router.navigate(['/authentication/login']);

    }

    private intParams() {
        // this.accessToken = undefined;
        // this.refreshToken = undefined;
        // this.username = undefined;
        // this.currentUser.roles = undefined;
        // this.currentUser = undefined;
        this.currentUserSubject.next(null);
        this.isAuth = false;
    }


    /*isAuth() {
        return  this.currentUser.roles != undefined && (this.isAdmin() || this.isUser() || this.isVnManager()
            || this.isSavManager() || this.isScManager() || this.isPaidManager());
    }*/

    /*loadToken() {
        this.jwt = localStorage.getItem('token');
        this.parseJwt();
    }*/


    saveUser(currentUser: AppUser) {
        const headers = new HttpHeaders({'authorization': 'Bearer ' + this.currentUser.accessToken});
        currentUser.username = this.currentUser.username;
        this.http.post(environment.authCmdHost + '/saveUser', currentUser, {headers: headers}).subscribe(
            (data: AppUser) => {
                this.currentUser = data;
                this.logout();
            });

    }

    updateUser(currentUser: AppUser) {
        const headers = new HttpHeaders({'authorization': 'Bearer ' + this.currentUser.accessToken});
        currentUser.username = this.currentUser.username;

        this.http.post(environment.authCmdHost + '/updateUser', currentUser, {headers: headers}).subscribe(
            (data: AppUser) => {
                this.currentUser = data;
                this.logout();
            });
    }

    updatePwdUser(currentUser: AppUser) {
        // console.log(currentUser);
        const headers = new HttpHeaders({'authorization': 'Bearer ' + this.currentUser.accessToken});
        this.http.post(environment.authCmdHost + '/updatePwdUser', currentUser, {headers: headers}).subscribe(
            (data: AppUser) => {
                this.currentUser = data;
                this.logout();
            });
    }

    initPwd(username: string) {
        const headers = new HttpHeaders({'authorization': 'Bearer ' + this.currentUser.accessToken});
        return this.http.get(environment.authCmdHost + '/initPwd/' + username, {headers: headers});
    }

    backupDb() {
        const headers = new HttpHeaders({'authorization': 'Bearer ' + this.currentUser.accessToken});

        this.http.get(environment.authCmdHost + '/backupDb', {headers: headers}).subscribe(
            data => {
                //// console.log(data);
            }, error => {
            }, () => {
                // console.log('update MVT stock completed');
            });
    }


    public isAdmin(appUser: AppUser): boolean {
        return appUser && appUser.roles && appUser.roles.indexOf(Role.ADMIN) >= 0;
    }

    public isPdg(appUser: AppUser): boolean {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.PDG) >= 0);
    }

    public isDga(appUser: AppUser): boolean {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.DGA) >= 0);
    }

    public isCdg(appUser: AppUser): boolean {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.CDG) >= 0);
    }

    public isDaf(appUser: AppUser): boolean {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.DAF) >= 0);
    }

    public isCaissier(appUser: AppUser): boolean {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.CAISSIER) >= 0);
    }

    public isChefZone(appUser: AppUser): boolean {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.CHEF_ZONE) >= 0);
    }

    public isChefChantier(appUser: AppUser): boolean {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.CHEF_CH) >= 0);
    }

    public isConducteurChantier(appUser: AppUser): boolean {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.COND_CH) >= 0);
    }

    public isTechnicienChantier(appUser: AppUser): boolean {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.TECH_CH) >= 0);
    }

    public isComptableChantier(appUser: AppUser): boolean {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.COMPT_CH) >= 0);
    }

    public isPointeurChantier(appUser: AppUser): boolean {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.POINTEUR) >= 0);
    }

    isRespSt(appUser: AppUser) {
        return appUser.roles
            && (appUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    /*isAssistSt(appUser: AppUser) {
        return appUser.roles
            && (appUser.roles.indexOf(Role.ASSIST_ST) >= 0);
    }*/

    isRespMetre(appUser: AppUser) {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.RESP_METREE) >= 0);
    }

    isRespSi(appUser: AppUser) {
        return appUser && appUser.roles
            && (appUser.roles.indexOf(Role.RESP_SI) >= 0);
    }

    public canViewCptExploitation(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0);
    }
    public canViewPvStr(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.ASSIST_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canViewDetailPvStr(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.ASSIST_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }
    public canClosedPvStr(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0);
    }

    public canCanceledPvStr(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0);
    }


    public canExportPvStrPDF(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.ASSIST_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0);
    }

    public canExportPvStrXls(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.ASSIST_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0);
    }

    public canViewPrices(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_METREE) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canViewBudget(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_CAISSE) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0);
    }

    public canCreateSt(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canEditSt(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canEditAttachement(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canGrantOsForSt(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canValidateSt(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canInvalidatSt(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canDeleteSt(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0);
    }

    public canViewSoustraitancesList(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.TECH_CH) >= 0
                || this.currentUser.roles.indexOf(Role.COND_CH) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_METREE) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canViewAdvancementSt(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.TECH_CH) >= 0
                || this.currentUser.roles.indexOf(Role.COND_CH) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_METREE) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canViewDetailsSubContractor(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canEditDetailsSubContractor(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canViewSituationSt(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_METREE) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canSuspendreSt(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canStopedSt(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canArchivedSt(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    public canAddLineAdvancement(): boolean {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.TECH_CH) >= 0
                || this.currentUser.roles.indexOf(Role.COND_CH) >= 0);
    }

    public canSaisieQteRealisee() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.TECH_CH) >= 0
                || this.currentUser.roles.indexOf(Role.COND_CH) >= 0);
    }

    public canChefZoneValidateLineProgress() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0);
    }

    public canMetreValidateLineProgress() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_METREE) >= 0);
    }

    public canAdminValidateLineProgress() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }


    public canPaidSituationSubContractor() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0);
    }


    public canCloseSituationSubContractor() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0);
    }

    public canArchiveSituationSubContractor() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
            );
    }

    public canCreateRubrieCaisse() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0);
    }

    public canCreateUpdateBudget() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0);
    }

    public canCdgValidateLigneRegCaisse() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.CDG) >= 0);
    }

    canExecuteLigneRegistreCaisse() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.CAISSIER) >= 0);
    }

    public canExportAttachement() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.COND_CH) >= 0
                || this.currentUser.roles.indexOf(Role.TECH_CH) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }


    canViewPaiementsList() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
            );
    }

    canEditMontantEngagement() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canValidateEngagement() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0);
    }

    canReactivateEngagement() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0);
    }

    canExportPvStrToExcel() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA)
            );
    }



    public canAddFactureStr() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.ASSIST_COMPTA) >= 0);
    }
    public canEditFactureStr() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.ASSIST_COMPTA) >= 0);
    }
    public canUploadFactureStr() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.ASSIST_COMPTA) >= 0);
    }

    public canDeleteFactureStr() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0);
    }

    public canAddReglementStr() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.ASSIST_COMPTA) >= 0);
    }

    public canOpenPvStr() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0);
    }



    canPaidCount() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0);
    }

    canPaidExecute() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0);
    }


    canPaidBankRaproched() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0);
    }

    /* canPaidDuplicate() {
         return this.currentUser && this.currentUser.roles
             && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                 || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                 || this.currentUser.roles.indexOf(Role.PDG) >= 0
                 || this.currentUser.roles.indexOf(Role.DGA) >= 0
                 || this.currentUser.roles.indexOf(Role.DAF) >= 0);
     }*/

    canViewItem(item: any) {

        let canView = false;
        // (item.roles ? item.roles.includes(currentUser.roles) : false || item.roles == undefined)

        item.roles.forEach((role: Role) => {
            if (this.currentUser.roles && this.currentUser.roles.indexOf(role) >= 0) {
                canView = true;
                return;
            }
        });

        return canView;


    }


    canViewDashboardAnalytics() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0
                || this.currentUser.roles.indexOf(Role.AUDIT_INTERNE) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0);
    }

    canViewDashboardecommerce() {
        return false;
    }

    canViewDashboardLogistique() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.RESP_LOG) >= 0
                || this.currentUser.roles.indexOf(Role.ASSIST_LOG) >= 0);
    }

    canViewDashboardMarche() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_METREE) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_MARCHE) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canViewDashboardStr() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.COND_CH) >= 0
                || this.currentUser.roles.indexOf(Role.TECH_CH) >= 0);
    }

    canViewCaisseMain() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.CDG) >= 0
                || this.currentUser.roles.indexOf(Role.CAISSIER) >= 0
                || this.currentUser.roles.indexOf(Role.COMPT_CH) >= 0);
    }

    canViewRegistreCaisseAdmin() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0
                || this.currentUser.roles.indexOf(Role.CAISSIER) >= 0);
    }


    canViewDashboardCaisse() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0
                || this.currentUser.roles.indexOf(Role.CAISSIER) >= 0);
    }

    canViewRegistreCaisseChantier() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                // || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                // || this.currentUser.roles.indexOf(Role.MR) >= 0
                // || this.currentUser.roles.indexOf(Role.DAF) >= 0
                // || this.currentUser.roles.indexOf(Role.CDG) >= 0
                // || this.currentUser.roles.indexOf(Role.CAISSIER) >= 0
                // || this.currentUser.roles.indexOf(Role.COMPT_CH) >= 0
            );
    }

    canViewRegistreCaisseDG() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0
                || this.currentUser.roles.indexOf(Role.CAISSIER) >= 0);
    }

    canViewRegistreCaisseExploitation() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0
                || this.currentUser.roles.indexOf(Role.CAISSIER) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0);
    }

    canViewRegistreCaisseTechnique() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0
                || this.currentUser.roles.indexOf(Role.CAISSIER) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_METREE) >= 0);
    }

    canRexecuteLineRegistreCaisse() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0);
    }

    public canExportBudgetCaisse() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0);
    }

    canExportRegistreCaisse() {

    }

    canViewListSubCont() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0);
    }

    canViewBordereau() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.COND_CH) >= 0
                || this.currentUser.roles.indexOf(Role.TECH_CH) >= 0);
    }

    canAddSubArticle() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canAddNewArticle() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canEditArticle() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canEditSatffChantier() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0);
    }

    canViewStaffChatier() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.COND_CH) >= 0
                || this.currentUser.roles.indexOf(Role.TECH_CH) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_METREE) >= 0);
    }

    canAddNewNode() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canEditNode() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canEditBloc() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canEditOldQteSuivi() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canEditPrixSuivi() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canReleaseWarranty() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canStc() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canDeleteNode() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0);
    }

    canViewAllCaisse() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.CAISSIER) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0);
    }

    canValidateSituation() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0);
    }

    canViewContratStr() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.TECH_CH) >= 0
            );
    }

    canRefreshAttachement() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.TECH_CH) >= 0
                || this.currentUser.roles.indexOf(Role.COND_CH) >= 0);
    }

    canCheckLastAttachement() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.CHEF_ZONE) >= 0
                || this.currentUser.roles.indexOf(Role.TECH_CH) >= 0
                || this.currentUser.roles.indexOf(Role.COND_CH) >= 0);
    }

    canUpdateRegsinEmp() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.COMPT_CH) >= 0);
    }


    canonExportTravauxStrToExcel() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0);
    }


    canViewSubcontractingInvoices() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.ASSIST_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0);
    }

    canExportRegSubContractor() {
        return this.currentUser && this.currentUser.roles
            && (this.currentUser.roles.indexOf(Role.ADMIN) >= 0
                || this.currentUser.roles.indexOf(Role.PDG) >= 0
                || this.currentUser.roles.indexOf(Role.DGA) >= 0
                || this.currentUser.roles.indexOf(Role.MR) >= 0
                || this.currentUser.roles.indexOf(Role.DAF) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_ST) >= 0
                || this.currentUser.roles.indexOf(Role.RESP_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.ASSIST_COMPTA) >= 0
                || this.currentUser.roles.indexOf(Role.CDG) >= 0);
    }
}
