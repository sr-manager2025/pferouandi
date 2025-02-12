export class UpdateMouvementDTO {
    id: number;
    routeLength?: number;

    constructor(id: number, routeLength: number) {
        this.id = id;
        this.routeLength = routeLength;
    }
}
