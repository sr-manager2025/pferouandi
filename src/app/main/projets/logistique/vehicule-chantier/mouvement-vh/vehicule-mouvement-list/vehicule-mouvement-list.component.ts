import {ColumnMode} from '@swimlane/ngx-datatable';

import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import Swal from 'sweetalert2';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {AbstractControl, ValidatorFn} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FromMouvement} from '../../models/FromMouvement';
import {VehiculeRoute} from '../../models/vehicule-route';

import {VehiculeRouteService} from '../vehicule-route.service';
import {UpdateFillingPercentageDTO} from '../../models/DTO/UpdateFillingPercentageDTO';
import {TripImputationRequestDTO} from '../../models/DTO/TripImputationRequestDTO';
import {TripImputationResponseDTO} from '../../models/DTO/TripImputationResponseDTO';
import {FromMouvementResponseDTO} from '../../models/DTO/FromMouvementResponseDTO';
import {FromMouvementRequestDTO} from '../../models/DTO/FromMouvementRequestDTO';
import {Client} from '../../../models/client';
import {Fournisseur} from '../../../models/fournisseur';
import {ImputationService} from '../../../imputation.service';
import {FournisseurService} from '../../../fournisseur.service';
import {LotService} from '../../../lot.service';
import {SubContractorService} from '../../../subContractor.service';
import {Affaire} from '../../../models/affaire';
import {SubContractor} from '../../../../../../../@core/models/sub-contractor';
import {RequestService} from '../../../../../../../@core/enum/RequestService';
import {SelectYear} from '../../../../../parametres/models/select-year';
import {SelectMonth} from 'app/main/parametres/models/select-month';
import {FilterLogistique} from '../../../../../parametres/models/filter-logistique';
import {ParamsService} from 'app/main/parametres/services/params.service';
import {Lot} from '../../../models/lot';
import {LogistiqueFilter} from '@core/enum/LogistiqueFilter';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface AssociateRequest {
    fromMouvements: FromMouvement[];
    toAffaireId: number;
}

export function fromMouvementValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const fournisseurs = control.get('fournisseurs')?.value;
        const affaire = control.get('affaire')?.value;

        if (
            fournisseurs &&
            fournisseurs.length > 0 &&
            affaire &&
            affaire.length > 0
        ) {
            return {bothProvided: true};
        }
        if (!fournisseurs && !affaire) {
            return {noneProvided: true};
        }

        return null;
    };
}

@Component({
    selector: 'app-vehicule-mouvement-list',
    templateUrl: './vehicule-mouvement-list.component.html',
    styleUrls: ['./vehicule-mouvement-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class VehiculeMouvementListComponent implements OnInit {

    constructor(
        private vehiculeRouteService: VehiculeRouteService,
        private imputationService: ImputationService,
        private lotService: LotService,
        private fournisseurService: FournisseurService,
        private subContractorService: SubContractorService,
        private modalService: NgbModal,
        private paramsService: ParamsService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef
    ) {
        this._unsubscribeAll = new Subject();
    }

    public years: SelectYear[] = [];
    public selectedYear: SelectYear;

    public months: SelectMonth[] = [];
    public selectedMonth: SelectMonth;

    public filterLogistiques: FilterLogistique[] = [];
    public filterLogistique: FilterLogistique = new FilterLogistique();

    public ColumnMode = ColumnMode;

    private _unsubscribeAll: Subject<any>;

    selectedRow: any = null;
    selectedFile: File | null = null;
    clients: Client[] = [];
    lots: Lot[] = [];
    subContractors: SubContractor[] = [];
    // -------------------------------------------------------
    vehiculeRoutes: VehiculeRoute[] = [];
    filteredRoutes: VehiculeRoute[] = [];
    fromMouvements: FromMouvementResponseDTO[] = [];
    affaires: Affaire[] = [];
    fournisseurs: Fournisseur[] = [];
    toAffaireId: number | null = null;
    selectedVehiculeRoute: VehiculeRoute | null = null;
    filterDate?: string;
    filterVehiculeName = '';
    // Define a map to track disabled states for each fromMouvement
    disabledStates: {
        [key: number]: { disableFournisseur: boolean; disableAffaire: boolean };
    } = {};
    // --------------------------------------------
    vehiculeRouteId: number | undefined;
    imputations: TripImputationResponseDTO[] = [];

    // -----------------------------------------------
    filterMonth = '';
    rows: VehiculeRoute[] = [];
    tripImputationResponseDTO: TripImputationResponseDTO = {
        id: null,
        affaireId: null,
        affaireCode: null,
        fillingPercentage: 0,
        observation: '',
        clientId: null,
        clientName: '',
        lotId: null,
        lotName: null,
        subContractorId: null,
        subContractorFullName: '',
        costImputation: null,
    };
    fromMouvementResponseDTO: FromMouvementResponseDTO = {
        id: 0,
        vehiculeRouteId: null,
        affaireId: null,
        affaireCode: '',
        fournisseurId: null,
        fournisseurName: '',
        bl: '',
        blMontant: 0,
        dateBl: new Date(),
    };

    currentFromMouvement: FromMouvementResponseDTO;
    isFournisseurDisabled = false;
    isAffaireDisabled = false;
    @ViewChild('addImputationModal') addImputationModal: TemplateRef<any>;
    @ViewChild('editeImputationModal') editeImputationModal: TemplateRef<any>;
    @ViewChild('addFromMouvementModal') addFromMouvementModal: TemplateRef<any>;
    @ViewChild('editeFromMouvementModal')
    editeFromMouvementModal: TemplateRef<any>;

    ngbDateBl: NgbDateStruct;


    mode = 'display';
    showZeroKmRows = false;

    loading: Boolean = true;
    public readonly LogistiqueFilter = LogistiqueFilter;

    getFilterLogistique(): FilterLogistique[] {
        return [
            {name: 'Jour', value: LogistiqueFilter.DAY, isActive: true},
            {name: 'Mois', value: LogistiqueFilter.MONTH, isActive: true},
            // {name: 'Affaire', value: LogistiqueFilter.AFFAIRE,isActive:true},
            // {name: 'Véhicule', value: LogistiqueFilter.VEHICULE,isActive:true},
            // {name: 'Client', value: LogistiqueFilter.CLIENT,isActive:true},
            // {name: 'Lot', value: LogistiqueFilter.LOT,isActive:true},
            // {name: 'Sous traitant', value: LogistiqueFilter.SOUS_TRAITANT,isActive:true},
        ];
    }

    ngOnInit(): void {

        this.years = this.paramsService.getYears();
        this.selectedYear = this.paramsService.getOneYearByValue(new Date().getFullYear());

        this.months = this.paramsService.getMonths();
        this.selectedMonth = this.paramsService.getOneMonthByValue(new Date().getMonth() + 1);


        this.filterLogistiques = this.getFilterLogistique();


        const today = new Date();
        this.filterDate = today.toISOString().split('T')[0];

        this.loadAffaires();
        this.loadFournisseurs();
        this.filterData();
        this.fetchClients();
        this.fetchLots();
        this.loadRoutes();
    }

    onFilterTypeChange(): void {
        this.loading = true;
        // Reset filters when the filter type changes
        this.filterDate = new Date().toISOString().split('T')[0];
        this.filterMonth = this.selectedYear.value + '-' + this.selectedMonth.month;

        this.loadRoutes();
    }

    filterData(): void {


        this.filteredRoutes = this.vehiculeRoutes.filter((vehiculeRoute: VehiculeRoute) => {

            const matchesDate = this.filterDate
                // tslint:disable-next-line:no-non-null-assertion
                ? new Date(vehiculeRoute.date!).toISOString().split('T')[0] === this.filterDate
                : true;

            const matchesMonth = this.filterMonth
                // tslint:disable-next-line:no-non-null-assertion
                ? new Date(vehiculeRoute.date!).toISOString().split('T')[0].substring(0, 7) === this.filterMonth
                : true;

            const matchesVehiculeName = this.filterVehiculeName
                ? vehiculeRoute.vehiculeGpsLocation?.name
                    ?.toLowerCase()
                    .includes(this.filterVehiculeName.toLowerCase())
                : true;

            const routeLength = Number(vehiculeRoute.routeLength);

            // If showZeroKmRows is true, only show rows with routeLength === 0
            const matchesKm = this.showZeroKmRows ? routeLength === 0 : routeLength !== 0;

            // Apply the appropriate filter based on the filter type
            this.loading = false;
            // tslint:disable-next-line:max-line-length
            return (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.DAY ? matchesDate : matchesMonth) && matchesVehiculeName && matchesKm;
        });
    }

    // checkbox state
    toggleZeroKmRows(event: any): void {
        console.log('Checkbox clicked, new state:', event.target.checked);
        this.showZeroKmRows = event.target.checked;
        this.filterData();
    }

    fetchClients(): void {
        this.vehiculeRouteService.getAllClients().then((data: Client[]) => {
            this.clients = data;
            console.log('Clients:', this.clients);
        });
    }

    fetchLots(): void {
        this.lotService.onLotListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (data) => {
                if (data) {
                    this.lots = data;
                }
            });

        this.lotService.allLots();

    }

    loadRoutes(): void {
        this.filterMonth = this.selectedYear.value + '-' + this.selectedMonth.month;
        this.loading = true;
        this.vehiculeRoutes = [];
        this.filteredRoutes = [];

        console.log(this.filterMonth);
        console.log(this.filterDate);
        console.log(this.filterLogistique.value);

        if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.DAY && this.filterDate) {
            // Load data for a specific date (daily)
            this.vehiculeRouteService.getVehiculeByDate(this.filterDate).then(
                (routes) => {
                    this.handleRoutesResponse(routes);
                },
                (error) => {
                    console.error('Error loading routes by date:', error);
                }
            );
        } else if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.MONTH && this.filterMonth) {
            // Load data for a specific month
            this.vehiculeRouteService.getVehiculeByMonth(this.filterMonth).then(
                (routes) => {
                    this.handleRoutesResponse(routes);
                },
                (error) => {
                    console.error('Error loading routes by month:', error);
                }
            );
        }
    }

// Helper method to handle the routes response
    private handleRoutesResponse(routes: any[]): void {
        this.vehiculeRoutes = Array.isArray(routes)
            ? routes.map((route) => ({
                ...route,
                isEditing: false,
            }))
            : [];
        this.loading = false;
        this.filteredRoutes = this.vehiculeRoutes;
        this.filterData();
    }

    loadAffaires(): void {
        this.imputationService.onImputationListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (data) => {
                if (data) {
                    this.affaires = data;
                }
            });

        this.imputationService.byRequestService(RequestService.LOGISTIQUE);
    }

    loadFournisseurs(): void {
        this.fournisseurService.onFournisseurListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
            if (data) {
                this.fournisseurs = data;
            }
        });

        this.fournisseurService.getAllFournisseurs();

    }

    openModalFromTo(modalFromTo: any, vehiculeRoute: VehiculeRoute) {
        this.selectedVehiculeRoute = vehiculeRoute;
        this.vehiculeRouteId = vehiculeRoute?.id;

        if (!this.vehiculeRouteId) {
            console.error('Vehicule Route ID is missing, cannot open modal.');
            return;
        }
        this.vehiculeRouteService.getFromMouvementByVehiculeRouteId(this.vehiculeRouteId)
            .then((data: any) => {
                console.log('Fetched imputations:', data);
                this.fromMouvements = data;
                this.modalService.open(modalFromTo, {size: 'xl', centered: true});
            }, (error) => {
                console.error('Error fetching imputations:', error);
            });
    }

    closeModal(): void {
        this.modalService.dismissAll();
    }

    removeFromMouvement(fromMouvement: FromMouvement): void {
        console.log('Bouton de suppression cliqué pour :', fromMouvement);

        const isNew = !fromMouvement.id;

        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: isNew
                ? 'Cette entrée sera supprimée sans être sauvegardée.'
                : 'Vous ne pourrez pas revenir en arrière !',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimez-le !',
            cancelButtonText: 'Annuler',
        }).then((result) => {
            if (result.isConfirmed) {
                if (isNew) {
                    this.fromMouvements = this.fromMouvements.filter(
                        (fm) => fm !== fromMouvement
                    );
                    Swal.fire('Supprimé !', 'Votre mouvement a été supprimé.', 'success');
                } else {
                    this.vehiculeRouteService.deleteFromMouvement(fromMouvement.id).subscribe({
                        next: () => {
                            this.fromMouvements = this.fromMouvements.filter(
                                (fm) => fm !== fromMouvement
                            );
                            Swal.fire(
                                'Supprimé !',
                                'Votre mouvement a été supprimé.',
                                'success'
                            );
                        },
                        error: (error) => {
                            console.error(
                                'Erreur lors de la suppression du mouvement :',
                                error
                            );
                            Swal.fire(
                                'Erreur !',
                                'Un problème est survenu lors de la suppression du mouvement.',
                                'error'
                            );
                        },
                    });
                    this.loadRoutes();
                }
            }
        });
    }

    onAffaireChange(): void {
        if (this.currentFromMouvement.affaireId) {
            this.isFournisseurDisabled = true;
        } else {
            this.isFournisseurDisabled = false;
            this.currentFromMouvement.fournisseurId = null;
        }
    }

    // Method to reset the FromMouvement data
    resetFromMouvement() {
        this.currentFromMouvement = new FromMouvementRequestDTO(
            null,
            null,
            null,
            null,
            null,
            null,
            '',
            0,
            new Date()
        );
        this.isAffaireDisabled = false;
        this.isFournisseurDisabled = false;
    }

    onFournisseurChange(): void {
        if (this.currentFromMouvement.fournisseurId) {
            this.isAffaireDisabled = true;
        } else {
            this.isAffaireDisabled = false;
        }
    }

    openAddFromMouvementModal() {
        this.resetFromMouvement();
        this.modalService.open(this.addFromMouvementModal, {
            size: 'lg',
            centered: true,
        });
    }

    saveFromMouvement(modal: any) {
        if (!this.selectedVehiculeRoute) {
            Swal.fire(
                'Erreur',
                'Veuillez sélectionner une Route de Véhicule avant de sauvegarder.',
                'error'
            );
            return;
        }

        if (
            !this.currentFromMouvement ||
            this.currentFromMouvement.blMontant === undefined ||
            this.currentFromMouvement.blMontant < 0 ||
            !this.currentFromMouvement.bl ||
            !this.currentFromMouvement.dateBl
        ) {
            Swal.fire(
                'Erreur',
                'Données invalides. Veuillez vérifier vos entrées.',
                'error'
            );
            return;
        }

        const selectedAffaire = this.currentFromMouvement.affaire;
        const selectedFournisseur = this.currentFromMouvement.fournisseur;

        if (selectedAffaire && selectedFournisseur) {
            Swal.fire(
                'Erreur de Sélection',
                'Vous ne pouvez pas sélectionner à la fois une Affaire et un Fournisseur. Veuillez choisir uniquement l\'un des deux.',
                'error'
            );
            return;
        }

        if (!selectedAffaire && !selectedFournisseur) {
            Swal.fire(
                'Erreur de Sélection',
                'Veuillez sélectionner soit une Affaire soit un Fournisseur avant de sauvegarder.',
                'error'
            );
            return;
        }

        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: 'Vous êtes sur le point de sauvegarder le Mouvement d\'origine.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, sauvegardez-le !',
            cancelButtonText: 'Non, annulez !',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Prepare the request DTO
                    const fromMouvementRequestDTO = new FromMouvementRequestDTO(
                        this.currentFromMouvement.id,
                        this.selectedVehiculeRoute.id,
                        selectedAffaire ? selectedAffaire.id : null,
                        selectedAffaire ? selectedAffaire.code : null,
                        selectedFournisseur ? selectedFournisseur.id : null,
                        selectedFournisseur ? selectedFournisseur.intituleFournisseur : null,
                        this.currentFromMouvement.bl,
                        this.currentFromMouvement.blMontant,
                        new Date(this.currentFromMouvement.dateBl)
                    );

                    // Save the FromMouvement
                    await this.vehiculeRouteService.saveFromMouvement(fromMouvementRequestDTO);

                    // Show success message
                    Swal.fire(
                        'Succès',
                        'Mouvement d\'origine sauvegardé avec succès.',
                        'success'
                    ).then(() => {
                        modal.close();

                        // Refresh the list of FromMouvements for the current vehiculeRouteId
                        this.vehiculeRouteService.getFromMouvementByVehiculeRouteId(this.vehiculeRouteId)
                            .then((data: any) => {
                                console.log('Fetched imputations:', data);
                                this.fromMouvements = data;
                            }, (error) => {
                                console.error('Error fetching imputations:', error);
                            });

                        // Optionally refresh other related data
                        //  this.vehiculeRouteService.getVehiculeByDate(this.filterDate);
                        this.loadRoutes();
                    });
                } catch (error: any) {
                    // Handle errors
                    if (error.status === 400) {
                        Swal.fire(
                            'Erreur de Validation',
                            'Les données saisies sont invalides. Veuillez vérifier et réessayer.',
                            'error'
                        );
                    } else if (error.status === 404) {
                        Swal.fire(
                            'Erreur',
                            'La Route de Véhicule ou une autre ressource liée n\'a pas été trouvée.',
                            'error'
                        );
                    } else if (error.status === 500) {
                        Swal.fire(
                            'Erreur Interne',
                            'Une erreur interne s\'est produite. Veuillez réessayer plus tard.',
                            'error'
                        );
                    } else {
                        Swal.fire(
                            'Erreur Inconnue',
                            'Une erreur inattendue est survenue : ' + error.message,
                            'error'
                        );
                    }
                    console.error('Erreur lors de la sauvegarde du Mouvement d\'origine :', error);
                }
            }
        });
    }

    openEditFromMouvementModal(fromMouvement: FromMouvementResponseDTO) {
        this.fromMouvementResponseDTO = fromMouvement;
        console.log(fromMouvement);
        this.ngbDateBl = {
            day: new Date(this.fromMouvementResponseDTO?.dateBl).getDate(),
            month: new Date(this.fromMouvementResponseDTO?.dateBl).getMonth() + 1,
            year: new Date(this.fromMouvementResponseDTO?.dateBl).getFullYear(),
        };

        this.fromMouvementResponseDTO.affaire = new Affaire(fromMouvement.affaireId, fromMouvement.affaireCode);

        this.fromMouvementResponseDTO.fournisseur = {
            id: fromMouvement.fournisseurId,
            abbreviationFournisseur: fromMouvement.fournisseurName,
            intituleFournisseur: fromMouvement.fournisseurName,
            adresseFournisseur: '',
            ice: '',
            email: '',
            telephone: '',
            contact: '',
        };

        console.log(this.fromMouvementResponseDTO);

        // Open the modal
        this.modalService.open(this.editeFromMouvementModal, {
            size: 'lg',
            centered: true,
        });
    }

    async updateFromMouvement(modal: any) {
        if (!this.vehiculeRouteId) {
            Swal.fire(
                'Erreur',
                'Veuillez sélectionner une Route de Véhicule avant de sauvegarder.',
                'error'
            );
            return;
        }

        console.log('Affaire:', this.fromMouvementResponseDTO.affaire);
        console.log('Fournisseur:', this.fromMouvementResponseDTO.fournisseur);

        const selectedAffaire = this.fromMouvementResponseDTO.affaire;
        const selectedFournisseur = this.fromMouvementResponseDTO.fournisseur;

        if (selectedAffaire && selectedFournisseur) {
            Swal.fire(
                'Erreur de Sélection',
                'Vous ne pouvez pas sélectionner à la fois une Affaire et un Fournisseur. Veuillez choisir uniquement l\'un des deux.',
                'error'
            );
            return;
        }

        if (!selectedAffaire && !selectedFournisseur) {
            Swal.fire(
                'Erreur de Sélection',
                'Veuillez sélectionner soit une Affaire soit un Fournisseur avant de sauvegarder.',
                'error'
            );
            return;
        }

        // Check for invalid form data
        const {bl, blMontant, dateBl} = this.fromMouvementResponseDTO;

        if (!bl || bl.trim() === '') {
            Swal.fire(
                'Erreur',
                'Le champ BL est obligatoire et ne peut pas être vide.',
                'error'
            );
            return;
        }

        if (blMontant == null || blMontant < 0) {
            Swal.fire(
                'Erreur',
                'Le montant BL doit être un nombre positif.',
                'error'
            );
            return;
        }

        if (!dateBl || isNaN(new Date(dateBl).getTime())) {
            Swal.fire('Erreur', 'La date BL est invalide ou manquante.', 'error');
            return;
        }

        // Create FromMouvementRequestDTO object
        const fromMouvement: FromMouvementRequestDTO = {
            id: this.fromMouvementResponseDTO.id,
            vehiculeRouteId: this.vehiculeRouteId,
            affaireId: selectedAffaire ? selectedAffaire.id : null,
            affaireCode: selectedAffaire ? selectedAffaire.code : null,
            fournisseurId: selectedFournisseur ? selectedFournisseur.id : null,
            fournisseurName: selectedFournisseur
                ? selectedFournisseur.intituleFournisseur
                : null,
            bl: bl.trim(),
            blMontant: blMontant,
            dateBl: dateBl,
        };

        console.log('Mise à jour du Mouvement d\'origine avec :', fromMouvement);

        try {
            if (this.fromMouvementResponseDTO.id) {
                await this.vehiculeRouteService.updateFrom(fromMouvement);
                Swal.fire(
                    'Succès',
                    'Mouvement d\'origine mis à jour avec succès.',
                    'success'
                );
                this.vehiculeRouteService.getFromMouvementByVehiculeRouteId(this.vehiculeRouteId)
                    .then((data: any) => {
                        console.log('Fetched imputations:', data);
                        this.fromMouvements = data;
                    }, (error) => {
                        console.error('Error fetching imputations:', error);
                    });
                //  this.vehiculeRouteService.getVehiculeByDate(this.filterDate);
                this.loadRoutes();
            }
            modal.close('Clic accepté');
        } catch (error: any) {
            if (error.status === 400) {
                Swal.fire(
                    'Erreur de Validation',
                    'Les données saisies sont invalides. Veuillez vérifier et réessayer.',
                    'error'
                );
            } else if (error.status === 404) {
                Swal.fire(
                    'Erreur',
                    'La Route de Véhicule ou une autre ressource liée n\'a pas été trouvée.',
                    'error'
                );
            } else if (error.status === 500) {
                Swal.fire(
                    'Erreur Interne',
                    'Une erreur interne s\'est produite. Veuillez réessayer plus tard.',
                    'error'
                );
            } else {
                Swal.fire(
                    'Erreur Inconnue',
                    'Une erreur inattendue est survenue : ' + error.message,
                    'error'
                );
            }

            console.error(
                'Erreur lors de la mise à jour du Mouvement d\'origine :',
                error
            );
        }
    }

    openModalsViewImputations(modalImputations: any, vehiculeRoute: VehiculeRoute) {
        this.selectedVehiculeRoute = vehiculeRoute;
        this.vehiculeRouteId = vehiculeRoute?.id;

        if (!this.vehiculeRouteId) {
            console.error('Vehicule Route ID is missing, cannot open modal.');
            return;
        }

        this.vehiculeRouteService.imputationByVehiculeRoute(this.vehiculeRouteId)
            .then((data: any) => {
                console.log('Fetched imputations:', data); // Log data to check
                this.imputations = data;  // Assign data to imputations array
                this.modalService.open(modalImputations, {size: 'xl', centered: true}); // Open modal after data is set
            }, (error) => {
                console.error('Error fetching imputations:', error);
            });
    }


    removeImputation(imputation: TripImputationResponseDTO): void {
        const isNew = !imputation.id;
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: isNew
                ? 'Cette imputation sera supprimée sans être enregistrée.'
                : 'Cette imputation sera définitivement supprimée !',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimez-la !',
            cancelButtonText: 'Annuler',
        }).then((result) => {
            if (result.isConfirmed) {
                if (isNew) {
                    this.imputations = this.imputations.filter((i) => i !== imputation);
                    Swal.fire('Supprimé !', 'L\'imputation a été supprimée.', 'success');
                } else {
                    this.vehiculeRouteService.deleteImputation(imputation.id).subscribe({
                        next: () => {
                            this.imputations = this.imputations.filter(
                                (i) => i !== imputation
                            );
                            Swal.fire(
                                'Supprimé !',
                                'L\'imputation a été supprimée.',
                                'success'
                            );
                        },
                        error: (error) => {
                            console.error(
                                'Erreur lors de la suppression de l\'imputation :',
                                error
                            );
                            Swal.fire(
                                'Erreur !',
                                'Il y a eu un problème lors de la suppression de l\'imputation.',
                                'error'
                            );
                        },
                    });
                    this.loadRoutes();

                }
            }
        });
    }

    addImputation() {
        const newImputation = new TripImputationResponseDTO(
            null,
            null,
            '',
            0,
            '',
            null,
            null,
            null,
            '',
            0,
            null,
            0,
        );
        this.imputations.push(newImputation);
    }

    // reset data and initializ imputation

    // save Imputation Modal

    /* async saveImputation(modal: any) {
         if (!this.vehiculeRouteId) {
             Swal.fire({
                 icon: 'error',
                 title: 'Erreur',
                 text: 'Veuillez sélectionner une Route de Véhicule avant de sauvegarder.',
             });
             return;
         }

         if (!this.tripImputationResponseDTO) {
             Swal.fire({
                 icon: 'error',
                 title: 'Erreur',
                 text: 'Veuillez ajouter une imputation avant de sauvegarder.',
             });
             return;
         }

         const {fillingPercentage} = this.tripImputationResponseDTO;
         if (
             fillingPercentage == null ||
             fillingPercentage < 0 ||
             fillingPercentage > 100
         ) {
             Swal.fire({
                 icon: 'error',
                 title: 'Erreur',
                 text: 'Le pourcentage de remplissage doit être compris entre 0 et 100.',
             });
             return;
         }

         if (!this.tripImputationResponseDTO.affaire) {
             Swal.fire({
                 icon: 'error',
                 title: 'Erreur',
                 text: 'L\'affaire est obligatoire.',
             });
             return;
         }
         if (!this.tripImputationResponseDTO.client) {
             Swal.fire({
                 icon: 'error',
                 title: 'Erreur',
                 text: 'Le client est obligatoire.',
             });
             return;
         }

         Swal.fire({
             title: 'Êtes-vous sûr?',
             text: 'Vous êtes sur le point de sauvegarder l\'imputation.',
             icon: 'warning',
             showCancelButton: true,
             confirmButtonText: 'Oui, sauvegarder!',
             cancelButtonText: 'Non, annuler!',
         }).then(async (result) => {
             if (result.isConfirmed) {
                 try {
                     const tripImputationRequestDTO: TripImputationRequestDTO = {
                         id: this.tripImputationResponseDTO.id,
                         affaireId: this.tripImputationResponseDTO.affaireId,
                         vehiculeRouteId: this.vehiculeRouteId,
                         fillingPercentage: this.tripImputationResponseDTO.fillingPercentage,
                         observation: this.tripImputationResponseDTO.observation || '',
                         clientId: this.tripImputationResponseDTO.clientId,
                         lotId: this.tripImputationResponseDTO.lotId,
                         subContractorId: this.tripImputationResponseDTO.subContractorId,
                         costImputation: this.tripImputationResponseDTO.costImputation,
                     };

                     await this.vehiculeRouteService.saveImputation(tripImputationRequestDTO);

                     Swal.fire(
                         'Succès!',
                         'Imputation enregistrée avec succès.',
                         'success'
                     ).then(() => {
                         modal.close('Accept click');
                         this.vehiculeRouteService.getImputationByVehiculeRouteId(this.vehiculeRouteId);
                         this.vehiculeRouteService.getVehiculeByDate(this.filterDate);

                     });
                 } catch (error) {
                     Swal.fire({
                         icon: 'error',
                         title: 'Erreur',
                         text: 'Une erreur s\'est produite lors de la sauvegarde de l\'imputation.',
                     });
                     console.error('Error saving the imputation:', error);
                 }
             }
         });

     }*/


    async saveImputation(modal: any) {
        if (!this.vehiculeRouteId) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez sélectionner une Route de Véhicule avant de sauvegarder.',
            });
            return;
        }
        if (!this.tripImputationResponseDTO) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez ajouter une imputation avant de sauvegarder.',
            });
            return;
        }
        const {fillingPercentage} = this.tripImputationResponseDTO;
        if (
            fillingPercentage == null ||
            fillingPercentage < 0 ||
            fillingPercentage > 100
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Le pourcentage de remplissage doit être compris entre 0 et 100.',
            });
            return;
        }
        if (!this.tripImputationResponseDTO.affaire) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'L\'affaire est obligatoire.',
            });
            return;
        }
        if (!this.tripImputationResponseDTO.client) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Le client est obligatoire.',
            });
            return;
        }

        try {
            const existingImputations = await this.vehiculeRouteService.imputationByVehiculeRoute(this.vehiculeRouteId);
            const totalFillingPercentage = existingImputations.reduce((sum, imputation) => sum + (imputation.fillingPercentage || 0), 0);

            // Check if the new fillingPercentage would exceed 100%
            if (totalFillingPercentage + fillingPercentage > 100) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Alerte',
                    // tslint:disable-next-line:max-line-length
                    text: `La somme des pourcentages de remplissage dépasserait 100%. Il reste ${100 - totalFillingPercentage}% disponible.`,
                });
                return;
            }

            Swal.fire({
                title: 'Êtes-vous sûr?',
                text: 'Vous êtes sur le point de sauvegarder l\'imputation.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Oui, sauvegarder!',
                cancelButtonText: 'Non, annuler!',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const tripImputationRequestDTO: TripImputationRequestDTO = {
                            id: this.tripImputationResponseDTO.id,
                            affaireId: this.tripImputationResponseDTO.affaireId,
                            vehiculeRouteId: this.vehiculeRouteId,
                            fillingPercentage: this.tripImputationResponseDTO.fillingPercentage,
                            observation: this.tripImputationResponseDTO.observation || '',
                            clientId: this.tripImputationResponseDTO.clientId,
                            lotId: this.tripImputationResponseDTO.lotId,
                            subContractorId: this.tripImputationResponseDTO.subContractorId,
                            costImputation: this.tripImputationResponseDTO.costImputation,
                        };

                        // Save the imputation
                        await this.vehiculeRouteService.saveImputation(tripImputationRequestDTO);

                        const Allimputation = await this.vehiculeRouteService.imputationByVehiculeRoute(this.vehiculeRouteId);
                        this.imputations = Allimputation;
                        //  this.loadRoutes();
                        this.selectedVehiculeRoute.imputationStatus = true;
                        Swal.fire(
                            'Succès!',
                            'Imputation enregistrée avec succès.',
                            'success'
                        ).then(() => {
                            modal.close('Accept click');
                        });
                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur',
                            text: 'Une erreur s\'est produite lors de la sauvegarde de l\'imputation.',
                        });
                        console.error('Error saving the imputation:', error);
                    }
                }
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur s\'est produite lors de la récupération des imputations.',
            });
            console.error('Error fetching imputations:', error);
        }
    }

    resetImputationData() {
        // this.vehiculeRouteId = null;
        this.tripImputationResponseDTO = {
            id: null,
            affaireId: null,
            affaireCode: null,
            fillingPercentage: 0,
            observation: '',
            clientId: null,
            clientName: null,
            lotId: null,
            lotName: null,
            subContractorId: null,
            subContractorFullName: null,
            costImputation: null,
        };
    }

    openAddImputationModal() {
        this.resetImputationData();
        const modalRef = this.modalService.open(this.addImputationModal, {
            size: 'xl',
            centered: true,
        });
    }

    // update Imputation modal

    openEditImputationModal(imputation: TripImputationResponseDTO) {
        // this.newImputation = { ...imputation };
        this.tripImputationResponseDTO = imputation;

        this.tripImputationResponseDTO.affaire = new Affaire(imputation.affaireId, imputation.affaireCode);

        this.tripImputationResponseDTO.client = {
            id: imputation.clientId,
            name: imputation.clientName,
        };

        this.tripImputationResponseDTO.lot = {
            id: imputation.lotId,
            name: imputation.lotName,
        };
        this.tripImputationResponseDTO.soustraitant = new SubContractor(imputation.subContractorId, imputation.subContractorFullName);

        this.subContractorService.byProject(imputation.affaireId);

        this.modalService.open(this.editeImputationModal, {
            size: 'xl',
            centered: true,
        });
    }

    async updateImputation(modal: any) {
        if (!this.vehiculeRouteId) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez sélectionner une Route de Véhicule avant de mettre à jour.',
            });
            return;
        }

        if (!this.tripImputationResponseDTO) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez ajouter une imputation avant de mettre à jour.',
            });
            return;
        }

        const {fillingPercentage} = this.tripImputationResponseDTO;
        if (
            fillingPercentage == null ||
            fillingPercentage < 0 ||
            fillingPercentage > 100
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Le pourcentage de remplissage doit être compris entre 0 et 100.',
            });
            return;
        }

        if (!this.tripImputationResponseDTO.affaire) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'L\'affaire est obligatoire.',
            });
            return;
        }
        if (!this.tripImputationResponseDTO.client) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Le client est obligatoire.',
            });
            return;
        }

        try {
            // Retrieve all current imputations for the vehicle route
            const existingImputations = await this.vehiculeRouteService.imputationByVehiculeRoute(this.vehiculeRouteId);

            // Calculate the total filling percentage of existing imputations
            const totalFillingPercentage = existingImputations.reduce((sum, imputation) => {
                return sum + (imputation.fillingPercentage || 0);
            }, 0);

            // If this is an update, subtract the current imputation's percentage before adding the new percentage
            let currentImputationFillingPercentage = 0;
            if (this.tripImputationResponseDTO.id) {
                const currentImputation = existingImputations.find(
                    (imputation) => imputation.id === this.tripImputationResponseDTO.id
                );
                currentImputationFillingPercentage = currentImputation?.fillingPercentage || 0;
            }

            // Calculate the adjusted total percentage by removing the old percentage of the imputation being updated and adding the new one
            const adjustedTotalPercentage = totalFillingPercentage - currentImputationFillingPercentage + fillingPercentage;

            // Check if the total filling percentage exceeds 100 after the update
            if (adjustedTotalPercentage > 100) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Alerte',
                    text: `La somme des pourcentages de remplissage dépasse 100%. Il reste ${100 - (totalFillingPercentage - currentImputationFillingPercentage)}% disponible.`,
                });
                return;
            }

            // Proceed with the update if the total filling percentage is valid
            Swal.fire({
                title: 'Êtes-vous sûr?',
                text: 'Vous êtes sur le point de mettre à jour l\'imputation.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Oui, mettre à jour!',
                cancelButtonText: 'Non, annuler!',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const imputation: TripImputationRequestDTO = {
                            id: this.tripImputationResponseDTO.id,
                            affaireId: this.tripImputationResponseDTO.affaireId,
                            vehiculeRouteId: this.vehiculeRouteId,
                            fillingPercentage: this.tripImputationResponseDTO.fillingPercentage,
                            observation: this.tripImputationResponseDTO.observation || '',
                            clientId: this.tripImputationResponseDTO.client?.id,
                            lotId: this.tripImputationResponseDTO.lot.id,
                            subContractorId: this.tripImputationResponseDTO.subContractorId,
                            costImputation: this.tripImputationResponseDTO.costImputation,
                        };

                        // Update the imputation
                        await this.vehiculeRouteService.updateImputation(imputation);

                        Swal.fire(
                            'Succès!',
                            'Imputation mise à jour avec succès.',
                            'success'
                        );

                        // Close the modal and refresh the data
                        modal.close('Accept click');
                        this.vehiculeRouteService.getVehiculeByDate(this.filterDate);
                        const Allimputation = await this.vehiculeRouteService.imputationByVehiculeRoute(this.vehiculeRouteId);
                        this.imputations = Allimputation;
                        this.loadRoutes();
                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur',
                            text: 'Une erreur s\'est produite lors de la mise à jour de l\'imputation.',
                        });
                        console.error('Error updating the imputation:', error);
                    }
                }
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur s\'est produite lors de la récupération des imputations.',
            });
            console.error('Error fetching imputations:', error);
        }
    }

    isFormValid(): boolean {
        return (
            this.tripImputationResponseDTO.affaireId > 0 &&
            this.tripImputationResponseDTO.fillingPercentage >= 0 &&
            this.tripImputationResponseDTO.fillingPercentage <= 100 &&
            this.tripImputationResponseDTO.client != null
        );
    }

    getTotalCostImputation(): number {
        return this.imputations.reduce(
            (total, imputation) => total + (imputation.costImputation || 0),
            0
        );
    }

    // --------------------------costfillilng
    confirmFillingPercentage(vehiculeRoute: VehiculeRoute): void {
        if (
            vehiculeRoute.fillingPercentage !== undefined &&
            vehiculeRoute.fillingPercentage >= 0 &&
            vehiculeRoute.fillingPercentage <= 100
        ) {
            const dto: UpdateFillingPercentageDTO = new UpdateFillingPercentageDTO(
                vehiculeRoute.id,
                vehiculeRoute.fillingPercentage
            );

            this.vehiculeRouteService.updateFillingPercentage(dto).then(
                (updatedRoutes) => {
                    const index = this.vehiculeRoutes.findIndex(r => r.id === vehiculeRoute.id);
                    if (index !== -1) {
                        this.vehiculeRoutes[index] = updatedRoutes[0];
                    }

                    this.filterData();

                    this.toastr.success(
                        'Le pourcentage de remplissage a été mis à jour avec succès !'
                    );
                },
                (error) => {
                    console.error(
                        'Erreur lors de la mise à jour du pourcentage de remplissage',
                        error
                    );
                    this.toastr.error(
                        'Échec de la mise à jour du pourcentage de remplissage.'
                    );
                }
            );
        } else {
            this.toastr.warning(
                'Veuillez entrer un pourcentage de remplissage valide entre 0 et 100.'
            );
        }
    }

    // ---------------------------------------------------
    editRow(row: any): void {
        this.selectedRow = row;
    }

    cancelEdit() {
        this.selectedRow = null;
    }

    updateRouteLength(row) {
        Swal.fire({
            title: 'Êtes-vous sûr(e) ?',
            text: 'Voulez-vous vraiment mettre à jour la distance parcourue ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, mettre à jour',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                // @ts-ignore
                Swal.fire({
                    title: 'Mise à jour en cours...',
                    text: 'Veuillez patienter...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                this.vehiculeRouteService.updateMouvement(row).subscribe(
                    (updatedRow) => {
                        Swal.close();
                        this.toastr.success('Distance mise à jour avec succès !', 'Succès');
                        row.routeLength = updatedRow.routeLength;
                        this.selectedRow = null;

                        this.loadRoutes();
                    },
                    (error) => {
                        Swal.close();
                        this.toastr.error('Échec de la mise à jour.', 'Erreur');
                        console.error('Erreur lors de la mise à jour de la distance', error);
                    }
                );
            }
        });
    }

    onAffaireChanged(affaire: Affaire) {
        this.subContractors = [];
        this.tripImputationResponseDTO.affaireCode = affaire.code;
        this.tripImputationResponseDTO.affaireId = affaire.id;

        this.subContractorService.byProject(affaire.id)
            .then((data: SubContractor[]) => {
                this.subContractors = data;
                console.log('Soustraitants:', this.subContractors);
            });
    }

    onSubcontractorChanged(subContractor: SubContractor | null): void {
        if (subContractor) {
            console.log('SubContractor selected:', subContractor);
            this.tripImputationResponseDTO.soustraitant = subContractor;
            this.tripImputationResponseDTO.subContractorId = subContractor.id;
        } else {
            console.log('No SubContractor selected');
            this.tripImputationResponseDTO.soustraitant = undefined;
            this.tripImputationResponseDTO.subContractorId = undefined;
        }
    }

    onClientChanged(client: Client) {
        this.tripImputationResponseDTO.clientId = client.id;
        this.tripImputationResponseDTO.clientName = client.name;

    }

    onLotChanged(lot: Lot) {
        this.tripImputationResponseDTO.lotId = lot.id;
        this.tripImputationResponseDTO.lotName = lot.name;
    }

    onFillingKeyUp() {
        this.tripImputationResponseDTO.costImputation =
            (this.tripImputationResponseDTO.fillingPercentage *
                this.selectedVehiculeRoute.costPerTrip) /
            100;
    }

    onDateBlChange(ngbDateStruct: NgbDateStruct) {
        this.ngbDateBl = ngbDateStruct;
        this.fromMouvementResponseDTO.dateBl = new Date(
            this.ngbDateBl.year,
            this.ngbDateBl.month - 1,
            this.ngbDateBl.day
        );
        console.log(this.fromMouvementResponseDTO.dateBl);
    }

    // ------------------status vehicule Route------------------------
}
