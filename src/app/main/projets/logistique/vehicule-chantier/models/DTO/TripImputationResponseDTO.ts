import { VehiculeRoute } from '../vehicule-route';
import {Client} from '../../../models/client';
import {Affaire} from '../../../models/affaire';
import {SubContractor} from '../../../../../../../@core/models/sub-contractor';
import {Lot} from "../../../../../../../@core/models/lot";


export class TripImputationResponseDTO {

    public affaire?: Affaire ;
    public soustraitant?: SubContractor ;
    public client?: Client ;
    public lot?: Lot ;

    constructor(
        public id: number,
        public affaireId: number,
        public affaireCode: string,
        public fillingPercentage: number,
        public observation: string,
        public clientId: number,
        public clientName: string,
        public lotId: number,
        public lotName: string,
        public subContractorId: number,
        public subContractorFullName: string,
        public costImputation: number,
        public vehiculeRoute?: VehiculeRoute ,
        public  isValidated?: boolean,

    ) {}
}
