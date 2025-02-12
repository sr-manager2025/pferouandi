import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, } from '@angular/core';

import * as feather from 'feather-icons';
import {ChartOptions, ChartType} from 'chart.js';
import {takeUntil} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {ChauffeurService} from '../chauffeur/chauffeur.service';
import {VehiculeRouteService} from '../mouvement-vh/vehicule-route.service';
import {AppUser} from '../../../../authentication/models/app-user';
import {AuthService} from '../../../../authentication/auth.service';
import {VehiculeGpsLocationService} from '../vehicule/vehicule-gps-location.service';
import {FournisseurService} from '../../fournisseur.service';
import {ImputationService} from '../../imputation.service';
import {KpiVehiculeService} from '../vehicule/kpi-vehicule.service';
import {RequestService} from '../../../../../../@core/enum/RequestService';

@Component({
    selector: 'app-dashboard-mouvement',
    templateUrl: './dashboard-mouvement.component.html',
    styleUrls: ['./dashboard-mouvement.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardMouvementComponent implements OnInit {
    totalCostPerTrip: number;
    @ViewChild('gainedChartRef') gainedChartRef: any;
    public gainedChartoptions;
    private $primary = '#7367F0';

    apexDonutChart: any;
    isMenuToggled = false; // Adjust as necessary

    @ViewChild('apexDonutChartRef') apexDonutChartRef: ElementRef;

    vehiculeCount = 0;
    chauffeurCount = 0;
    fournisseurCount = 0;
    affaireCount = 0;
    lastUpdated = '';
    // ----------------------------------------------------
    selectedMonth: string; // Format: YYYY-MM
    totalCostChart: any = {
        stroke: {width: [2]},
        fill: {opacity: 1},
        tooltip: {enabled: true},
        colors: ['#942c34'],
        dataLabels: {enabled: false},
    };
    // ----------------------------------------------------
    @ViewChild('apexLineAreaChartRef', {static: false})
    apexLineAreaChartRef!: ElementRef;
    public apexLineAreaChart: any = {
        series: [],
        chart: {
            height: 350,
            type: 'area',
            stacked: true,
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        fill: {
            type: 'gradient',
        },
        xaxis: {
            categories: [],
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            show: true,
        },
        tooltip: {
            shared: true,
            intersect: false,
        },
        stroke: {
            curve: 'smooth',
        },
        colors: ['#942c34'],
        legend: {
            show: true,
        },
    };

    barChart = {
        datasets: [],
        labels: [],
        options: {
            responsive: true,
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Vehicule',
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10,
                        },
                    },
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Values',
                        },
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem) => `Value: ${tooltipItem.yLabel}`,
                },
            },
            legend: {
                display: true,
                position: 'top',
            },
        } as ChartOptions,
        legend: true,
        chartType: 'bar' as ChartType,
    };
    vehicles: { vehicleId: number; vehicleName: string }[] = [];
    filteredData: any[] = [];

    public DateRangeOptions = {
        altInput: true,
        mode: 'range',
        altInputClass:
            'form-control flat-picker bg-transparent border-0 shadow-none flatpickr-input',
        defaultDate: ['2019-05-01', '2019-05-10'],
        altFormat: 'Y-n-j',
    };
    // ----------------------------------------
    public horiBarChart: any = {
        datasets: [
            {
                data: [],
                label: 'Cost per Affaire ',
                backgroundColor: '#942c34',
                borderColor: '#942c34',
                borderWidth: 1,
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Cost(Mad)',
                        },
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Affaire',
                        },
                    },
                ],
            },
        },
        legend: true,
        chartType: 'horizontalBar',
    };
// ----------------------------------------
    private currentUserSubscription: Subscription;
    public currentUser: AppUser;

    // --------------------------------------
    private _unsubscribeAll: Subject<any>;

    constructor(public authService: AuthService,
                private vehiculeGpsLocationService: VehiculeGpsLocationService,
                private chauffeurService: ChauffeurService,
                private fournisseurService: FournisseurService,
                private imputationService: ImputationService,
                private vehiculeRouteService: VehiculeRouteService,
                private kpiService: KpiVehiculeService
    ) {
        this._unsubscribeAll = new Subject();
        this.currentUserSubscription = this.authService.currentUserSubject.subscribe(
            (data: AppUser) => {
                this.currentUser = data;
            }
        );
        authService.loadCurrentUser();
    }

    ngOnInit(): void {


        this.loadCounts();
        feather.replace();
        this.fetchData();
        this.loadPerformanceData();
        // -------------------------totalcostPerTripby day
        const date = new Date().toISOString().split('T')[0].slice(0, 7); // Get current month in YYYY-MM format
        this.selectedMonth = date;
        this.loadTotalCostPerTrip();
        // -----------------------------------
        this.kpiService.getCostPerAffaire().subscribe((data) => {
            // console.log('API Response:', data);
            const labels = [];
            const costData = [];

            for (const [affaire, cost] of Object.entries(data)) {
                labels.push(affaire);
                costData.push(cost);
            }

            this.horiBarChart.labels = labels;
            this.horiBarChart.datasets[0].data = costData;

            // console.log('Labels:', labels);
            // console.log('Data:', costData);
        });
        // -------------------------------------------
    }


    private loadCounts(): void {

        this.vehiculeGpsLocationService.onVehiculeListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            data => {
                this.vehiculeCount = data?.length;
            }, (error) => {
                console.error('Error fetching vehicle count:', error);
            });
        this.vehiculeGpsLocationService.getAllVehiculeGps();

       /* this.vehiculeGpsLocationService.onVehiculeListChanged().subscribe(
            (data: any[]) => {
                this.vehiculeCount = data.length
            }, (error) => {
                console.error("Error fetching vehicle count:", error)
            }
        );*/

        this.chauffeurService.onChauffeurListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            data => {
                this.chauffeurCount = data?.length;
            }, (error) => {
                console.error('Error fetching chauffeur count:', error);
            });
        this.chauffeurService.getAllChauffeurs();

       /* this.chauffeurService.getChauffeurCount().subscribe(
            (data: any[]) => {
                this.chauffeurCount = data.length
            }, (error) => {
                console.error("Error fetching chauffeur count:", error)
            }
        );*/

        this.fournisseurService.onFournisseurListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            data => {
                this.fournisseurCount = data?.length;
            });
        this.fournisseurService.getAllFournisseurs();

        /*this.fournisseurService.getAllFournisseurs().then(
          (fournisseurs) => (this.fournisseurCount = fournisseurs.length),
          (error) => console.error("Error fetching fournisseur count:", error)
        );*/

        this.imputationService.onImputationListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            data => {
                this.affaireCount = data?.length;
            }, (error) => {
                console.error('Error fetching affaire count:', error);
            });
        this.imputationService.byRequestService(RequestService.LOGISTIQUE);

        // @ts-ignore
       /* this.affaireService.getAffaire().subscribe(
            (data: any[]) => {
                this.affaireCount = data.length
            }, (error) => {
                console.error("Error fetching affaire count:", error)
            }
        );*/
        this.updateLastUpdatedDate();
    }

    private updateLastUpdatedDate(): void {
        const now = new Date();
        this.lastUpdated = `Updated ${this.timeAgo(now)}`;
    }

    private timeAgo(date: Date): string {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

        if (seconds < 60) {
            return `${seconds} seconds ago`;
        }

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes} minutes ago`;
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours} hours ago`;
        }

        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    }

    onVehicleFilterChange(event: any): void {
        const selectedVehicleId = +event.target.value;
        // console.log("Selected Vehicle ID:", selectedVehicleId);
        if (selectedVehicleId) {
            this.fetchData(selectedVehicleId);
        } else {
            this.fetchData();
        }
    }

    fetchData(vehicleId?: number): void {
        this.vehiculeRouteService.totalRouteLength().subscribe(
            (data: any[]) => {
                // console.log("Fetched data:", data);

                // Prepare data for chart
                const aggregatedData = this.aggregateData(data);
                // console.log("Aggregated data:", aggregatedData);

                // Populate the vehicles array for the dropdown
                this.vehicles = aggregatedData.map((item) => ({
                    vehicleId: item.vehicleId,
                    vehicleName: item.vehicleName,
                }));

                // Filter data based on the selected vehicleId
                this.filteredData = vehicleId
                    ? aggregatedData.filter((item) => item.vehicleId === vehicleId)
                    : aggregatedData;

                // console.log("Filtered data:", this.filteredData);

                // Update the chart with the filtered data
                this.updateChart();
            },
            (error: any) => {
                console.error('Error fetching route lengths:', error);
            }
        );
    }

    aggregateData(data: any[]): any[] {
        return data.reduce((acc, item) => {
            const existing = acc.find(
                (accItem) => accItem.vehicleId === item.vehicleId
            );
            if (existing) {
                existing.totalRouteLength += item.totalRouteLength;
                existing.totalCostParVoyage += item.totalCostParVoyage;
            } else {
                acc.push({
                    vehicleId: item.vehicleId,
                    vehicleName: item.vehicleName,
                    totalRouteLength: item.totalRouteLength,
                    totalCostParVoyage: item.totalCostParVoyage,
                });
            }
            return acc;
        }, []);
    }

    updateChart(): void {
        const labels = this.filteredData.map((item) => item.vehicleName);
        const routeLengthData = this.filteredData.map(
            (item) => item.totalRouteLength
        );
        const costParVoyageData = this.filteredData.map(
            (item) => item.totalCostParVoyage
        );

        this.barChart = {
            datasets: [
                {
                    label: 'Total Route Length',
                    data: routeLengthData,
                    backgroundColor: '#839bab',
                    borderColor: '#839bab',
                    borderWidth: 1,
                },
                {
                    label: 'Total Cost per Voyage',
                    data: costParVoyageData,
                    backgroundColor: '#942c34',
                    borderColor: '#942c34',
                    borderWidth: 1,
                },
            ],
            labels: labels,
            chartType: 'bar' as ChartType,
            options: {
                responsive: true,
                scales: {
                    xAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: ' Vehicule',
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: 'Values',
                            },
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem) => `Value: ${tooltipItem.yLabel}`,
                    },
                },
                legend: {
                    display: true,
                    position: 'top',
                },
            } as ChartOptions,
            legend: true,
        };
    }

    loadPerformanceData(): void {
        const startDate = '2024-01-01';
        const endDate = '2024-12-31';

        this.vehiculeRouteService.performanceOverTime(startDate, endDate).subscribe((response) => {
                // console.log("API response:", response);

                if (response && typeof response === 'object') {
                    const data = Object.entries(response).map(([date, performance]) => ({
                        date,
                        performance,
                    }));

                    this.apexLineAreaChart = {
                        series: [
                            {
                                name: 'Performance Over Time',
                                data: data.map((d) => d.performance),
                            },
                        ],
                        chart: {
                            height: 350,
                            width:
                                this.isMenuToggled === false
                                    ? this.apexLineAreaChartRef.nativeElement.offsetWidth
                                    : this.apexLineAreaChart.chart.width,
                            type: 'area',
                            stacked: true,
                            zoom: {
                                enabled: false,
                            },
                            toolbar: {
                                show: false,
                            },
                        },
                        fill: {
                            type: 'gradient',
                        },
                        xaxis: {
                            categories: data.map((d) => d.date),
                        },
                        Yaxis: {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        grid: {
                            show: true,
                        },
                        tooltip: {
                            shared: true,
                            intersect: false,
                        },
                        stroke: {
                            curve: 'smooth',
                        },
                        colors: ['#942c34'],
                        legend: {
                            show: true,
                        },
                    };
                } else {
                    console.error('Unexpected data format:', response);
                }
            });
    }

    // --------------totalcostPerTripby day
    loadTotalCostPerTrip(): void {
        const [year, month] = this.selectedMonth.split('-');
        this.vehiculeRouteService.totalCostPerTripByMonth(year, month).subscribe(
            (data: number) => {
                this.totalCostPerTrip = data;
            },
            (error) => {
                console.error('Error fetching total cost per trip', error);
            }
        );
    }

    // ----------------------------
    prepareChartData(data: any): void {
        const labels = [];
        const dataset = [];

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                labels.push(data[key].name);
                dataset.push(data[key].cost);
            }
        }

        // console.log("Chart labels:", labels);
        // console.log("Chart dataset:", dataset);

        this.horiBarChart.labels = labels;
        this.horiBarChart.datasets[0].data = dataset;
    }

    // -----------------------cost per group
    loadChartData(): void {
        this.kpiService.getCostByGroupName().subscribe(data => {
            const costByGroup = data['costByGroup'] || {};
            const percentages = data['percentages'] || {};

            // Prepare data for the donut chart
            this.apexDonutChart = {
                series: Object.values(costByGroup),
                labels: Object.keys(percentages),
                chart: {
                    height: 350,
                    type: 'donut'
                },
                colors: ['#FF4560', '#00E396', '#008FFB', '#FF66C3', '#775DD0'],
                plotOptions: {
                    pie: {
                        donut: {
                            size: '75%'
                        }
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }],
                legend: {
                    position: 'bottom',
                    formatter: function (val, opts) {
                        return `${val} (${opts.w.globals.series[opts.seriesIndex]}%)`;
                    }
                }
            };
        });
    }
}
