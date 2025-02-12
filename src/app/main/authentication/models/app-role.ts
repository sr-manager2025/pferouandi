import {TypeRole} from './type-role';

export class AppRole {
    public id: number;
    public roleName: string;
    public typeRole: TypeRole;


    constructor(roleName: string, typeRole: TypeRole) {
        this.id = null;
        this.roleName = roleName;
        this.typeRole = typeRole;
    }
}
