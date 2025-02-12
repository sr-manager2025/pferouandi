import {Injectable} from '@angular/core';
import {UpdateInfosUserDTO} from '../../../authentication/models/update-infos-userDTO';
import {environment} from '../../../../../environments/environment';
import {UpdatePwdUserRequestDTO} from '../../../authentication/models/update-pwd-user-requestDTO';
import {SrManagerService} from '../../sr-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AccountSettingsService {

  constructor(private srManagerService: SrManagerService) { }


  updateInfoUser(updateInfoUserDto: UpdateInfosUserDTO) {
    return this.srManagerService.postRessource(environment.authCmdHost + '/updateInfosUser', updateInfoUserDto);
  }


  updatePwdUser(updatePwdUserRequestDTO: UpdatePwdUserRequestDTO) {
    return this.srManagerService.postRessource(environment.authCmdHost + '/updatePwdUser', updatePwdUserRequestDTO);
  }
}
