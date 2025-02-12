export class UpdateFillingPercentageDTO {
    public  vehiculeRouteId: number;
    public  fillingPercentage: number;


    constructor(vehiculeRouteId: number, fillingPercentage: number) {
        this.vehiculeRouteId = vehiculeRouteId;
        this.fillingPercentage = fillingPercentage;
    }
}
