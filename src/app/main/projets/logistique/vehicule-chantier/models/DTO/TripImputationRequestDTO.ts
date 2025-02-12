import { VehiculeRoute } from './../vehicule-route';
export class TripImputationRequestDTO {
    constructor(
        public id: number,
        public vehiculeRouteId: number,
        public affaireId: number,
        public fillingPercentage: number,
        public observation: string,
        public clientId: number,
        public lotId: number,
        public subContractorId: number,
        public costImputation: number,
        public isNew?: boolean,
        public isSaved?: boolean

    ) {}
}
