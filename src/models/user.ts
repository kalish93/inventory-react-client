export interface CreateUser {
    id?: string;
    userName: string;
    password: string;
    confirmPassword: string;
    roleId: string;
}

export interface User{
    id?: string;
    userName: string;
    roleId: string;
}