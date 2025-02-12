import {NotifImportanceLevel} from './notif-importance-level';
import {TypeRole} from '../../../../main/authentication/models/type-role';

export class CreateNotifRequestDTO {
    public role: string;
    public typeRole: TypeRole;
    public champImputationId: number;
    public userSourceId: number;
    public icon: string;
    public heading: string;
    public message: string;
    public url: string;
    public notifImportanceLevel: NotifImportanceLevel ;


    constructor(role: string,
                typeRole: TypeRole,
                champImputationId: number,
                userSourceId: number,
                icon: string,
                heading: string,
                message: string,
                url: string,
                notifImportanceLevel: NotifImportanceLevel) {
        this.role = role;
        this.typeRole = typeRole;
        this.champImputationId = champImputationId;
        this.userSourceId = userSourceId;
        this.icon = icon;
        this.heading = heading;
        this.message = message;
        this.url = url;
        this.notifImportanceLevel = notifImportanceLevel;
    }
}
