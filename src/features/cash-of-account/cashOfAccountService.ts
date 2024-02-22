import { CA_URL } from "../../core/api-routes";

const accessToken = localStorage.getItem('accessToken');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

export const CashOfAccountService = {
    getCAs: async (page?: any, pageSize?: any) => {
      try {
        let url = CA_URL;
  
        if (page && pageSize) {
          url += `?page=${page}&pageSize=${pageSize}`;
        }
          const response = await fetch(url, {
            method: 'GET',
            headers: headers,
          });
    
          if (!response.ok) {
            throw new Error('Error retrieving users');
          }
    
          const data = await response.json();
          return data;
        
        } catch (error) {
          console.error('Error in CA service:', error);
          throw error;
        }
      },

      creataCA: async (day: any) => {
        try {
          const response = await fetch(CA_URL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(day),
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
          console.error("Error in creating CA service:", error);
          return { success: false, error: "Unexpected error occurred" };
        }
      },
}