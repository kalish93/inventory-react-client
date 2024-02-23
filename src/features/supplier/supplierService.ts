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
        try{
        const response = await fetch(SUPPLIERS_URL, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(SupplierData),
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
        console.error("Error in registerStore service:", error);
        return { success: false, error: "Unexpected error occurred" };
      }
    },
  
};
  