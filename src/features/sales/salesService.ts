import {
  CATRANSACTIONS_URL,
  SALES_URL,
  SALE_DETAIL_URL,
} from "../../core/api-routes";
import { CreateSales } from "../../models/sales";
import { handleRequest } from "../../utils/apiService";

export const SalesService = {
  getSales: async (page?: number, pageSize?: number) => {
    try {
      const url =
        page && pageSize
          ? `${SALES_URL}?page=${page}&pageSize=${pageSize}`
          : SALES_URL;
      const response = await handleRequest(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error retrieving users");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in getUsers service:", error);
      throw error;
    }
  },

  registerSale: async (salesData: CreateSales) => {
    try {
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

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error in deleteSale service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  updateSale: async (saleId: string, saleData: any) => {
    try {
      const url = `${SALES_URL}/${saleId}`;
      const response = await handleRequest(url, {
        method: "PUT",
        body: JSON.stringify(saleData),
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
      console.error("Error in update sale service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  updateSaleDetail: async (saleDetail: any) => {
    try {
      const response = await handleRequest(
        `${SALE_DETAIL_URL}/${saleDetail.id}`,
        {
          method: "PUT",
          body: JSON.stringify(saleDetail),
        }
      );

      if (!response.ok) {
        let errorMessage = `Bad Request: ${response.statusText}`;

        const data = await response.json();
        errorMessage = data.error || errorMessage;

        return { success: false, error: errorMessage };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error in update sale detail service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  deleteSaleDetail: async (id: any) => {
    try {
      const response = await handleRequest(`${SALE_DETAIL_URL}/${id}`, {
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
      console.error("Error in delete sale detail service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  createSaleDetail: async (sale: any) => {
    try {
      const response = await handleRequest(SALE_DETAIL_URL, {
        method: "POST",
        body: JSON.stringify(sale),
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
      console.error("Error in create sale detail service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

      createCustomerPayment: async (payment: any) => {
        try{
          const response = await handleRequest(`${CATRANSACTIONS_URL}/customer-payment`, {
            method: "POST",
            body: JSON.stringify(payment),
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
        console.error("Error in create customer payment service:", error);
        return { success: false, error: "Unexpected error occurred" };
      }
      },
      getInvoiceNumber: async () => {
        try {
          const response = await handleRequest(`${SALES_URL}/invoice-number/latest`, {
            method: "GET",
          });
    
          if (!response.ok) {
            throw new Error('Error retrieving retrieving invoice number');
          }
          const data = await response.json();
          return data;
        
        } catch (error) {
          console.error('Error in getInvoiceNumber service:', error);
          throw error;
        }
      },
};
