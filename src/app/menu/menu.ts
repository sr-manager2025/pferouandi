import {CoreMenu} from '@core/types';
import {Role} from '../main/authentication/models/role';

// ? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

// @ts-ignore
export const menu: CoreMenu[] = [

    {
        id: 'srbo',
        type: 'section',
        title: 'Bureau D\'ordre',
        translate: 'MENU.BO.SECTION',
        roles: [Role.ADMIN],
        icon: 'package',
        children: [
            {
                id: 'Entree',
                title: 'Entree',
                translate: 'MENU.BO.ENTREE',
                type: 'item',
                icon: 'slack',
                roles: [Role.ADMIN],
                url: 'projets/srbo/entree-add',
            },
            {
                id: 'Sortie',
                title: 'Sortie',
                translate: 'MENU.BO.SORTIE',
                type: 'item',
                icon: 'slack',
                roles: [Role.ADMIN],
                url: 'projets/logistique/enginChantier/recap',
            }
        ]
    },
    {
        id: 'caution',
        type: 'section',
        title: 'Caution',
        translate: 'MENU.CAUTION.SECTION',
        roles: [Role.ADMIN],
        icon: 'package',
        children: [
            {
                id: 'lc',
                title: 'Ligne Caution',
                translate: 'MENU.CAUTION.LC',
                type: 'item',
                icon: 'slack',
                roles: [Role.ADMIN],
                url: 'projets/caution/caution-add',
            },
        ]
    },
    {
        id: 'rh',
        type: 'section',
        title: 'rh',
        translate: 'MENU.RH.SECTION',
        roles: [Role.ADMIN],
        icon: 'package',
        children: [
            {
                id: 'admin',
                title: 'Administration',
                translate: 'MENU.RH.ADMIN',
                type: 'item',
                icon: 'slack',
                roles: [Role.ADMIN],
                url: 'projets/rh/employee-add',
            },
        ]
    }



];
