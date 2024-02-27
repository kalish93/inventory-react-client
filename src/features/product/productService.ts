import { PRODUCTS_URL } from "../../core/api-routes";
import { CreateProduct } from "../../models/product";
import { handleRequest } from "../../utils/apiService";

export const ProductService = {
  getProducts: async (page = 1, pageSize = 10) => {
    try {
        const url = page && pageSize
            ? `${PRODUCTS_URL}?page=${page}&pageSize=${pageSize}`
            : PRODUCTS_URL;

        const response = await handleRequest(url, {
              method: "GET",
            });

        if (!response.ok) {
            throw new Error('Error retrieving products');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error in getProducts service:', error);
        throw error;
    }
},
      registerProduct: async (ProductData: CreateProduct) => {
        try{
          const response = await handleRequest(PRODUCTS_URL, {
            method: "POST",
            body: JSON.stringify(ProductData),

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

    deleteProduct: async (id: string) => {
      try {
        const response = await handleRequest(`${PRODUCTS_URL}/${id}`, {
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
        console.error("Error in deleteProduct service:", error);
        return { success: false, error: "Unexpected error occurred" };
      }
  },
};
  