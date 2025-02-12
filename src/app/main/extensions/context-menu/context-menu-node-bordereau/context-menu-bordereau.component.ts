import {Component, ViewEncapsulation} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {GlobalConfig, ToastrService} from 'ngx-toastr';
import {ContextMenuService, MenuComponent, MenuPackage} from '@ctrl/ngx-rightclick';

@Component({
  selector: 'app-basic-custom-context-menu',
  templateUrl: './context-menu-bordereau.component.html',
  animations: [
    trigger('menu', [
      state('enter', style({opacity: 1})),
      state('exit, void', style({opacity: 0})),
      transition('* => *', animate(0))
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class ContextMenuBordereauComponent extends MenuComponent {
  // private
  private options: GlobalConfig;

  option1: string;
  option2: string;

  /**
   * Constructor
   *
   * @param {ToastrService} toastr
   * @param {MenuPackage} menuPackage
   * @param {ContextMenuService} contextMenuService
   */
  constructor(
      public menuPackage: MenuPackage,
      public contextMenuService: ContextMenuService,
      private toastr: ToastrService) {
    super(menuPackage, contextMenuService);
    this.options = this.toastr.toastrConfig;
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  /*handleClick(msg: string) {
    const customToastrRef = cloneDeep(this.options);
    customToastrRef.toastComponent = CustomToastrComponent;
    customToastrRef.closeButton = true;
    customToastrRef.tapToDismiss = false;
    customToastrRef.toastClass = 'toast ngx-toastr';
    this.toastr.success('', msg, customToastrRef);
    this.contextMenuService.closeAll();
  }*/

  handleClick(operation: string) {
    if (operation == 'delete') {

    }
    this.contextMenuService.closeAll();
  }

}
