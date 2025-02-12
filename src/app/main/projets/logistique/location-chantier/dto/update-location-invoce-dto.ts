import {Client} from '../../models/client';
import {Lot} from '../../models/lot';

export class UpdateLocationInvoceDTO {
    public client?: Client;
    public lot?: Lot;

    constructor(
        public id: number,
        public type: string,
        public lotId: number,
        public lotName: string,
        public clientId: number,
        public clientName: string,
        public genreVehicule: string,
    ) {
    }
}
