import { CUSTOMERS_URL } from "../../core/api-routes";
import { CreateCustomer } from "../../models/customer";
import { handleRequest } from "../../utils/apiService";

export const CustomerService = {
    getCustomers: async (page?: any, pageSize?: any) => {
      try {
        let url = CUSTOMERS_URL;
  
        if (page && pageSize) {
          url += `?page=${page}&pageSize=${pageSize}`;
        }
        const response = await handleRequest(url, {
          method: "GET",
        });
    
          if (!response.ok) {
            throw new Error('Error retrieving users');
          }
    
          const data = await response.json();
          return data;
        
        } catch (error) {
          console.error('Error in getCustomers service:', error);
          throw error;
        }
      },

      registerCustomer: async (customerData: CreateCustomer) => {
        const response = await handleRequest(CUSTOMERS_URL, {
          method: "POST",
          body: JSON.stringify(customerData),
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
  
};
  