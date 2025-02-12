import { EnginRoute } from '../EnginRoute';
import {Client} from '../../../models/client';
import {Affaire} from '../../../models/affaire';
import {SubContractor} from '../../../../../../../@core/models/sub-contractor';
import {Lot} from "../../../../../../../@core/models/lot";

export class EnginImputationResponseDTO {

    public affaire?: Affaire ;
    public soustraitant?: SubContractor ;
    public client?: Client ;
    public lot?: Lot ;

    constructor(
        public id: number,
        public affaireId: number,
        public affaireCode: string,
        public nbrHImputation: number,
        public observation: string,
        public clientId: number,
        public clientName: string,
        public lotId: number,
        public lotName: string,
        public subContractorId: number,
        public subContractorFullName: string,
        public costImputation: number,
        public enginRoute?: EnginRoute ,
        public  isValidated?: boolean,

    ) {}
}
