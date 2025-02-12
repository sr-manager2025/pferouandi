
import { Client } from '../../models/client';
import {VehiculeRoute} from './vehicule-route';
import {Affaire} from '../../models/affaire';
import {SubContractor} from '../../../../../../@core/models/sub-contractor';
import {Lot} from "../../../../../../@core/models/lot";

export class TripImputation {
  id: number;
  affaire: Affaire;
  fillingPercentage: number;
  observation: string;
  client: Client;
  lot: Lot;
  soustraitant: SubContractor;
  costImputation: number;
  vehiculeRoute: VehiculeRoute;

  constructor(
    id: number = 0,
    affaire: Affaire = null,
    fillingPercentage: number = 0,
    observation: string = '',
    client: Client = null,
    lot: Lot = null,
    soustraitant = null,
    costImputation: number = 0,
    vehiculeRoute: VehiculeRoute = null
  ) {
    this.id = id;
    this.affaire = affaire;
    this.fillingPercentage = fillingPercentage;
    this.observation = observation;
    this.client = client;
    this.lot = lot;
    this.soustraitant = soustraitant;
    this.costImputation = costImputation;
    this.vehiculeRoute = vehiculeRoute;
  }
}
