import { SALES_URL } from "../../core/api-routes";
import { CreateSales } from "../../models/sales";
import { handleRequest } from "../../utils/apiService";

export const SalesService = {
    getSales: async (page = 1, pageSize = 10) => {
        try {
          const response = await handleRequest(`${SALES_URL}?page=${page}&pageSize=${pageSize}`, {
            method: "GET",
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
        try{ 

          const response = await handleRequest(SALES_URL, {
            method: "POST",
            body: JSON.stringify(salesData),
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
        console.error("Error in registerdriver service:", error);
        return { success: false, error: "Unexpected error occurred" };
      }
    },
      getSaleById: async (saleId: string) => {
        try {
          const url = `${SALES_URL}/${saleId}`;

          const response = await handleRequest(url, {
            method: "GET",
          });
    
          if (!response.ok) {
            throw new Error("Error retrieving sale by ID");
          }
    
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error :", error);
          throw error;
        }
      },

      deleteSale: async (saleId: string) => {
        try {
          const url = `${SALES_URL}/${saleId}`;
          const response = await handleRequest(url, {
            method: "DELETE",
          });
    
          if (!response.ok) {
            let errorMessage = `Bad Request: ${response.statusText}`;
    
            const data = await response.json();
            errorMessage = data.error || errorMessage;
    
            return { success: false, error: errorMessage };
          }
    
          return { success: true };
        } catch (error) {
          console.error("Error in deleteSale service:", error);
          return { success: false, error: "Unexpected error occurred" };
        }
      }
};