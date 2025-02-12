import {Civilite} from '../enum/civilite';
import {AccountMovementType} from '../enum/account-movement-type';
import {SubContractorStatus} from '../enum/sub-contractor-status';
import {SubContractorCategorie} from '../enum/sub-contractor-categorie';
import {ModeTravail} from '../enum/mode-travail';
import {id} from '@swimlane/ngx-datatable';

export class SubContractor {

    public id: number;

    // Gerant
    public  civilite: Civilite;
    public prenom: string;
    public nom: string;
    public cin: string;
    public gsm: string;


    // Entreprise
    public fullName: string;
    public adresse: string;

    public villeId: number;
    public villeIntitule: string;

    // public ville: Param;

    public tel: string;
    public fax: string;
    public email: string;

    public modeTravail: ModeTravail; // AVEC CONTRAT- SANS CONTRAT
    public subContractorCategorie: SubContractorCategorie; // ENTREPRISE - PERSONNE PYSIQUE
    public subContractorStatus: SubContractorStatus; // ACTIF - INACTIF - SUSPENDU

    public ice: string;
    public indiceFiscal: string;
    public patente: string;

    public rc: string;
    public cnss: string;
    public rib: string;

    public company: string;
    public username: string;
    public avatar: string;


    public siteWeb: string;

    public dateCreation: Date;

    public initialBalance: number;
    public initialBalanceType: AccountMovementType;

    public credit: number;
    public debit: number;
    public solde: number;

    public soldeValue: number;
    public soldeStatus: string;

    public cinImage: string;
    public statutImage: string;
    public rcImage: string;
    public patenteImage: string;
    public cnssImage: string;
    public atImage: string;
    public ribImage: string;


    public consulted: boolean;


    constructor(id: number, fullName: string) {
        this.id = id;
        this.fullName = fullName;
    }
}
