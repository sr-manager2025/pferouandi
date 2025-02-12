import { Fournisseur } from '../../models/fournisseur';
import { VehiculeGpsLocation } from './vehicule-gps-location';
import { VehiculeRoute } from './vehicule-route';
import {Affaire} from '../../models/affaire';

export class FromMouvement {
  id?: number;
  affaire?: Partial<Affaire>;
  fournisseur?: Partial<Fournisseur>;
  bl: string;
  blMontant: number;
  dateBl: Date;
  isNew?: boolean;
  vehiculeGpsLocation?: VehiculeGpsLocation;
  vehiculeRoute?: VehiculeRoute;

  constructor(init?: Partial<FromMouvement>) {
    Object.assign(this, init);
  }
}
