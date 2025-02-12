import {FromMouvement} from '../FromMouvement';
import {TripImputation} from '../TripImputation';

export class AssociateRequestDTO {
    vehicleId: number;
    date: string;
    fromMouvements: FromMouvement[];
    toAffaireId: number;
    imputations: TripImputation[];


    constructor(vehicleId: number,
                date: string,
                fromMouvements: FromMouvement[],
                toAffaireId: number,
                imputations: TripImputation[]) {
        this.vehicleId = vehicleId;
        this.date = date;
        this.fromMouvements = fromMouvements;
        this.toAffaireId = toAffaireId;
        this.imputations = imputations;
    }
}
