import { PRODUCTS_URL, PRODUCT_CATEGORIES_URL } from "../../core/api-routes";
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


  updateProduct: async (productData: any) => {
    try{
      const response = await handleRequest(`${PRODUCTS_URL}/${productData.id}`, {
        method: "PUT",
        body: JSON.stringify(productData),

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


  getProductCategories: async () => {
    try {
        const response = await handleRequest(PRODUCT_CATEGORIES_URL, {
              method: "GET",
            });

        if (!response.ok) {
            throw new Error('Error retrieving products');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error in get product categories service:', error);
        throw error;
    }
},
      registerProductCategories: async (productCategoryData: CreateProduct) => {
        try{
          const response = await handleRequest(PRODUCT_CATEGORIES_URL, {
            method: "POST",
            body: JSON.stringify(productCategoryData),

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
        console.error("Error in create product categories service:", error);
        return { success: false, error: "Unexpected error occurred" };
      }
    },

  updateProductCategory: async (productCategoryData: any) => {
    try{
      const response = await handleRequest(`${PRODUCT_CATEGORIES_URL}/${productCategoryData.id}`, {
        method: "PUT",
        body: JSON.stringify(productCategoryData),

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
    console.error("Error in update product categories service:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
},

deleteProductCategory: async (id: string) => {
  try {
    const response = await handleRequest(`${PRODUCT_CATEGORIES_URL}/${id}`, {
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
    console.error("Error in delete product category service:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
},


};
  