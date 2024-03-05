import { PERMISSIONS_URL } from "../../core/api-routes";
import { handleRequest } from "../../utils/apiService";

export const PermissionService = {

  getPermissions: async () => {
    try {
  
      const response = await handleRequest(PERMISSIONS_URL, {
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
};