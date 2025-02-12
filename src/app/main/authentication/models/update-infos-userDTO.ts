
export class UpdateInfosUserDTO {
    public username: string;
    public avatar: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public roles: string[] = [];
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;


    constructor(username: string,
                avatar: string,
                firstName: string,
                lastName: string,
                email: string,
                roles: string[], accountNonLocked: boolean,
                accountNonExpired: boolean, credentialsNonExpired: boolean) {
        this.username = username;
        this.avatar = avatar;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;
        this.accountNonLocked = accountNonLocked;
        this.accountNonExpired = accountNonExpired;
        this.credentialsNonExpired = credentialsNonExpired;
    }
}
