import { ColumnMode } from '@swimlane/ngx-datatable';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { EnginGpsLocationService } from '../../mouvement-engin/engin-gps-location.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EnginGpsLocation } from '../../models/EnginGpsLocation';
import { takeUntil } from 'rxjs/operators';
import { CoreSidebarService } from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-engin-list',
  templateUrl: './engin-list.component.html',
  styleUrls: ['./engin-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EnginListComponent implements OnInit {

  public rows: EnginGpsLocation [] = [];
  public tempData: EnginGpsLocation [] = [];
  selectedOption = 15;
  public searchValue = '';
  public ColumnMode = ColumnMode;
  private _unsubscribeAll: Subject<any>;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  selectedEngin: any;
  engin: any[] = []; // List of vehicles
  isLoading = false; // Loading indicator



  constructor(
    private _coreSidebarService: CoreSidebarService,
    private enginGpsLocationService: EnginGpsLocationService,
    private toastr: ToastrService,

  ) {
    this._unsubscribeAll = new Subject();
   }

  ngOnInit(): void {
    this.loadEngin();
    this.refreshData();
  }

  loadEngin(): void {
    this.enginGpsLocationService.onEnginListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
        rep => {
            if (rep && rep.length > 0) {
                this.rows = rep;
                this.tempData = this.rows;
            }
        }, error => {
            console.error('Error fetching vehicles:', error);
        }
    );

    this.enginGpsLocationService.getAllEnginGps();


}
ChargerNewEngin(): void {
  this.enginGpsLocationService.saveEnginFromApi().then(() => {
      this.toastr.success('Engin added successfully!');
      console.log('Engin added ');
  });
}

filterUpdate(event): void {
  const val = event.target.value.toLowerCase();
  const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.rows = temp;
  this.table.offset = 0;
}
toggleSidebar(name: string, vehicle?: any): void {
  this.selectedEngin = vehicle;
  console.log(vehicle);
  this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
}
refreshData(): void {
  this.isLoading = true;
  this.enginGpsLocationService.getAllEnginGps().then(
    (data) => {
      this.engin = data;
      this.isLoading = false;
    },
    (error) => {
      console.error('Error refreshing data:', error);
      this.isLoading = false;
    }
  );
}
confirmDeleteEngin(id: number): void {
        if (!id) {
            console.error('ID de Engin invalide:', id);
            return; // Quitter si l'ID du véhicule est indéfini ou invalide
        }

        Swal.fire({
            title: 'Êtes-vous sûr(e) ?',
            text: 'Vous ne pourrez pas annuler cette action !',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimez-le !',
            cancelButtonText: 'Non, annuler !',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteEngin(id);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Non annulé',
                    text: 'Votre Engin est en sécurité :)',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                });
            }
        });
    }
    deleteEngin(id: number): void {
            this.enginGpsLocationService.deleteEngin(id).subscribe({
                next: (response) => {
                    // Rafraîchir la liste des véhicules ici si nécessaire
                    Swal.fire({
                        title: 'Supprimé !',
                        text: 'Engin a été supprimé.',
                        icon: 'success',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    });
                },
                error: (error) => {
                    Swal.fire({
                        title: 'Erreur !',
                        text: `Une erreur est survenue lors de la suppression Engin : ${error.status} - ${error.message || 'Erreur inconnue'}`,
                        icon: 'error',
                        customClass: {
                            confirmButton: 'btn btn-danger'
                        }
                    });
                    console.error('Erreur de suppression :', error); // Détails de l'erreur pour le débogage
                }
            });
        }


}
