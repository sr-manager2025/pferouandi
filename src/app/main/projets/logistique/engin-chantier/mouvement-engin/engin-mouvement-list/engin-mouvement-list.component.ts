import {EnginRouteDTO} from '../../models/dto/EnginRouteDTO';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {takeUntil} from 'rxjs/operators';
import {MouvementEnginService} from '../mouvement-engin.service';
import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {Subject} from 'rxjs';
import {EnginRoute} from '../../models/EnginRoute';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EnginImputationResponseDTO} from '../../models/dto/EnginImputationResponseDTO';
import {EnginImputationRequestDTO} from '../../models/dto/EnginImputationRequestDTO';
import {EnginGpsLocation} from '../../models/EnginGpsLocation';
import {Client} from '../../../models/client';
import {ImputationService} from '../../../imputation.service';
import {LotService} from '../../../lot.service';
import {SubContractorService} from '../../../subContractor.service';
import {Affaire} from '../../../models/affaire';
import {SubContractor} from '../../../../../../../@core/models/sub-contractor';
import {RequestService} from '../../../../../../../@core/enum/RequestService';
import {SelectYear} from 'app/main/parametres/models/select-year';
import {SelectMonth} from 'app/main/parametres/models/select-month';
import {FilterLogistique} from 'app/main/parametres/models/filter-logistique';
import {Lot} from '../../../models/lot';
import {EnginGpsLocationService} from '../engin-gps-location.service';
import {ParamsService} from 'app/main/parametres/services/params.service';
import {LogistiqueFilter} from '../../../../../../../@core/enum/LogistiqueFilter';


@Component({
    selector: 'app-engin-mouvement-list',
    templateUrl: './engin-mouvement-list.component.html',
    styleUrls: ['./engin-mouvement-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EnginMouvementListComponent implements OnInit {
    private withDayFilter: boolean;

    constructor(private mouvementEnginService: MouvementEnginService,
                private subContractorService: SubContractorService,
                private imputationService: ImputationService,
                private enginGpsLocationService: EnginGpsLocationService,
                private lotService: LotService,
                private paramsService: ParamsService,
                private toastr: ToastrService,
                private modalService: NgbModal) {
        this._unsubscribeAll = new Subject();
    }

    ngbFiltreDate: NgbDateStruct;

    public years: SelectYear[] = [];
    public selectedYear: SelectYear;

    public months: SelectMonth[] = [];
    public selectedMonth: SelectMonth;

    public filterLogistiques: FilterLogistique[] = [];
    public filterLogistique: FilterLogistique = new FilterLogistique();


    private _unsubscribeAll: Subject<any>;
    public ColumnMode = ColumnMode;
    filteredRoutes: EnginRoute[] = [];
    enginRoutes: EnginRoute[] = [];
    filterDate?: string;
    filterEnginName = '';
    selectedRow: any = null;
    selectedEnginRoute: EnginRoute | null = null;
    enginRouteId: number | undefined;
    imputations: EnginImputationResponseDTO[] = [];
    @ViewChild('addImputationModal') addImputationModal: TemplateRef<any>;
    @ViewChild('editeImputationModal') editeImputationModal: TemplateRef<any>;
    clients: Client[] = [];
    lots: Lot[] = [];
    affaires: Affaire[] = [];
    soustraitants: SubContractor[] = [];

    enginGps: EnginGpsLocation[] = [];
    selectedEnginGps: EnginGpsLocation;

    filterMonth = '';


    hours: number[] = Array.from({length: 24}, (_, i) => i); // 0-23
    minutes: number[] = Array.from({length: 60}, (_, i) => i); // 0-59
    seconds: number[] = Array.from({length: 60}, (_, i) => i); // 0-59

    selectedTime = {hours: 0, minutes: 0, seconds: 0};

    enginImputationResponseDTO: EnginImputationResponseDTO = {
        id: null,
        affaireId: null,
        nbrHImputation: 0,
        observation: '',
        clientId: null,
        clientName: null,
        lotId: null,
        lotName: null,
        subContractorId: null,
        costImputation: null,
        affaireCode: '',
        subContractorFullName: '',
    };


    public readonly LogistiqueFilter = LogistiqueFilter;
    loading: Boolean = false;

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
        const today = new Date();
        this.filterDate = today.toISOString().split('T')[0];
        this.loadEnginRoutes();
        this.fetchClients();
        this.fetchLots();
        this.loadAffaires();

        this.years = this.paramsService.getYears();
        this.selectedYear = this.paramsService.getOneYearByValue(new Date().getFullYear());

        this.months = this.paramsService.getMonths();
        this.selectedMonth = this.paramsService.getOneMonthByValue(new Date().getMonth() + 1);

        this.filterLogistiques = this.getFilterLogistique();

        this.mouvementEnginService.onImputationsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((imputations) => {
            if (imputations) {
                this.imputations = imputations;
            } else {
                this.imputations = [];
            }
        });

        this.enginGpsLocationService.onEnginListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (data) => {
                this.enginGps = data;
            });
        this.enginGpsLocationService.getAllEnginGps();
    }

    onFilterTypeChange(): void {
        // Reset filters when the filter type changes
        this.filterDate = new Date().toISOString().split('T')[0];
        this.filterMonth = this.selectedYear.value + '-' + this.selectedMonth.month;

        this.loadEnginRoutes();

    }

    fetchClients(): void {
        this.mouvementEnginService.getAllClients().then((data: Client[]) => {
            this.clients = data;
            console.log('Clients:', this.clients);
        });
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

    fetchLots(): void {
        this.lotService.onLotListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (data) => {
                if (data) {
                    this.lots = data;
                }
            });

        this.lotService.allLots();
    }

    loadEnginRoutes(): void {
        this.loading = true;
        console.log(this.loading);
        if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.DAY && this.filterDate) {
            //  data for a specific date (daily)
            this.mouvementEnginService.getEnginRoutesByDate(this.filterDate).then(
                (routes) => {
                    this.handleRoutesResponse(routes);
                },
                (error) => {
                    console.error('Error loading routes by date:', error);
                    this.loading = false;

                }
            );
        } else if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.MONTH && this.filterMonth) {
            //  data for a specific month
            this.mouvementEnginService.getVehiculeByMonth(this.filterMonth).then(
                (routes) => {
                    this.handleRoutesResponse(routes);
                },
                (error) => {
                    console.error('Error loading routes by month:', error);
                    this.loading = false;

                }
            );
        } else {
            this.loading = false;
            console.log(this.loading);
        }
    }

    private handleRoutesResponse(routes: any[]): void {
        this.loading = false;
        console.log(this.loading);
        this.enginRoutes = Array.isArray(routes)
            ? routes.map((route) => ({
                ...route,
                isEditing: false,
            }))
            : [];
        this.filteredRoutes = this.enginRoutes;
        this.filterData();
    }

    onByDateChanged() {
        if (!this.withDayFilter) {
            this.ngbFiltreDate = {day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear()};
        }
        this.filterData();
    }

    onDateFilterChanged(ngbDateStruct: NgbDateStruct) {
        this.ngbFiltreDate = ngbDateStruct;
        // tslint:disable-next-line:max-line-length
        this.filterDate = new Date(this.ngbFiltreDate.year, this.ngbFiltreDate.month - 1, this.ngbFiltreDate.day).toISOString().split('T')[0];

        this.filterData();
    }

    filterData(): void {
        console.log('Selected Engin GPS:', this.selectedEnginGps);
        this.filterEnginName = this.selectedEnginGps ? this.selectedEnginGps.name : '';

        this.filteredRoutes = this.enginRoutes.filter((route) => {
            const matchesDate = this.filterDate
                // tslint:disable-next-line:no-non-null-assertion
                ? new Date(route.date!).toISOString().split('T')[0] === this.filterDate
                : true;

            const matchesMonth = this.filterMonth
                // tslint:disable-next-line:no-non-null-assertion
                ? new Date(route.date!).toISOString().split('T')[0].substring(0, 7) === this.filterMonth
                : true;

            const matchesVehiculeName = this.filterEnginName
                ? route.enginGpsLocation?.name
                    ?.toLowerCase()
                    .includes(this.filterEnginName.toLowerCase())
                : true;

            // Apply the appropriate filter based on the filter type
            return (this.filterLogistique.value === LogistiqueFilter.DAY ? matchesDate : matchesMonth) && matchesVehiculeName;
        });
    }

    // update Rendement
    updateRendement(row: any): void {
        const formattedTime =
            `${this.selectedTime.hours.toString().padStart(2, '0')}:` +
            `${this.selectedTime.minutes.toString().padStart(2, '0')}:` +
            `${this.selectedTime.seconds.toString().padStart(2, '0')}`;

        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: 'Voulez-vous vraiment mettre à jour le rendement?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, mettre à jour',
            cancelButtonText: 'Non, annuler',
        }).then((result) => {
            if (result.isConfirmed) {
                const updateDto: EnginRouteDTO = {
                    id: row.id,
                    rendement: formattedTime,
                };

                this.mouvementEnginService
                    .updateRendement(updateDto)

                    .then(() => {
                        this.toastr.success(
                            'Le rendement a été mis à jour avec succès!',
                            'Succès'
                        );
                        Object.assign(row, updateDto);
                        this.selectedRow = null;

                    })
                    .catch((error) => {
                        this.toastr.error(
                            'Erreur lors de la mise à jour du rendement.',
                            'Erreur'
                        );
                        console.error(error);
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.toastr.info('La mise à jour a été annulée.', 'Info');
            }
        });
    }

    cancelEdit(): void {
        this.selectedRow = null;
    }

    editRow(row: any): void {
        const [hours, minutes, seconds] = row.rendement.split(':').map(Number);
        this.selectedRow = {...row};
        this.selectedTime = {hours, minutes, seconds};
    }

    // ImputationEngin
    openModalsViewImputations(modalImputations: any, enginRoute: EnginRoute) {
        this.selectedEnginRoute = enginRoute;
        this.enginRouteId = enginRoute?.id;

        if (!this.enginRouteId) {
            console.error('Engin Route ID is missing, cannot open modal.');
            return;
        }

        this.mouvementEnginService.imputationByEnginRoute(this.enginRouteId);
        this.modalService.open(modalImputations, {
            size: 'xl',
            centered: true,
        });

    }

    getTotalCostImputation(): number {
        return this.imputations.reduce(
            (total, imputation) => total + (imputation.costImputation || 0),
            0
        );
    }

    getTotalHeureImputation(): number {
        return this.imputations.reduce(
            (total, imputation) => total + (imputation.nbrHImputation || 0),
            0
        );
    }

    addImputation() {
        const newImputation = new EnginImputationResponseDTO(
            null,
            null,
            '',
            0,
            '',
            null,
            '',
            null,
            '',
            null,
            '',
            0
        );
        this.imputations.push(newImputation);
    }

    async saveImputation(modal: any) {
        if (!this.enginRouteId) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez sélectionner une Route de Véhicule avant de sauvegarder.',
            });
            return;
        }

        if (!this.enginImputationResponseDTO) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez ajouter une imputation avant de sauvegarder.',
            });
            return;
        }


        if (!this.enginImputationResponseDTO.affaire) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'L\'affaire est obligatoire.',
            });
            return;
        }
        if (!this.enginImputationResponseDTO.client) {
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
                    const enginImputationRequestDTO: EnginImputationRequestDTO = {
                        id: this.enginImputationResponseDTO?.id,
                        affaireId: this.enginImputationResponseDTO.affaireId,
                        enginRouteId: this.enginRouteId,
                        nbrHImputation: this.enginImputationResponseDTO.nbrHImputation,
                        observation: this.enginImputationResponseDTO.observation || '',
                        clientId: this.enginImputationResponseDTO.clientId,
                        lotId: this.enginImputationResponseDTO.lotId,
                        subContractorId: this.enginImputationResponseDTO.subContractorId,
                        costImputation: this.enginImputationResponseDTO.costImputation,
                    };

                    await this.mouvementEnginService.saveImputation(enginImputationRequestDTO);
                    Swal.fire(
                        'Succès!',
                        'Imputation enregistrée avec succès.',
                        'success'
                    ).then(() => {
                        modal.close('Accept click');
                        this.mouvementEnginService.imputationByEnginRoute(this.enginRouteId);
                        //     this.mouvementEnginService.getEnginRoutesByDate(this.filterDate);
                        // this.loadEnginRoutes();
                        this.selectedEnginRoute.imputationStatus = true;
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
    }

    resetImputationData() {
        this.enginImputationResponseDTO = {
            id: null,
            affaireId: null,
            affaireCode: '',
            nbrHImputation: 0,
            observation: '',
            clientId: null,
            clientName: '',
            lotId: null,
            lotName: '',
            subContractorId: null,
            subContractorFullName: '',
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

    onHoursKeyUp() {
        const nbrHImputation = this.enginImputationResponseDTO.nbrHImputation;

        // Ensure selectedEnginRoute and enginGpsLocation exist
        if (!this.selectedEnginRoute || !this.selectedEnginRoute.enginGpsLocation) {
            console.warn('Selected EnginRoute or EnginGpsLocation is missing.');
            this.enginImputationResponseDTO.costImputation = 0;
            return;
        }

        const costPerH = this.selectedEnginRoute.enginGpsLocation.coutH;

        // Validate nbrHImputation and costPerH
        if (nbrHImputation === null || nbrHImputation === undefined || nbrHImputation <= 0) {
            console.warn('Invalid number of hours (nbrHImputation).');
            this.enginImputationResponseDTO.costImputation = 0;
            return;
        }

        if (costPerH === null || costPerH === undefined || costPerH <= 0) {
            console.warn('Invalid cost per hour (coutH).');
            this.enginImputationResponseDTO.costImputation = 0;
            return;
        }

        // Calculate the cost of imputation
        this.enginImputationResponseDTO.costImputation = nbrHImputation * costPerH;

        console.log(
            'Calculated Cost Imputation:',
            this.enginImputationResponseDTO.costImputation
        );
    }

    onEnginSelected(engin: EnginGpsLocation) {
        this.selectedEnginGps = engin;
        console.log('Selected Engin GPS:', this.selectedEnginGps);
    }

    removeImputation(imputation: EnginImputationResponseDTO): void {
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
                    this.mouvementEnginService.deleteImputation(imputation.id).subscribe({
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
                    this.loadEnginRoutes();

                }
            }
        });
    }

    // edite Imputation

    openEditImputationModal(imputation: EnginImputationResponseDTO) {
        this.enginImputationResponseDTO = imputation;

        this.enginImputationResponseDTO.affaire = new Affaire(imputation.affaireId, imputation.affaireCode);
        this.enginImputationResponseDTO.soustraitant = new SubContractor(imputation.subContractorId, imputation.subContractorFullName);

        this.subContractorService.byProject(imputation.affaire.id)
            .then((data: SubContractor[]) => {
                this.soustraitants = data;
                console.log('Soustraitants:', this.soustraitants);
            });

        this.modalService.open(this.editeImputationModal, {
            size: 'xl',
            centered: true,
        });
    }

    async updateImputation(modal: any) {
        if (!this.enginRouteId) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez sélectionner une Route de Véhicule avant de mettre à jour.',
            });
            return;
        }

        if (!this.enginImputationResponseDTO) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez ajouter une imputation avant de mettre à jour.',
            });
            return;
        }

        /* const { fillingPercentage } = this.tripImputationResponseDTO;
        if (
          fillingPercentage == null ||
          fillingPercentage < 0 ||
          fillingPercentage > 100
        ) {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Le pourcentage de remplissage doit être compris entre 0 et 100.",
          });
          return;
        } */

        if (!this.enginImputationResponseDTO.affaire) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'L\'affaire est obligatoire.',
            });
            return;
        }
        if (!this.enginImputationResponseDTO.client) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Le client est obligatoire.',
            });
            return;
        }

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
                    const imputation: EnginImputationRequestDTO = {
                        id: this.enginImputationResponseDTO.id,
                        affaireId: this.enginImputationResponseDTO.affaireId,
                        enginRouteId: this.enginRouteId,
                        nbrHImputation: this.enginImputationResponseDTO.nbrHImputation,
                        observation: this.enginImputationResponseDTO.observation || '',
                        clientId: this.enginImputationResponseDTO.clientId,
                        lotId: this.enginImputationResponseDTO.lotId,
                        subContractorId: this.enginImputationResponseDTO.subContractorId,
                        costImputation: this.enginImputationResponseDTO.costImputation,
                    };

                    await this.mouvementEnginService.updateImputation(imputation);

                    Swal.fire(
                        'Succès!',
                        'Imputation mise à jour avec succès.',
                        'success'
                    );

                    modal.close('Accept click');

                    this.mouvementEnginService.imputationByEnginRoute(this.enginRouteId);
                    //   this.mouvementEnginService.getEnginRoutesByDate(this.filterDate);
                    this.loadEnginRoutes();

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
    }

    onAffaireChanged(affaire: Affaire) {
        this.soustraitants = [];
        this.enginImputationResponseDTO.affaireCode = affaire.code;
        this.enginImputationResponseDTO.affaireId = affaire.id;

        this.subContractorService.byProject(affaire.id)
            .then((data: SubContractor[]) => {
                this.soustraitants = data;
                console.log('Soustraitants:', this.soustraitants);
            });
    }

    onSubcontractorChanged(subContractor: SubContractor) {
        console.log('onSubcontractorChanged');
        console.log(subContractor);
        this.enginImputationResponseDTO.subContractorId = subContractor.id;
        this.enginImputationResponseDTO.subContractorFullName = subContractor.fullName;
    }

    onClientChanged(client: Client) {
        this.enginImputationResponseDTO.clientId = client.id;
        this.enginImputationResponseDTO.clientName = client.name;

    }

    onLotChanged(lot: Lot) {
        this.enginImputationResponseDTO.lotId = lot.id;
        this.enginImputationResponseDTO.lotName = lot.name;
    }

    getColor(value: number): string {
        if (value > 1000) {
            return 'blue';
        }
        if (value > 0) {
            return 'green';
        }
        if (value < 0) {
            return 'red';
        }
        return 'black';
    }
}
