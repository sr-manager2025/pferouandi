export class LocationInvoice {
    id: number;
    date: Date;
    type: string;
    affaire: string;
    lotId: number;
    lotName: string;
    clientId: number;
    clientName: string;
    frsChantierMse: string;
    bcfBlInterneMse: string;
    valeurMseHt: number;
    duDe: string;
    auA: string;
    kmParcouru: number;
    locataire: string;
    genreVehicule: string;
    bcfLoc: string;
    numeroFactureLoc: string;
    nbrHJF: number;
    puHt: number;
    montantLocHt: number;
    coutEstime: number;
    analyseCout: number;
    pourcentageRemplissage: number;
    natureOperation: string;
    obs: string;
}
