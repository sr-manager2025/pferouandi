export class CreateAppRoleDto {
    username: string;
    roleName: string;


    constructor(username: string, roleName: string) {
        this.username = username;
        this.roleName = roleName;
    }
}
