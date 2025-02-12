import {NotifReadStatus} from './notif-read-status';
import {NotifImportanceLevel} from './notif-importance-level';
import {TypeRole} from '../../../../main/authentication/models/type-role';
import {NotifAction} from './notif-action';

export class SrNotification {

    public id: number;
    public numero: number;
    public mois: number;
    public annee: number;
    public dateCreation: Date;
    public timeCreation: Date;

    public destinationId: number;
    public destinationUsername: string;
    public destinationRole: string;
    public destinationFullName: string;

    public sourceId: number;
    public sourceUsername: string;
    public sourceFullName: string;
    public sourceRole: string;

    public typeRole: TypeRole;
    public marcheId: number;
    public marcheCode: string;

    public icon: string;
    public heading: string;
    public message: string;

    public notifReadStatus: NotifReadStatus;
    public notifImportanceLevel: NotifImportanceLevel;


    public notifAction: NotifAction ;
    public url: string;
    public route: string;
}
