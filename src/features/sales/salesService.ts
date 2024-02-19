import { SALES_URL } from "../../core/api-routes";
import { CreateSales } from "../../models/sales";


const accessToken = localStorage.getItem('accessToken');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

export const SalesService = {
    getSales: async (page = 1, pageSize = 10) => {
        try {
          const response = await fetch(`${SALES_URL}?page=${page}&pageSize=${pageSize}`, {
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

      registerSale: async (salesData: CreateSales) => {
        const response = await fetch(SALES_URL, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(salesData),
        });
    
        if (!response.ok) {
          throw new Error('Sales creation failed');
        }
    
        const data = await response.json();
        return data;
      },
  
};