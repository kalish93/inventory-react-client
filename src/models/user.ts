export interface CreateUser {
    userName: string;
    password: string;
    passwordConfirmation: string;
    roleId?: number;
}

export interface User{
    id?: string;
    userName: string;
    roleId?: string;
    role: any;
}