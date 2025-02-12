import {Chauffeur} from '../../models/chauffeur';
import {VehiculeRoute} from './vehicule-route';

export class VehiculeGpsLocation {
  vehicleId: number;
  groupName: string;
  imei: string;
  name?: string;
  device?: string;
  model?: string;
  costPerKm?: BigInt;
  plateNumber?: string;
  chauffeur?: Chauffeur[];
  vehiculeRoutes?: VehiculeRoute[];
}
