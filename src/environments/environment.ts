// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// @ts-ignore
// @ts-ignore
export const environment = {
    production: false,
    hmr: false,
    apiUrl: 'http://localhost:4000',

    marcheCmdHost: 'http://localhost:6101/marches/commands',
    marcheQueryHost: 'http://localhost:6101/marches/queries',

    articleCmdHost: 'http://localhost:6101/articles/commands',
    articleQueryHost: 'http://localhost:6101/articles/queries',

    blocCmdHost: 'http://localhost:6101/blocs/commands',
    blocQueryHost: 'http://localhost:6101/blocs/queries',

    nodeBordereauCmdHost: 'http://localhost:6101/nodes/commands',
    nodeBordereauQueryHost: 'http://localhost:6101/nodes/queries',

    imputationQueryHost: 'http://localhost:6101/imputation/queries',
    lotQueryHost: 'http://localhost:6101/lot/queries',

    paramsCmdHost: 'http://localhost:6102/params/commands',
    paramsQueryHost: 'http://localhost:6102/params/queries',

    soustraitanceCmdHost: 'http://localhost:6103/soustraitances/commands',
    soustraitanceQueryHost: 'http://localhost:6103/soustraitances/queries',

    subcontractorQueryHost: 'http://localhost:6103/subcontractors/queries',

    nodeStQueryHost: 'http://localhost:6103/nodeSt/queries',

    sousBlocStCmdHost: 'http://localhost:6103/sousBlocSt/commands',
    sousBlocStQueryHost: 'http://localhost:6103/sousBlocSt/queries',

    ligneStQueryHost: 'http://localhost:6103/ligneSt/queries',


    subContractorCmdHost: 'http://localhost:6103/subcontractors/commands',
    subContractorQueryHost: 'http://localhost:6103/subcontractors/queries',

    situationsQueryHost: 'http://localhost:6103/situations/queries',

    engagementsQueryHost: 'http://localhost:6103/engagements/queries',
    engagementsCmdHost: 'http://localhost:6103/engagements/commands',

    pvengagementsCmdyHost: 'http://localhost:6103/pvengagements/commands',
    pvengagementsQueryHost: 'http://localhost:6103/pvengagements/queries',

    pvengagementsGrpQueryHost: 'http://localhost:6103/pvengagementsgrp/queries',

    pvengagementsLineQueryHost: 'http://localhost:6103/pvengagementsline/queries',

    reglementsQueryHost: 'http://localhost:6103/reglements/queries',
    reglementsCmdHost: 'http://localhost:6103/reglements/commands',

    attachementCmdHost: 'http://localhost:6103/attachement/commands',
    attachementQueryHost: 'http://localhost:6103/attachement/queries',

    deductionCmdHost: 'http://localhost:6103/deductions/commands',
    deductionQueryHost: 'http://localhost:6103/deductions/queries',

    consultationCmdHost: 'http://localhost:6103/consultations/commands',
    consultationQueryHost: 'http://localhost:6103/consultations/queries',

    contratCmdHost: 'http://localhost:6103/contrats/commands',
    contratQueryHost: 'http://localhost:6103/contrats/queries',

    suiviCmdHost: 'http://localhost:6103/suivis/commands',
    suiviQueryHost: 'http://localhost:6103/suivis/queries',

    // imputationCmdHost:   'http://localhost:6104/imputation/commands',

    budgetCmdHost: 'http://localhost:6104/budget/commands',
    linesCaisseCmdHost: 'http://localhost:6104/lines/commands',
    registreCaisseQueryHost: 'http://localhost:6104/registrecaisse/queries',
    linesCaisseQueryHost: 'http://localhost:6104/lignescaisse/queries',
    dataAnalyticsCaisseQueryHost: 'http://localhost:6104/data/analytics/queries',

    employeQueryHost: 'http://localhost:6105/employe/queries',
    employeCmdHost: 'http://localhost:6105/employe/commands',

    deptQueryHost: 'http://localhost:6105/dept/queries',
    deptCmdHost: 'http://localhost:6105/dept/commands',

    posteQueryHost: 'http://localhost:6105/poste/queries',
    posteCmdHost: 'http://localhost:6105/poste/commands',

    zoneQueryHost: 'http://localhost:6105/zone/queries',
    zoneCmdHost: 'http://localhost:6105/zone/commands',

    // pointageBioTimeHost: 'http://102.50.254.72:8010',

    deviceQueryHost: 'http://localhost:6109/device/queries',
    deviceCmdHost: 'http://localhost:6109/device/commands',

    pointageQueryHost: 'http://localhost:6109/pointage/queries',
    pointageCmdHost: 'http://localhost:6109/pointage/commands',

    notifCmdHost: 'http://localhost:6106/notif/commands',
    notifQueryHost: 'http://localhost:6106/notif/queries',

    logCmdHost: 'http://localhost:6106/log/commands',
    logQueryHost: 'http://localhost:6106/log/queries',

    storageCmdHost: 'http://localhost:6107/fileData/commands',
    storageQueryHost: 'http://localhost:6107/fileData/queries',

    driveCmdHost: 'http://localhost:6107/drive/commands',
    driveQueryHost: 'http://localhost:6107/drive/queries',

    // chatHost: 'http://localhost:6111/sr-chat',

    unreachableHost: 'http://localhost:9100',

    authHost: 'http://localhost:6108',
    authCmdHost: 'http://localhost:6108/jwt/commands',
    authQueryHost: 'http://localhost:6108/jwt/queries',

// Logistique

    // affaireapi: "http://localhost:6201/affaireapi",
    chauffeurapi: 'http://localhost:6201/chauffeurapi',
    fournisseurapi: 'http://localhost:6201/fournisseurapi',
    frommvtapi: 'http://localhost:6201/frommvtapi',
    tripimpapi: 'http://localhost:6201/tripimpapi',
    vhgpsapi: 'http://localhost:6201/vhgpsapi',
    vhrouteapi: 'http://localhost:6201/vhrouteapi',
    // soustraitantapi:"http://localhost:6201/soustraitantapi",
    // lotApi:"http://localhost:6201/lotApi",
    clientApi: 'http://localhost:6201/clientApi',

    // Part Engin
    enginRteapi: 'http://localhost:6203/EnginRteapi',
    enginGpsapi: 'http://localhost:6203/EnginGpsapi',
    chauffeurEnginapi: 'http://localhost:6203/chauffeurEnginapi',
    enginimpapi: 'http://localhost:6203/Enginimpapi',
    // part Location
    locationapi: 'http://localhost:6204/locationinvoiceapi',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
