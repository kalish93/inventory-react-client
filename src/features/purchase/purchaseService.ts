import { PURCHASES_URL } from "../../core/api-routes";
import { CreatePurchase } from "../../models/purchase";
import { handleRequest } from "../../utils/apiService";

export const PurchaseService = {
    getPurchases: async (page = 1, pageSize = 10) => {
        try {
          const response = await handleRequest(`${PURCHASES_URL}?page=${page}&pageSize=${pageSize}`, {
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

      registerPurchase: async (PurchaseData: CreatePurchase) => {
        try{
        const response = await handleRequest(PURCHASES_URL, {
          method: "POST",
          body: JSON.stringify(PurchaseData),
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
    
      getPurchaseById: async (purchaseId: string) => {
        try {
          const url = `${PURCHASES_URL}/${purchaseId}`;
          
          const response = await handleRequest(url, {
            method: "GET",
          });
    
          if (!response.ok) {
            throw new Error("Error retrieving purchase by ID");
          }
    
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error :", error);
          throw error;
        }
      },

      deletePurchase: async (purchaseId: string) => {
        try {
          const url = `${PURCHASES_URL}/${purchaseId}`;
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
          console.error("Error in deletePurchase service:", error);
          return { success: false, error: "Unexpected error occurred" };
        }
      },
};
  