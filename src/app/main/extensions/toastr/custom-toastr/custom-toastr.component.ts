import {Component} from '@angular/core';
import {toastrSlideY} from './custom-toastr.animation';
import {Toast, ToastPackage, ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-custom-toastr',
  templateUrl: './custom-toastr.component.html',
  animations: [toastrSlideY],
  preserveWhitespaces: false
})
export class CustomToastrComponent extends Toast {
  constructor(protected toastrService: ToastrService, public toastPackage: ToastPackage) {
    super(toastrService, toastPackage);
  }

}
