export class ChampImputation {
    public id: number;
    public numero: number;
    public code: string;
    public intitule: string;
    public discriminator: string;
    public objet: string;

    public imputable: boolean;

    // Dashboard
    public enableDashboard: boolean;

    // Caisse
    public enableCashImputation: boolean;

    // Sous-traitance
    public enableStrAttachment: boolean;

    // Logistique
    public enableLogisticsImputation: boolean;

    // Paie
    public enablePayRollImputation: boolean;

    // Pointage
    public enableScoringArea: boolean;

    // Achat
    public enableNegoceImputation: boolean;

    // Drive
    public enableDrive: boolean;

    public siteStock: boolean;
    public siteProduction: boolean;

    public villeId: number;
    public villeintitule: string;

}
