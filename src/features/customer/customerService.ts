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
          console.error('Error in getUsers service:', error);
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
          throw new Error('customer creation failed');
        }
    
        const data = await response.json();
        return data;
      },
  
};
  