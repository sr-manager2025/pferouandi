import {ColumnMode, DatatableComponent} from '@swimlane/ngx-datatable';
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {VehiculeGpsLocationService} from '../vehicule-gps-location.service';
import {CoreSidebarService} from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import Swal from 'sweetalert2';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import * as feather from 'feather-icons';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {VehiculeGpsLocation} from '../../models/vehicule-gps-location';

@Component({
    selector: 'app-vehicule-list',
    templateUrl: './vehicule-list.component.html',
    styleUrls: ['./vehicule-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class VehiculeListComponent implements OnInit {

    constructor(
        private _coreSidebarService: CoreSidebarService,
        private vehiculeGpsLocationService: VehiculeGpsLocationService,
        private toastr: ToastrService,
        private router: Router,
    ) {
        this._unsubscribeAll = new Subject();

    }
    public rows: VehiculeGpsLocation [] = [];
    public tempData: VehiculeGpsLocation [] = [];

    selectedOption = 15;
    public searchValue = '';
    public ColumnMode = ColumnMode;
    selectedVehicle: any;

    private _unsubscribeAll: Subject<any>;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    protected readonly console = module;

    ngOnInit(): void {
        this.loadVehicles();
        feather.replace();
    }

    loadVehicles(): void {
        this.vehiculeGpsLocationService.onVehiculeListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            rep => {
                if (rep && rep.length > 0) {
                    this.rows = rep;
                    this.tempData = this.rows;
                }
            }, error => {
                console.error('Error fetching vehicles:', error);
            }
        );

        this.vehiculeGpsLocationService.getAllVehiculeGps();

        /*this.vehiculeGpsLocationService.getAllVehicule().subscribe(
          (vehicles) => {
            this.rows = vehicles;
            this.tempData = this.rows;
          },
          (error) => {
            console.error('Error fetching vehicles:', error);
          }
        );*/

    }

    addNewVehicule(): void {
        this.vehiculeGpsLocationService.saveVehiculeFromApi().then(() => {
            this.toastr.success('Vehicule added successfully!');

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
        this.selectedVehicle = vehicle;
        console.log(vehicle);
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    confirmDeleteVehicle(id: number): void {
        if (!id) {
            console.error('ID de véhicule invalide:', id);
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
                this.deleteVehicule(id);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Non annulé',
                    text: 'Votre véhicule est en sécurité :)',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                });
            }
        });
    }

    deleteVehicule(id: number): void {
        this.vehiculeGpsLocationService.deleteVehicule(id).subscribe({
            next: (response) => {
                // Rafraîchir la liste des véhicules ici si nécessaire
                Swal.fire({
                    title: 'Supprimé !',
                    text: 'Le véhicule a été supprimé.',
                    icon: 'success',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                });
            },
            error: (error) => {
                Swal.fire({
                    title: 'Erreur !',
                    text: `Une erreur est survenue lors de la suppression du véhicule : ${error.status} - ${error.message || 'Erreur inconnue'}`,
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
