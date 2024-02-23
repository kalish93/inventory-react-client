import { CUSTOMERS_URL } from "../../core/api-routes";
import { CreateCustomer } from "../../models/customer";

const accessToken = localStorage.getItem('accessToken');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

export const CustomerService = {
    getCustomers: async (page?: any, pageSize?: any) => {
      try {
        let url = CUSTOMERS_URL;
  
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
          console.error('Error in getCustomers service:', error);
          throw error;
        }
      },

      registerCustomer: async (customerData: CreateCustomer) => {
        const response = await fetch(CUSTOMERS_URL, {
          method: 'POST',
          headers: headers,
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
  