import {FromMouvement} from '../FromMouvement';

export class AssociateFromToRequestDTO {
  vehiculeRouteId: number;
  fromMouvements: FromMouvement[];


  constructor(vehiculeRouteId: number, fromMouvements: FromMouvement[]) {
    this.vehiculeRouteId = vehiculeRouteId;
    this.fromMouvements = fromMouvements;
  }
}
