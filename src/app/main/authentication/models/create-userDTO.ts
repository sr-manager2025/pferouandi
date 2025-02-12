export class CreateUserDTO {
    public username: string;
    public password: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public avatar: string;
    public roles: string[] = [];

    constructor(username: string,
                password: string,
                firstName: string,
                lastName: string,
                email: string,
                avatar: string,
                roles: string[]) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.avatar = avatar;
        this.roles = roles;
    }
}
