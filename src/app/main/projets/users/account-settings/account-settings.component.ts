import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {FlatpickrOptions} from 'ng2-flatpickr';
import {Subject, Subscription} from 'rxjs';
import {AppUser} from '../../../authentication/models/app-user';
import {AppRole} from '../../../authentication/models/app-role';
import {RoleListService} from '../role-list.service';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../authentication/auth.service';
import {takeUntil} from 'rxjs/operators';
import {TypeRole} from '../../../authentication/models/type-role';
import {Param} from '../../../parametres/models/param';
import {UpdateInfosUserDTO} from '../../../authentication/models/update-infos-userDTO';
import {NgForm} from '@angular/forms';
import {UpdatePwdUserRequestDTO} from '../../../authentication/models/update-pwd-user-requestDTO';
import Swal from 'sweetalert2';
import {AccountSettingsService} from './account-settings.service';

const URL = 'Users/Mac/Downloads/';

@Component({
    selector: 'app-account-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
    // public rolesSelected: AppRole[] = [];

    /**
     * Constructor
     *
     * @param roleListService
     * @param {AccountSettingsService} _accountSettingsService
     * @param _router
     * @param modalService
     * @param authService
     */
    constructor(private roleListService: RoleListService,
                private _accountSettingsService: AccountSettingsService,
                private _router: Router,
                private modalService: NgbModal,
                private authService: AuthService) {

        this._unsubscribeAll = new Subject();
        this.currentUserSubscription = this.authService.currentUserSubject.subscribe(
            (data: AppUser) => {
                this.currentUser = data;
               // this.avatarImage =  this.currentUser? 'assets/images/portrait/small/'+this.currentUser?.avatar:'assets/images/portrait/small/unknown.png';
            }
        );
        authService.loadCurrentUser();


    }
    // public
    public contentHeader: object;

    public uploader: FileUploader = new FileUploader({
        url: URL,
        isHTML5: true
    });

    public birthDateOptions: FlatpickrOptions = {
        altInput: true
    };
    public passwordTextTypeOld = false;
    public passwordTextTypeNew = false;
    public passwordTextTypeRetype = false;
    public avatarImage = '/Users/mac/Apps/sr-manager/RESSOURCES/data/directory/images/6000.png';

    // private
    private _unsubscribeAll: Subject<any>;
    private currentUserSubscription: Subscription;
    public currentUser: AppUser;
    public roles: AppRole[];

    roleName: string;
    disableUploadImage = true;

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle Password Text Type Old
     */
    togglePasswordTextTypeOld() {
        this.passwordTextTypeOld = !this.passwordTextTypeOld;
    }

    /**
     * Toggle Password Text Type New
     */
    togglePasswordTextTypeNew() {
        this.passwordTextTypeNew = !this.passwordTextTypeNew;
    }

    /**
     * Toggle Password Text Type Retype
     */
    togglePasswordTextTypeRetype() {
        this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
    }

    /**
     * Upload Image
     *
     * @param event
     */
    uploadImage(event: any) {

        if (event.target.files && event.target.files[0]) {

            console.log(event.target.files[0]);

            const reader = new FileReader();


            reader.onload = (event: any) => {
                this.avatarImage = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------


    /**
     * On init
     */
    ngOnInit() {

        this.roleListService.onRolessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            this.roles = response;
        });

        // content header
        this.contentHeader = {
            headerTitle: 'Paramètres du compte utilisateur',
            actionButton: false,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'Home',
                        isLink: true,
                        link: '/'
                    },

                    {
                        name: 'Paramètres du compte',
                        isLink: false
                    }
                ]
            }
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onAddRole(modal: any) {
        this.roleName = '';
        this.modalService.open(modal, {
            centered: true,
            backdrop: false,
            size: 'sm'
        });
    }

    onSaveNewRole(modal: any) {
        const appRole: AppRole = new AppRole(this.roleName, TypeRole.ADMINISTARTION);

        this.roleListService.createRole(appRole).subscribe(
            (data: Param) => {
                this.roleListService.getAppRoles();
                modal.close('Accept click');

            }
        );

    }

    updateInfosGenerales() {
        const roles: string[] = [];
        this.currentUser.appRoles.forEach(appRole => {
            roles.push(appRole.roleName);
        });
        const updateInfoUserDto: UpdateInfosUserDTO = new UpdateInfosUserDTO(
            this.currentUser.username,
            this.currentUser.avatar,
            this.currentUser.firstName,
            this.currentUser.lastName,
            this.currentUser.email,
            roles,
            this.currentUser.accountNonLocked,
            this.currentUser.accountNonExpired,
            this.currentUser.credentialsNonExpired
        );

        this._accountSettingsService.updateInfoUser(updateInfoUserDto).subscribe(
            (data: Param) => {
                this.showSwal('basic', 'success', 'Good job!', 'Infos utilisateur modifiées avec succés', 'btn btn-primary');
            }
        );
    }



    updatePwd(tDPassWordForm: NgForm) {
        console.log(tDPassWordForm.value);
        const updatePwdUserRequestDTO: UpdatePwdUserRequestDTO = new UpdatePwdUserRequestDTO(
            this.currentUser.username,
            tDPassWordForm.value.txtOldPwd,
            tDPassWordForm.value.txtNewPwd,
        );

        this._accountSettingsService.updatePwdUser(updatePwdUserRequestDTO).subscribe(
            data => {
                if (data['result']) {
                    this.showSwal('basic', 'success', 'Good job!', data['message'], 'btn btn-primary');
                    this.authService.logout();
                } else {
                    this.showSwal('basic', 'error', 'Erreur!', data['message'], 'btn btn-danger');
                }
                // this._router.navigate(['/pages/authentication/login-v2']);
            }
        );
    }

    showSwal(type, icone, title: string, message: string, btn) {
        Swal.fire({
            icon: icone,
            title: title,
            titleText: message,
            customClass: {
                confirmButton: btn,
            }
        });
    }


}

