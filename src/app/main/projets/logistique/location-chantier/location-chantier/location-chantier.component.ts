import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {LocationInvoice} from '../models/location-invoice';
import {LocationChantierService} from '../location-chantier.service';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Client} from '../../models/client';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {UpdateLocationInvoceDTO} from '../dto/update-location-invoce-dto';
import {takeUntil} from 'rxjs/operators';
import {LotService} from '../../lot.service';
import {Lot} from '../../models/lot';
import {Subject} from 'rxjs';
import {FilterLogistique} from '../../../../parametres/models/filter-logistique';
import {LogistiqueFilter} from '@core/enum/LogistiqueFilter';

@Component({
    selector: 'app-location-chantier',
    templateUrl: './location-chantier.component.html',
    styleUrls: ['./location-chantier.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LocationChantierComponent implements OnInit {

    // tslint:disable-next-line:max-line-length
    constructor(private locationChantierService: LocationChantierService, private modalService: NgbModal, private toastr: ToastrService, private lotService: LotService) {
        this._unsubscribeAll = new Subject();
    }

    @ViewChild('editModal', {static: true}) editModal!: ElementRef;

    filteredLocationInvoices: LocationInvoice[] = [];
    ColumnMode = ColumnMode;
    selectedInvoice: any = null;
    clients: Client[] = [];
    lots: Lot[] = [];
    loading: Boolean = true;
    public filterLogistiques: FilterLogistique[] = [];
    public filterLogistique: FilterLogistique = new FilterLogistique();
    public readonly LogistiqueFilter = LogistiqueFilter;

    typeOptions = [
        {name: 'Véhicule', value: 'vehicule'},
        {name: 'Engin', value: 'engin'}
    ];
    genres: string[] = [
        'LOCATION CHARIOT TELESCOPIQUE',
        'LOCATION TRACTOPELLE',
        'LOCATION CHARGEUSE',
        'LOCATION PELLE HYDRAULIQUE',
        'LOCATION NIVLEUSE',
        'LOCATION NACELLE',
        'LOCATION COMPACTEUR',
        'LOCATION GRUE A TOUR',
        'LOCATION GRUE MOBILE',
        'LOCATION GROUPE ELECTROGENNE',
        'LOCATION MINI CHARGEUSE BOBCAT',
        'LOCATION DUMPER',
        'LOCATION CHARIOT ELEVATEUR',
        'LOCATION COMPRESSEUR D\'AIR',
        'LOCATION COMPACTEUR',
        'LOCATION CAMION REMORQUE',
        'LOCATION CAMION DOUBLE PONT 8x4',
        'LOCATION CAMION MALAXEUR',
        'LOCATION CAMION BENNE',
        'LOCATION CAMION PLATEAU'
    ];

    private _unsubscribeAll: Subject<any>;

    getFilterLogistique(): FilterLogistique[] {
        return [
            {name: 'Jour', value: LogistiqueFilter.DAY, isActive: true},
            {name: 'Mois', value: LogistiqueFilter.MONTH, isActive: true},
            {name: 'Affaire', value: LogistiqueFilter.AFFAIRE, isActive: true},
            // {name: 'Véhicule', value: LogistiqueFilter.VEHICULE,isActive:true},
            {name: 'Client', value: LogistiqueFilter.CLIENT, isActive: true},
            {name: 'Lot', value: LogistiqueFilter.LOT, isActive: true},
            // {name: 'Sous traitant', value: LogistiqueFilter.SOUS_TRAITANT,isActive:true},
        ];
    }

    ngOnInit(): void {

        this.filterLogistiques = this.getFilterLogistique();
        this.loadLocationInvoices();
        this.fetchClients();
        this.fetchLots();
    }

    loadLocationInvoices(): void {
        this.locationChantierService.getAllLocationInvoice()
            .then((data: LocationInvoice[]) => {
                this.filteredLocationInvoices = data;
                console.log('Loaded Invoices:', this.filteredLocationInvoices); // Inspect the data
            })
            .catch((error) => {
                console.error('Error loading location invoices:', error);
            });
    }

    // Conditional styling for Montant HT
    getColor(value: number): string {
        if (value > 10000) {
            return 'green';
        }
        if (value > 5000) {
            return 'orange';
        }
        return 'red';
    }

    fetchLots(): void {
        this.lotService.onLotListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (data) => {
                console.log('Fetched Lots:', data);
                if (data) {
                    this.lots = data;
                }
            });

        this.lotService.allLots();
    }


    fetchClients(): void {
        this.locationChantierService.getAllClients().then((data: Client[]) => {
            this.clients = data;
            console.log('Clients:', this.clients);
        });
    }

    selectInvoice(invoice: any): void {
        const selectedClient = this.clients.find(client => client.id === invoice.clientId);
        const selectedLot = this.lots.find(lot => lot.id === invoice.lotId);
        this.selectedInvoice = {
            ...invoice,
            clientId: selectedClient ? selectedClient.id : null,
            clientName: selectedClient ? selectedClient.name : null,
            lotId: selectedLot ? selectedLot.id : null,
            lotName: selectedLot ? selectedLot.name : null,
        };
    }

    onLotChange(event: any): void {
        console.log('Selected Lot ID:', event.value);
        const selectedLot = this.lots.find(lot => lot.id === event.value);
        console.log('Matching Lot:', selectedLot);

        if (selectedLot) {
            this.selectedInvoice.lotName = selectedLot.name;
        } else {
            this.selectedInvoice.lotName = '';
        }
    }


    openEditModal(row: any): void {
        this.selectInvoice(row);
        const modalRef = this.modalService.open(this.editModal, {size: 'lg', centered: true});
        modalRef.result.then(
            (result) => {
                console.log('Modal closed with result:', result);
            },
            (reason) => {
                console.log('Modal dismissed with reason:', reason);
            }
        );
    }

    closeModal(): void {
        this.modalService.dismissAll();
    }

    async updateSelectedInvoice(): Promise<void> {
        console.log('Updating Invoice:', this.selectedInvoice);

        const selectedLot = this.lots.find(lot => lot.id === this.selectedInvoice.lotId);
        if (selectedLot) {
            this.selectedInvoice.lotName = selectedLot.name;
        } else {
            this.selectedInvoice.lotName = '';
        }

        const updateLocationInvoceDTO = new UpdateLocationInvoceDTO(
            this.selectedInvoice.id,
            this.selectedInvoice.type,
            this.selectedInvoice.lotId,
            this.selectedInvoice.lotName,
            this.selectedInvoice.clientId,
            this.selectedInvoice.clientName,
            this.selectedInvoice.genreVehicule
        );

        console.log('Payload:', updateLocationInvoceDTO);

        // Confirmation dialog in French
        const result = await Swal.fire({
            title: 'Êtes-vous sûr?',
            text: 'Voulez-vous vraiment mettre à jour cette facture?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7b2121',
            cancelButtonColor: '#8f2b2b',
            confirmButtonText: 'Oui, mettre à jour!',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                const updatedInvoice = await this.locationChantierService.updateLocationInvoice(
                    this.selectedInvoice.id,
                    updateLocationInvoceDTO
                );
                this.loadLocationInvoices();
                this.closeModal();
                console.log('Updated Invoice Response:', updatedInvoice);

                // Success message
                Swal.fire(
                    'Mis à jour!',
                    'La facture a été mise à jour avec succès.',
                    'success'
                );
            } catch (error) {
                console.error('Update Error:', error);

                // Error message
                Swal.fire(
                    'Erreur!',
                    'Une erreur s\'est produite lors de la mise à jour de la facture.',
                    'error'
                );
            }
        }
    }
}

