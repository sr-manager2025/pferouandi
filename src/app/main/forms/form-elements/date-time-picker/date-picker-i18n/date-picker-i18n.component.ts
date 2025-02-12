import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateCustomParserFormatter} from './dateformat';

@Component({
    selector: 'date-picker-i18n',
    templateUrl: './date-picker-i18n.component.html',
    providers: [
        {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
    ]
    // providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom NgbDatepickerI18n provider
})
export class DatePickerI18nComponent implements OnInit {

    @Output() dateSelectedEvent = new EventEmitter<NgbDateStruct>();

    @Input() public ngbDateStruct: NgbDateStruct;

    @Input() public disabled: boolean;

    public finalDate = '07/06/2022';

    constructor() {

    }

    ngOnInit() {
    }

    onDateSelect(event) {
        const year = event.year;
        const month = event.month <= 9 ? '0' + event.month : event.month;
        const day = event.day <= 9 ? '0' + event.day : event.day;
        this.finalDate = day + '/' + month + '/' + year;

        this.dateSelectedEvent.emit(event);
        // console.log(this.finalDate)
    }
}
