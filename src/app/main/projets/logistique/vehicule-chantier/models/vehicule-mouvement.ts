import {Affaire} from '../../models/affaire.model';
import {Chauffeur} from '../../models/chauffeur';
import {Fournisseur} from '../../models/fournisseur';
import {VehiculeGpsLocation} from './vehicule-gps-location';


export class VehiculeMouvement {
  id: number;
  date: Date;
  vehicle: VehiculeGpsLocation;
  codeVehicle: string;
  registrationPlate: string;
  chauffeur: Chauffeur;
  from: Affaire;
  to: Affaire;
  distanceTraveled: number;
  affaire: Affaire;
  fournisseurs: Fournisseur[];
  bcfBlInterne: number;
  fillingPercentage: number;
  amountHt: number;
  costPerKm: number;
  costPerTrip: number;
  observations: string;
}
