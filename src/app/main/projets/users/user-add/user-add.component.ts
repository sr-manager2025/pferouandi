import {Component, OnInit, ViewEncapsulation} from '@angular/core';
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
import Swal from 'sweetalert2';
import {CreateUserDTO} from '../../../authentication/models/create-userDTO';
import {UserAddService} from './user-add.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserAddComponent implements OnInit {
// public
  public contentHeader: object;


  // private
  private _unsubscribeAll: Subject<any>;
  private currentUserSubscription: Subscription;
  public accountUser: AppUser;
  public userCreated: AppUser;
  public roles: AppRole[];
  // public rolesSelected: AppRole[] = [];

  public avatarImage = 'assets/images/portrait/small/unknown.png';

  roleName: string;
  disableUploadImage = true;


  /**
   * Constructor
   *
   * @param _accountSettingsService
   * @param _roleListService
   * @param userEditService
   * @param _router
   * @param modalService
   * @param authService
   */
  constructor(private _roleListService: RoleListService,
              private userAddService: UserAddService,
              private _router: Router,
              private modalService: NgbModal,
              private authService: AuthService) {
    this._unsubscribeAll = new Subject();
    this.userCreated = new AppUser();

    this.currentUserSubscription = this.authService.currentUserSubject.subscribe(
        (data: AppUser) => {
          this.accountUser = data;
        }
    );
    authService.loadCurrentUser();
  }


  /**
   * On init
   */
  ngOnInit() {

    this._roleListService.onRolessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
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

    this._roleListService.createRole(appRole).subscribe(
        (data: Param) => {
          this._roleListService.getAppRoles();
          modal.close('Accept click');

        }
    );

  }

  createUser() {
    const roles: string[] = [];
    this.userCreated.appRoles.forEach(appRole => {
      roles.push(appRole.roleName);
    });
    /*
    username: string,
                password: string,
                firstName: string,
                lastName: string,
                email: string,
                avatar: string,
                roles: string[]
     */
    const createUserDTO: CreateUserDTO = new CreateUserDTO(
        this.userCreated.username,
        this.userCreated.username + '@srmanager',
        this.userCreated.firstName,
        this.userCreated.lastName,
        this.userCreated.email,
        'unknown.png',
        roles,
    );

    this.userAddService.createUser(createUserDTO).subscribe(
        (data: Param) => {
          this.showSwal('basic', 'success', 'Good job!', 'Utilisateur crée avec succés', 'btn btn-primary');
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
