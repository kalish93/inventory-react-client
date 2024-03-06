import { BANK_POSITIONS_URL, EXPENSES_URL } from "../../core/api-routes";
import { handleRequest } from "../../utils/apiService";

export const DashboardService = {
    getExpenses: async (startDate?: any, endDate?:any) => {
      try {
        let url = EXPENSES_URL;
  
        if (startDate && endDate) {
          url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        const response = await handleRequest(url, {
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
          console.error("Error in get expenses service:", error);
          return { success: false, error: "Unexpected error occurred" };
        }
      },

    getBankPositions: async () => {
      try {
        let url = BANK_POSITIONS_URL;

        const response = await handleRequest(url, {
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
          console.error("Error in get expenses service:", error);
          return { success: false, error: "Unexpected error occurred" };
        }
      },
    }