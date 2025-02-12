
import { EnginRoute } from '../EnginRoute';
import {Affaire} from '../../../models/affaire.model';
import {Soustraitant} from '../../../models/soustraitant';
import {Client} from '@stomp/stompjs';
import {Lot} from '../../../models/lot';

export class TripImputationResponseDTO {

    public affaire?: Affaire ;
    public soustraitant?: Soustraitant ;

    constructor(
        public id: number,
        public affaireId: number,
        public affaireCode: string,
        public fillingPercentage: number,
        public observation: string,
        public client: Client,
        public lot: Lot,
        public subContractorId: number,
        public subContractorFullName: string,
        public costImputation: number,
        public enginRoute?: EnginRoute ,
        public  isValidated?: boolean,

    ) {}
}
