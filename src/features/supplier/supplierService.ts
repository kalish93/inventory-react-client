import { SUPPLIERS_URL } from "../../core/api-routes";
import { CreateSupplier } from "../../models/supplier";

const accessToken = localStorage.getItem('accessToken');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

export const SupplierService = {
    getSuppliers: async (page = 1, pageSize = 10) => {
        try {
          const response = await fetch(`${SUPPLIERS_URL}?page=${page}&pageSize=${pageSize}`, {
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

      registerSupplier: async (SupplierData: CreateSupplier) => {
        const response = await fetch(SUPPLIERS_URL, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(SupplierData),
        });
    
        console.log(SupplierData,'yyyyyyyyyyyyyyyyyyyyy')
        if (!response.ok) {
          throw new Error('Supplier creation failed');
        }
    
        const data = await response.json();
        return data;
      },
  
};
  