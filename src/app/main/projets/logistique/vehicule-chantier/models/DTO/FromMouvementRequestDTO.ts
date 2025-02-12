export class FromMouvementRequestDTO {
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
