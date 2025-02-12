import {AppRole} from './app-role';

export class AppUser {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatar: string;
    role: String;
    token: string;
    accessToken: string;
    refreshToken: string;
    roles: string[] = [];
    appRoles: AppRole[] = [];

    accountNonLocked: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;

    actived: boolean;
    enabled: true;
    oldPassword: string;

    date: Date;
    workingDays: string;
    sessionExpired: boolean;

}
