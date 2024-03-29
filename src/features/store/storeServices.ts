import { STORE_URL } from '../../core/api-routes';
import { CreateStore, Store } from '../../models/store';
import { handleRequest } from '../../utils/apiService';

export const storeService = {
    getStores: async (page=1, pageSize=10) => {
        try {
            const response = await handleRequest(`${STORE_URL}?page=${page}&pageSize=${pageSize}`, {
                method: "GET",
              });

            if (!response.ok) {
                throw new Error('Failed to get stores');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },

    createStore: async (storeData: CreateStore) => {
        try {
            const response = await handleRequest(STORE_URL, {
                method: "POST",
                body: JSON.stringify(storeData),
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

    updateStore: async (storeData: Store) => {
        try {
            const response = await handleRequest(`${STORE_URL}/${storeData.id}`, {
                method: "PUT",
                body: JSON.stringify(storeData),
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

    deleteStore: async (storeId: string) => {
        try {
            const response = await handleRequest(`${STORE_URL}/${storeId}`, {
                method: "DELETE",
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
              console.error("Error in deleteStore service:", error);
              return { success: false, error: "Unexpected error occurred" };
            }
    },

    getStore: async (storeId: string) => {
        try {
            const response = await handleRequest(`${STORE_URL}/${storeId}`, {
                method: "GET",
              });

            if (!response.ok) {
                throw new Error('Failed to get store');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

};