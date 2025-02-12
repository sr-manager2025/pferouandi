import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CreateUserDTO} from '../../../authentication/models/create-userDTO';
import {environment} from '../../../../../environments/environment';
import {SrManagerService} from '../../sr-manager.service';

@Injectable({
  providedIn: 'root'
})
export class UserAddService {
  onUserChanged: BehaviorSubject<any>;

  constructor(private srManagerService: SrManagerService) {
    this.onUserChanged = new BehaviorSubject({});

  }

  createUser(createUserDTO: CreateUserDTO) {
    return this.srManagerService.postRessource(environment.authCmdHost + '/createUser', createUserDTO);
  }

}
