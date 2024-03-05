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


    getRolePermissions: async (id: any) => {
      try {
    
        const response = await handleRequest(`${ROLES_URL}/${id}/permissions`, {
          method: "GET",
        });
  
        if (!response.ok) {
          let errorMessage = `Bad Request: ${response.statusText}`;
  
            const data = await response.json();
            errorMessage = data.error || errorMessage;
  
          return { success: false, error: errorMessage };
        }
  
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        console.error("Error in getting inventory:", error);
        return { success: false, error: "Unexpected error occurred" };
      }
    },

    assignRevokePermissions: async (roleData: any) => {
      try {
    
        const response = await handleRequest(`${ROLES_URL}/${roleData.id}/assign-revoke-permissions`, {
          method: "POST",
          body: JSON.stringify(roleData),
        });
  
        if (!response.ok) {
          let errorMessage = `Bad Request: ${response.statusText}`;
  
            const data = await response.json();
            errorMessage = data.error || errorMessage;
  
          return { success: false, error: errorMessage };
        }
  
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        console.error("Error in getting inventory:", error);
        return { success: false, error: "Unexpected error occurred" };
      }
    },

    deleteRole: async (id: string) => {
      try {
        const response = await handleRequest(`${ROLES_URL}/${id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          let errorMessage = `Bad Request: ${response.statusText}`;
  
            const data = await response.json();
            errorMessage = data.error || errorMessage;
  
          return { success: false, error: errorMessage };
        }
  
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        console.error("Error in deleteProduct service:", error);
        return { success: false, error: "Unexpected error occurred" };
      }
  },

  updateRole: async (roleData: any) => {
    const response = await handleRequest(`${ROLES_URL}/${roleData.id}`, {
      method: "PUT",
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      let errorMessage = `Bad Request: ${response.statusText}`;

        const data = await response.json();
        errorMessage = data.error || errorMessage;

      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return { success: true, data };
  },

  createRole: async (roleData: any) => {
    const response = await handleRequest(ROLES_URL, {
      method: "POST",
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      let errorMessage = `Bad Request: ${response.statusText}`;

        const data = await response.json();
        errorMessage = data.error || errorMessage;

      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return { success: true, data };
  },

}