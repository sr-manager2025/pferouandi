import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import Swal from 'sweetalert2';
import {ChauffeurService} from '../chauffeur.service';
import {CoreSidebarService} from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {CoreConfigService} from '../../../../../../../@core/services/config.service';
import {takeUntil} from 'rxjs/operators';
import {Chauffeur} from '../../../models/chauffeur';
import {DatatableComponent, ColumnMode} from '@swimlane/ngx-datatable';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-chauffeur-vh-list',
  templateUrl: './chauffeur-vh-list.component.html',
  styleUrls: ['./chauffeur-vh-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChauffeurVhListComponent implements OnInit {

  constructor(
      private _chauffeurService: ChauffeurService,
      private _coreSidebarService: CoreSidebarService,
      private _coreConfigService: CoreConfigService
  ) {
    this._unsubscribeAll = new Subject();
  }
  public rows: Chauffeur[] = [];
  public selectedOption = 20;
  public ColumnMode = ColumnMode;
  public tempData: Chauffeur[] = [];
  public searchValue = '';
  chauffeurs: Chauffeur[] = [];
  selectedChauffeur: any;


  @ViewChild(DatatableComponent) table: DatatableComponent;

  private _unsubscribeAll: Subject<any>;

  // leteChauffeur(id: number): void {
  // this._chauffeurService.deleteChauffeur(id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
  //   this.loadChauffeurs();
  // });
  // }
  // avatarImage: string = "assets/images/avatars/1.png";
  avatarImage = '/assets/images/avatars/2.png';

  ngOnInit(): void {
    this.loadChauffeurs();
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  loadChauffeurs(): void {
    /*this._chauffeurService.getAllChauffeurs().pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
    });*/

    this._chauffeurService.onChauffeurListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
        data => {
          if (data && data.length > 0) {
            this.rows = Array.from(data);
            this.tempData = Array.from(data);
          }
        });
    this._chauffeurService.getAllChauffeurs();

  }


  filterUpdate(event): void {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  toggleSidebar(name: string, chauffeur?: any): void {
    this.selectedChauffeur = chauffeur;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  getImageUrl(imgPath: string): string {
    console.log(imgPath);
    return imgPath; // Adjust the base URL as needed
  }
  onChauffeurAdded(newChauffeur: Chauffeur): void {
    this.chauffeurs.push(newChauffeur);
    this.loadChauffeurs();
  }
  confirmDeleteChauffeur(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteChauffeur(id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your chauffeur is safe :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    });
  }

  deleteChauffeur(id: number): void {
    this._chauffeurService.deleteChauffeur(id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loadChauffeurs();
      Swal.fire({
        title: 'Deleted!',
        text: 'The chauffeur has been deleted.',
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-success'
        }
      });
    });
  }

}
