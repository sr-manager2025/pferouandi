import {id} from '@swimlane/ngx-datatable';

export class Affaire {

   id: number;
   numero = 0;
   code: string;
   intitule = '';
   discriminator = '';

  constructor(id: number, code: string) {
    this.id = id;
    this.code = code;
  }

}
