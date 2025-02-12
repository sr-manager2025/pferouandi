export class UpdatePwdUserRequestDTO {
    public username: string ;
    public oldPassword: string ;
    public newPassword: string ;


    constructor(username: string, oldPassword: string, newPassword: string) {
        this.username = username;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }
}
