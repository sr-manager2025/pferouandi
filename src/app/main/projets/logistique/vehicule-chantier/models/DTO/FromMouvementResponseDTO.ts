import { Fournisseur } from '../../../models/fournisseur';
import {Affaire} from '../../../models/affaire';

export class FromMouvementResponseDTO {
  public affaire?: Affaire ;
  public fournisseur?: Fournisseur ;

  constructor(
  public id: number ,
  public vehiculeRouteId: number,
  public affaireId: number ,
  public affaireCode: string ,
  public fournisseurId: number ,
  public fournisseurName: string ,
  public bl: string,
  public blMontant: number,
  public dateBl: Date
) {}
}
