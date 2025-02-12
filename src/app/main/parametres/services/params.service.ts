import {Injectable} from '@angular/core';
import {SelectYear} from '../models/select-year';
import {SelectMonth} from '../models/select-month';
import {BehaviorSubject} from 'rxjs';
import {SrManagerService} from '../../projets/sr-manager.service';
import {Month} from '../../../../@core/enum/month';

@Injectable({
    providedIn: 'root'
})
export class ParamsService {

    public onUniteListChanged: BehaviorSubject<any>;

    constructor(private srManagerService: SrManagerService) {
        this.onUniteListChanged = new BehaviorSubject({});

    }

    getYears(): SelectYear[] {
        const years: SelectYear[] = [];
        const firstYear = 2021;
        // years.push({name: firstYear.toString(), value: firstYear});

        const currentYear: number = new Date().getFullYear();

        for (let i = firstYear; i <= currentYear + 1; i++) {
            const year: SelectYear = {name: i.toString(), value: i};
            years.push(year);
        }
        return years;
    }

    getMonths(): SelectMonth[] {
        return [
            {name: 'JANVIER', value: 1, month: Month.JANUARY},
            {name: 'FEVRIER', value: 2, month: Month.FEBRUARY},
            {name: 'MARS', value: 3, month: Month.MARCH},
            {name: 'AVRIL', value: 4, month: Month.APRIL},
            {name: 'MAI', value: 5, month: Month.MAY},
            {name: 'JUIN', value: 6, month: Month.JUNE},
            {name: 'JUILLET', value: 7, month: Month.JULY},
            {name: 'AOUT', value: 8, month: Month.AUGUST},
            {name: 'SEPTEMBRE', value: 9, month: Month.SEPTEMBER},
            {name: 'OCTOBRE', value: 10, month: Month.OCTOBER},
            {name: 'NOVEMBRE', value: 11, month: Month.NOVEMBER},
            {name: 'DECEMBRE', value: 12, month: Month.DECEMBER},
        ];
    }


    getOneYearByValue(value: number): SelectYear {
        const years: SelectYear[] = this.getYears();
        // tslint:disable-next-line:triple-equals
        if (years != undefined) {
            return years.find(
                (entity) => {
                    // tslint:disable-next-line:triple-equals
                    return entity != undefined && entity.value && entity.value == value;
                }
            );
        }
        return null;
    }

    getOneMonthByValue(value: number): SelectMonth {
        const months: SelectMonth[] = this.getMonths();
        // tslint:disable-next-line:triple-equals
        if (months != undefined) {
            return months.find(
                (entity) => {
                    // tslint:disable-next-line:triple-equals
                    return entity != undefined && entity.value && entity.value == value;
                }
            );
        }
        return null;
    }


}
