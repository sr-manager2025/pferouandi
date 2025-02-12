import { Component, OnDestroy, OnInit } from '@angular/core';
import { Affaire } from '../../models/affaire';
import { ImputationService } from '../../imputation.service';
import { takeUntil } from 'rxjs/operators';
import { RequestService } from '../../../../../../@core/enum/RequestService';
import { Subject } from 'rxjs';
import { RecapGeneralService } from '../recap-general.service';

@Component({
    selector: 'app-recap-general',
    templateUrl: './recap-general.component.html',
    styleUrls: ['./recap-general.component.scss']
})
export class RecapGeneralComponent implements OnInit, OnDestroy {
    affaires: Affaire[] = [];
    totalImputations: any[] = [];
    private _unsubscribeAll: Subject<any>;
    columns = [
        { prop: 'affaireName', name: 'Affaire', sortable: true },
        { prop: 'totalCostImputation', name: 'Total Cost Imputation', sortable: true }
    ];
    rows: any[] = [];

    constructor(private imputationService: ImputationService,
                private recapGeneralService: RecapGeneralService) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.recapGeneralService.onMouvementsListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                if (data && data.length > 0) {
                    this.affaires = data;
                    this.calculateTotalImputationCost();  // Fetch and calculate total costs after affaires data is available
                }
            });

        // Optionally, trigger initial data fetch if needed
        this.recapGeneralService.getTotalImputationCostForAllAffaires(this.affaires).subscribe((totals) => {
            this.totalImputations = totals;
            this.updateRows();  // Update the rows data for the table
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // Function to calculate the total costImputation for each affaire
    calculateTotalImputationCost() {
        this.recapGeneralService.getTotalImputationCostForAllAffaires(this.affaires).subscribe((totals) => {
            this.totalImputations = totals;
            this.updateRows();
        });
    }

    // Function to update rows based on affaires and total imputations
    updateRows() {
        // Combine affaires and totalImputations into one array for rows
        this.rows = this.affaires.map((affaire, index) => ({
            affaireName: affaire.code,
            totalCostImputation: this.totalImputations[index]?.totalCostImputation || 0
        }));
    }
}
