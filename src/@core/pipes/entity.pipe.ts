import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'entity'
})
export class EntityPipe implements PipeTransform {

    transform(items: any[],
              field: string,
              value: any,
              searchText: string,
              key: string): any[] {
        console.log(value);
        console.log(searchText);


        if (!items) { return []; }
        // ==
        if (value == 0 && !searchText) {
            console.log('case 1');
            return items;
        }


        // 01
        if (value == 0 && searchText) {
            console.log('case 2');
            searchText = searchText.toLowerCase();
            return items.filter(it => it[key].toLowerCase().includes(searchText));

        }

        // 10
        if (value && value > 0 && !searchText) {
            console.log('case 3');
            return items.filter(it => it[field] == value);
        }

        // 11
        if (value && value > 0 && searchText) {
            console.log('case 4');

            searchText = searchText.toLowerCase();
            return items.filter(it => it[field] == value && it[key].toLowerCase().includes(searchText));
        }
    }


}
