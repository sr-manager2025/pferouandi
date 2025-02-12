import {cloneDeep} from 'lodash';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {GlobalConfig, ToastrService} from 'ngx-toastr';
import {ChauffeurService} from '../chauffeur.service';
import { CoreSidebarService } from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import { CustomToastrComponent } from '../../../../../extensions/toastr/custom-toastr/custom-toastr.component';
import { Chauffeur } from '../../../models/chauffeur';

@Component({
  selector: 'app-new-chauffeur-sidebar',
  templateUrl: './new-chauffeur-sidebar.component.html',
  styleUrls: ['./new-chauffeur-sidebar.component.scss']
})
export class NewChauffeurSidebarComponent implements OnInit {
  selectedFile: File | null = null;
  newChauffeur: Chauffeur = {
    id: 0,
    name: '',
    idn: '',
    role: '',
    phone: '',
    email: '',
    imgPath: ''
  };
  private options: GlobalConfig;

  @Output() chauffeurAdded = new EventEmitter<Chauffeur>();

  constructor(
      private router: Router,
      private location: Location,
      private chauffeurService: ChauffeurService,
      private _coreSidebarService: CoreSidebarService,
      private toastr: ToastrService
  ) {}

  createNewChauffeur(): void {

    this.chauffeurService.createChauffeur(this.newChauffeur, this.selectedFile).then(
        (newChauffeur) => {
          // this.chauffeurAdded.emit(newChauffeur);
          this.toggleSidebar('new-chauffeur-sidebar');
          this.router.navigate(['projets/logistique/enginChantier/chauffeur/chauffeur-list']);


        },
        (error) => {
          console.error('Error creating chauffeur:', error);
        }
    );

    if (this.selectedFile) {

    } else {
      console.error('Please select a file.');
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  toggleSidebar(name: string): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  submit(form): void {
    if (form.valid) {
      this.createNewChauffeur();
    }
  }
  toastrCustomSuccess() {
    const customToastrRef = cloneDeep(this.options);
    customToastrRef.toastComponent = CustomToastrComponent;
    customToastrRef.closeButton = true;
    customToastrRef.tapToDismiss = false;
    customToastrRef.progressBar = true;
    customToastrRef.toastClass = 'toast ngx-toastr';
    this.toastr.success('Have fun storming the castle!', 'Success!', customToastrRef);
  }
  ngOnInit(): void {}
}

