import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'lot'
})
export class LotPipe implements PipeTransform {

  transform(items: any[], field: string, value: any): any[] {

    if (!items) { return []; }
    if (!value) { return items; }
    return items.filter(it => it[field] == value);

  }

}
