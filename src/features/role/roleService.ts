import { ROLES_URL } from "../../core/api-routes";

const accessToken = localStorage.getItem('accessToken');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

export const RoleService = {
    getRoles: async () => {
      const response = await fetch(ROLES_URL, {
        method: 'GET',
        headers: headers,
      });
  
      if (!response.ok) {
        throw new Error('role fetch failed');
      }
  
      const data = await response.json();
      return data;
    },
}