import { jwtDecode } from "jwt-decode";
import { IS_DEVELOPMENT_MODE } from "../core/api-routes";

export const hasPermission = (requiredPermission: any) => {
    if(!localStorage.getItem("accessToken")){
        return;
    }
    const decodedToken = jwtDecode(localStorage.getItem("accessToken") as string) as any;
    const isAuthenticated = !!decodedToken;
    if(isAuthenticated){
    const userPermissions = decodedToken.permissions;
    if(IS_DEVELOPMENT_MODE){
        return true;
    }
    return userPermissions.includes(requiredPermission);
    }
    return false;
};