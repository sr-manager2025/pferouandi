// @ts-ignore

import {RecapImputationService} from './recap-imputation.service';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {VehiculeRouteService} from '../mouvement-vh/vehicule-route.service';
import {VehiculeRoute} from '../models/vehicule-route';
import {Subject} from 'rxjs';
import {Client} from '../../models/client';
import {TripImputationResponseDTO} from '../models/DTO/TripImputationResponseDTO';
import {takeUntil} from 'rxjs/operators';
import {ImputationService} from '../../imputation.service';
import {SubContractorService} from '../../subContractor.service';
import {LotService} from '../../lot.service';
import {Affaire} from '../../models/affaire';
import {RequestService} from '../../../../../../@core/enum/RequestService';
import {SubContractor} from '../../../../../../@core/models/sub-contractor';
import {VehiculeGpsLocation} from '../models/vehicule-gps-location';
import {VehiculeGpsLocationService} from '../vehicule/vehicule-gps-location.service';
import 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import {Lot} from '@core/models/lot';
import {FilterLogistique} from 'app/main/parametres/models/filter-logistique';
import {LogistiqueFilter} from '@core/enum/LogistiqueFilter';


@Component({
    selector: 'app-recap-imputation',
    templateUrl: './recap-imputation.component.html',
    styleUrls: ['./recap-imputation.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RecapImputationComponent implements OnInit {
    private _unsubscribeAll: Subject<any>;

    imputations: TripImputationResponseDTO[] = [];
    vehiculeRoutes: VehiculeRoute[] = [];
    filteredImputations: TripImputationResponseDTO[] = [];

    // Filter
    isYearSelected = false;
    filterAffaire: Affaire;
    filterVehicule: VehiculeGpsLocation;
    filterSoustraitant: SubContractor;
    filterMonth: number = new Date().getMonth() + 1;
    filterYear: string = new Date().getFullYear().toString();
    filterClient: Client;
    filterLot: Lot;
    months = [
        {value: 1, name: 'Janvier'},
        {value: 2, name: 'Fervrier'},
        {value: 3, name: 'Mars'},
        {value: 4, name: 'Avril'},
        {value: 5, name: 'Mai'},
        {value: 6, name: 'Juin'},
        {value: 7, name: 'Juillet'},
        {value: 8, name: 'Aout'},
        {value: 9, name: 'Septembre'},
        {value: 10, name: 'Octobre'},
        {value: 11, name: 'Novembre'},
        {value: 12, name: 'Décember'}
    ];

    years: number[] = [];
    clients: Client[] = [];
    vehicules: VehiculeGpsLocation[] = [];
    lots: Lot[] = [];
    affaires: Affaire[] = [];
    soustraitants: SubContractor[] = [];

    public ColumnMode = ColumnMode;
    isLoading = false;

    public filterLogistiques: FilterLogistique[] = [];
    public filterLogistique: FilterLogistique = new FilterLogistique();

    loading: Boolean = false;

    constructor(
        private recapImputationService: RecapImputationService,
        private vehiculeRouteService: VehiculeRouteService,
        private imputationService: ImputationService,
        private subContractorService: SubContractorService,
        private vehiculeGpsLocationService: VehiculeGpsLocationService,
        private lotService: LotService
    ) {
        this._unsubscribeAll = new Subject();
    }

    getFilterLogistique(): FilterLogistique[] {
        return [
            {name: 'Mois', value: LogistiqueFilter.MONTH, isActive: true},
            {name: 'Affaire', value: LogistiqueFilter.AFFAIRE, isActive: true},
            {name: 'Véhicule', value: LogistiqueFilter.VEHICULE, isActive: true},
            {name: 'Client', value: LogistiqueFilter.CLIENT, isActive: true},
            {name: 'Lot', value: LogistiqueFilter.LOT, isActive: true},
            {name: 'Sous traitant', value: LogistiqueFilter.SOUS_TRAITANT, isActive: true},
        ];
    }

    ngOnInit(): void {
        this.initializeYears();
        this.loadClients();
        this.loadLots();
        this.loadAffaires();
        this.loadVehicles();
        this.loadSousTraitants();

        this.isLoading = false;
        console.log(this.isLoading);

        this.loadData();

        // Default to current year and month
        this.filterYear = new Date().getFullYear().toString();
        this.filterMonth = new Date().getMonth() + 1;

        this.filterLogistiques = this.getFilterLogistique();

        this.filteredImputations = this.imputations;

        this.subContractorService.onSubContractorListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (data) => {
                if (data) {
                    this.soustraitants = data;
                }
            });


    }

    onFilterTypeChange(): void {

        this.filterAffaire = null;
        this.filterVehicule = null;
        this.filterClient = null;
        this.filterLot = null;
        this.filterSoustraitant = null;

        if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.MONTH) {
            this.filterYear = new Date().getFullYear().toString();
            this.filterMonth = new Date().getMonth() + 1;
        } else {
            this.filterYear = null;
            this.filterMonth = null;
        }
        // Clear the imputations list
        this.imputations = [];
        this.filteredImputations = [];
        this.loadData();

    }

    loadData(): void {

        this.isLoading = true;
        console.log(this.isLoading);

        if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.MONTH && this.filterMonth) {
            const selectedMonth = this.filterMonth;
            const selectedYear = Number(this.filterYear);

            if (selectedMonth && selectedYear) {
                this.recapImputationService.getAllImputationbymounth(selectedMonth, selectedYear).then(
                    (imputations) => {
                        this.imputations = Array.isArray(imputations) ? imputations : [];
                        this.filteredImputations = this.imputations;
                        this.filterData();
                    },
                    (error) => console.error('Error loading imputations:', error)
                );
            } else {
                console.error('Month or Year is not defined!');
            }
        } else if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.AFFAIRE && this.filterAffaire) {
            this.recapImputationService.getAllImputationbyAffaire(this.filterAffaire.id).then(
                (imputations) => {
                    this.imputations = Array.isArray(imputations) ? imputations : [];
                    this.filteredImputations = this.imputations;
                    this.filterData();
                },
                (error) => console.error('Error loading imputations by affaire:', error)
            );
        } else if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.VEHICULE && this.filterVehicule) {
            this.recapImputationService.getAllImputationbyVehicule(this.filterVehicule.vehicleId).then(
                (imputations) => {
                    this.imputations = Array.isArray(imputations) ? imputations : [];
                    this.filteredImputations = this.imputations;
                    this.filterData();
                },
                (error) => console.error('Error loading imputations by vehicule:', error)
            );
        } else if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.CLIENT && this.filterClient) {
            this.recapImputationService.getAllImputationbyClient(this.filterClient.id).then(
                (imputations) => {
                    this.imputations = Array.isArray(imputations) ? imputations : [];
                    this.filteredImputations = this.imputations;
                    this.filterData();
                },
                (error) => console.error('Error loading imputations by Client:', error)
            );
        } else if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.LOT && this.filterLot) {
            this.recapImputationService.getAllImputationbyLot(this.filterLot.id).then(
                (imputations) => {
                    this.imputations = Array.isArray(imputations) ? imputations : [];
                    this.filteredImputations = this.imputations;
                    this.filterData();
                },
                (error) => console.error('Error loading imputations by lot:', error)
            );
        } else if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.SOUS_TRAITANT && this.filterSoustraitant) {
            this.recapImputationService.getAllImputationbySousTraitant(this.filterSoustraitant.id).then(
                (imputations) => {
                    this.imputations = Array.isArray(imputations) ? imputations : [];
                    this.filteredImputations = this.imputations;
                    this.filterData();
                },
                (error) => console.error('Error loading imputations by sous traitant:', error)
            );
        } else {
            this.isLoading = false;
            console.log(this.isLoading);
            console.error('Please select a filter type and provide the required filters.');
        }


    }

    initializeYears(): void {
        this.filterYear = null;
        const currentYear = new Date().getFullYear();
        this.years = Array.from({length: 10}, (_, i) => currentYear - i);
    }

    loadClients(): void {
        this.vehiculeRouteService.getAllClients().then(
            (clients) => (this.clients = Array.isArray(clients) ? clients : []),
            (error) => console.error('Error loading clients:', error)
        );
    }

    loadLots(): void {
        this.lotService.onLotListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (data) => {
                if (data) {
                    this.lots = data;
                }
            });

        this.lotService.allLots();
    }

    loadAffaires(): void {
        this.imputationService.onImputationListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
            if (data) {
                this.affaires = data;
            }
        });

        this.imputationService.byRequestService(RequestService.LOGISTIQUE);
    }

    loadVehicles(): void {
        this.vehiculeGpsLocationService.onVehiculeListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            data => {
                if (data) {
                    this.vehicules = data;
                }
            }, error => {
                console.error('Error fetching vehicles:', error);
            }
        );
        this.vehiculeGpsLocationService.getAllVehiculeGps();
    }

    loadSousTraitants(): void {

        this.subContractorService.allSousTraitant();
    }


    onAffaireChanged(): void {

        if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.AFFAIRE) {
            this.loadData();
        } else {
            this.filterData();
        }

    }

    onYearSelect(): void {
        this.isYearSelected = !!this.filterYear;
        this.filterMonth = !this.filterMonth ? this.filterMonth : new Date().getMonth() + 1;
        if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.MONTH) {
            this.loadData();
        } else {
            this.filterData();
        }
    }

    onMonthSelect(): void {
        if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.MONTH) {
            this.loadData();
        } else {
            this.filterData();
        }

    }

    onVehiculeChanged(): void {
        if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.VEHICULE) {
            this.loadData();
        } else {
            this.filterData();
        }

    }

    onClientChanged() {
        if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.CLIENT) {
            this.loadData();
        } else {
            this.filterData();
        }
    }


    onLotChanged() {
        if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.LOT) {
            this.loadData();
        } else {
            this.filterData();
        }
    }


    onSousTraitantChanged() {
        if (this.filterLogistique && this.filterLogistique.value === LogistiqueFilter.SOUS_TRAITANT) {
            this.loadData();
        } else {
            this.filterData();
        }
    }


    filterData(): void {
        const selectedMonth = this.filterMonth;
        const selectedYear = this.filterYear?.toString();
        this.isLoading = false;
        console.log(this.isLoading);

        this.filteredImputations = this.imputations.filter(item => {
            const itemDate = new Date(item.vehiculeRoute.date);
            const itemYear = itemDate.getFullYear().toString();
            const itemMonth = itemDate.getMonth() + 1;
            // tslint:disable-next-line:max-line-length
            const vehiculeMatch = this.filterVehicule ? item.vehiculeRoute.vehiculeGpsLocation.vehicleId === this.filterVehicule?.vehicleId : true;
            const affaireMatch = this.filterAffaire ? item.affaireId === this.filterAffaire.id : true;
            const clientMatch = this.filterClient ? item.clientId === this.filterClient.id : true;
            const lotMatch = this.filterLot ? item.lotId === this.filterLot.id : true;
            const soustraitantMatch = this.filterSoustraitant ? item.subContractorId === this.filterSoustraitant.id : true;

            // Handle filtering by Year and Month regardless of filterType
            const monthMatch = selectedMonth ? itemMonth === selectedMonth : true;
            const yearMatch = selectedYear ? itemYear === selectedYear : true;


            // Combine all conditions
            return yearMatch && monthMatch && affaireMatch && clientMatch && lotMatch && soustraitantMatch && vehiculeMatch;
        });
    }

    resetFilters(): void {
        this.filterLogistique = null;
        this.filterMonth = null;
        this.filterYear = null;
        this.filterAffaire = null;
        this.filterVehicule = null;
        this.filterClient = null;
        this.filterLot = null;
        this.filterSoustraitant = null;

        this.filteredImputations = [];
    }

    getTotalCostImputation(): number {
        return this.filteredImputations.reduce(
            (total, imputation) => total + (imputation.costImputation || 0),
            0
        );
    }


    exportToPdf(): void {
        import('jspdf').then((jsPDFModule) => {
            import('jspdf-autotable').then((autoTableModule) => {
                // tslint:disable-next-line:no-shadowed-variable
                const {jsPDF} = jsPDFModule;
                const doc = new jsPDF();

                // Add company logo
                const logoUrl = 'assets/images/logo/appLogoFullColors.png';
                doc.addImage(logoUrl, 'PNG', 14, 10, 50, 20); // Adjust position and size as needed

                // Add dynamic title based on filter
                let title = 'Rapport d\'Imputation';

                if (this.filterLogistique.value === LogistiqueFilter.MONTH && this.filterMonth) {
                    const monthName = this.months.find(m => m.value === this.filterMonth)?.name || '';
                    title = `Rapport d'Imputation pour ${monthName} ${this.filterYear}`;

                } else if (this.filterLogistique.value === LogistiqueFilter.AFFAIRE && this.filterAffaire) {
                    title = `Rapport d'Imputation pour l'Affaire: ${this.filterAffaire.code}`;

                } else if (this.filterClient) {
                    const clientName = this.filterClient ? this.filterClient.name : null;
                    title = `Rapport d'Imputation pour ${clientName} ${this.filterYear}`;
                }

                doc.setFontSize(16);
                doc.text(title, 14, 40);

                interface Column {
                    title: string;
                    dataKey: string;
                    cellWidth?: number;
                }

                const columns: Column[] = [
                    {title: 'Date', dataKey: 'date', cellWidth: 20},
                    {title: 'Véhicule', dataKey: 'vehicule', cellWidth: 30},
                    {title: 'Affaire', dataKey: 'affaire', cellWidth: 30},
                    {title: 'Client', dataKey: 'client', cellWidth: 25},
                    {title: 'Lot', dataKey: 'lot', cellWidth: 25},
                    {title: 'Soustraitant', dataKey: 'soustraitant', cellWidth: 25},
                    {title: '% Imputation', dataKey: 'fillingPercentage', cellWidth: 20},
                    {title: 'Coût Imputation', dataKey: 'costImputation', cellWidth: 20}
                    // Exclude 'Observation' column
                ];

                const rows = this.filteredImputations.map(imputation => ({
                    date: imputation.vehiculeRoute?.date ? new Date(imputation.vehiculeRoute.date).toLocaleDateString() : '',
                    vehicule: imputation.vehiculeRoute?.vehiculeGpsLocation?.name || '',
                    affaire: imputation.affaireCode || '',
                    client: imputation.clientName || '',
                    lot: imputation.lotName || '',
                    soustraitant: imputation.subContractorFullName || '',
                    fillingPercentage: imputation.fillingPercentage ? `${imputation.fillingPercentage}%` : '',
                    costImputation: imputation.costImputation ? imputation.costImputation.toFixed(2) : '0.00'
                }));

                const tableWidth = columns.reduce((sum, col) => sum + (col.cellWidth || 0), 0);

                const pageWidth = doc.internal.pageSize.getWidth();
                const marginLeft = (pageWidth - tableWidth) / 2;

                autoTableModule.default(doc, {
                    head: [columns.map(col => col.title)],
                    body: rows.map(row => columns.map(col => row[col.dataKey])),
                    startY: 50,
                    margin: {left: marginLeft},
                    columnStyles: {
                        0: {cellWidth: columns[0].cellWidth},
                        1: {cellWidth: columns[1].cellWidth},
                        2: {cellWidth: columns[2].cellWidth},
                        3: {cellWidth: columns[3].cellWidth},
                        4: {cellWidth: columns[4].cellWidth},
                        5: {cellWidth: columns[5].cellWidth},
                        6: {cellWidth: columns[6].cellWidth},
                        7: {cellWidth: columns[7].cellWidth}
                    },
                    styles: {
                        overflow: 'linebreak',
                        cellPadding: 1,
                        fontSize: 6,
                        valign: 'middle',
                        halign: 'left',
                        fillColor: '#FFFFFF',
                        textColor: '#000000'
                    },
                    headStyles: {
                        fillColor: '#901023',
                        textColor: '#FFFFFF',
                        fontStyle: 'bold'
                    },
                    didDrawPage: (data) => {
                        if (data.pageCount === data.pageNumber) {
                            const totalCost = this.getTotalCostImputation();
                            const tableBottomY = data.cursor.y;
                            const customColor = '#901023';
                            doc.setFontSize(12);
                            doc.setTextColor(customColor);
                            doc.text(
                                `Coût Total d'Imputation: ${totalCost.toFixed(2)}`,
                                marginLeft,
                                tableBottomY + 10
                            );
                        }
                    }
                });

                // Save the PDF
                doc.save('rapport_imputation.pdf');
            });
        });
    }

    async exportToExcel(): Promise<void> {
        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rapport d\'Imputation');
        // Define columns with headers and widths
        const columns = [
            {header: 'Date', key: 'date', width: 15},
            {header: 'Véhicule', key: 'vehicule', width: 30},
            {header: 'Affaire', key: 'affaire', width: 20},
            {header: 'Client', key: 'client', width: 20},
            {header: 'Lot', key: 'lot', width: 15},
            {header: 'Soustraitant', key: 'soustraitant', width: 20},
            {header: '% Imputation', key: 'fillingPercentage', width: 15},
            {header: 'Coût Imputation', key: 'costImputation', width: 15},
        ];

        // Add columns to the worksheet
        worksheet.columns = columns;

        const headerRow = worksheet.getRow(3);
        headerRow.values = columns.map(col => col.header);

        // Style the header row
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'FF901023'},
            };
            cell.font = {
                bold: true,
                color: {argb: 'FFFFFFFF'},
            };
            cell.alignment = {vertical: 'middle', horizontal: 'center'};
            cell.border = {
                top: {style: 'thin', color: {argb: 'FF000000'}},
                left: {style: 'thin', color: {argb: 'FF000000'}},
                bottom: {style: 'thin', color: {argb: 'FF000000'}},
                right: {style: 'thin', color: {argb: 'FF000000'}},
            };
        });

        const rows = this.filteredImputations.map(imputation => ({
            date: imputation.vehiculeRoute?.date ? new Date(imputation.vehiculeRoute.date).toLocaleDateString() : '',
            vehicule: imputation.vehiculeRoute?.vehiculeGpsLocation?.name || '',
            affaire: imputation.affaireCode || '',
            client: imputation.clientName || '',
            lot: imputation.lotName || '',
            soustraitant: imputation.subContractorFullName || '',
            fillingPercentage: imputation.fillingPercentage ? `${imputation.fillingPercentage}%` : '',
            costImputation: imputation.costImputation ? imputation.costImputation.toFixed(2) : '0.00',
        }));

        // Add rows to the worksheet (starting from row 4)
        rows.forEach((row, index) => {
            const dataRow = worksheet.getRow(4 + index);
            dataRow.values = Object.values(row);
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 3) {
                row.eachCell((cell) => {
                    cell.alignment = {vertical: 'middle', horizontal: 'left'};
                    cell.border = {
                        top: {style: 'thin', color: {argb: 'FF000000'}},
                        left: {style: 'thin', color: {argb: 'FF000000'}},
                        bottom: {style: 'thin', color: {argb: 'FF000000'}},
                        right: {style: 'thin', color: {argb: 'FF000000'}},
                    };
                });
            }
        });

        const totalCost = this.getTotalCostImputation();
        const totalRow = worksheet.addRow({
            date: '',
            vehicule: '',
            affaire: '',
            client: '',
            lot: '',
            soustraitant: '',
            fillingPercentage: '',
            costImputation: `Coût Total d'Imputation: ${totalCost.toFixed(2)}`,
        });

        worksheet.mergeCells(`A${totalRow.number}:G${totalRow.number}`);

        totalRow.eachCell((cell) => {
            cell.font = {
                bold: true,
                color: {argb: 'FF901023'},
            };
            cell.alignment = {vertical: 'middle', horizontal: 'right'};
        });

        //  the workbook to a buffer and trigger download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(blob, 'rapport_imputation.xlsx');
    }

}




