import { ROLES_URL } from "../../core/api-routes";
import { handleRequest } from "../../utils/apiService";

export const RoleService = {
    getRoles: async () => {
      const response = await handleRequest(ROLES_URL, {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error('role fetch failed');
      }
  
      const data = await response.json();
      return data;
    },
}