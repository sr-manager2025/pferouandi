import {Time} from '@angular/common';

export class SrLog {
    public id: number;
    public projetName: string;
    public apiUrl: string;
    public classeName: string;
    public objectId: number;
    public event: string;

    public dateCreation: Date;
    public timeCreation: Time;

    public userId: number;
    public username: string;
    public firstName: string;
    public lastName: string;
    public fullName: string;
}
