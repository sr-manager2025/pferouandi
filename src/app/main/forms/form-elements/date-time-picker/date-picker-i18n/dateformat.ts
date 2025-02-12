import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';
import {isNumeric} from 'rxjs/internal-compatibility';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {

    parse(value: string): NgbDateStruct {
        if (value) {
            const dateParts = value.trim().split('/');
            if (dateParts.length === 1 && isNumeric(dateParts[0])) {
                return {day: parseInt(dateParts[0]), month: null, year: null};
            } else if (dateParts.length === 2 && isNumeric(dateParts[0]) && isNumeric(dateParts[1])) {
                return {day: parseInt(dateParts[0]), month: parseInt(dateParts[1]), year: null};
            } else if (dateParts.length === 3 && isNumeric(dateParts[0]) && isNumeric(dateParts[1]) && isNumeric(dateParts[2])) {
                return {day: parseInt(dateParts[0]), month: parseInt(dateParts[1]), year: parseInt(dateParts[2])};
            }
        }
        return null;
    }

    format(date: NgbDateStruct): string {
        return date ? `${date.day <= 9 ? '0' + date.day : date.day}/${date.month <= 9 ? '0' + date.month : date.month}/${date.year}` : '';
    }
}
