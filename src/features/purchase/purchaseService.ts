import { create } from "@mui/material/styles/createTransitions";
import {
  ESL_URL,
  PURCHASES_URL,
  TRANSIT_FEES_URL,
  TRANSPORT_URL,
  CATRANSACTIONS_URL,
} from "../../core/api-routes";
import { CreatePurchase } from "../../models/purchase";
import { handleRequest } from "../../utils/apiService";

export const PurchaseService = {
  getPurchases: async (
    page: number | undefined,
    pageSize: number | undefined
  ) => {
    try {
      const url =
        page && pageSize
          ? `${PURCHASES_URL}?page=${page}&pageSize=${pageSize}`
          : PURCHASES_URL;
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

  registerPurchase: async (PurchaseData: CreatePurchase) => {
    try {
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

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error in deletePurchase service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  updatePurchase: async (purchaseId: string, purchaseData: any) => {
    try {
      const url = `${PURCHASES_URL}/${purchaseId}`;
      const response = await handleRequest(url, {
        method: "PUT",
        body: JSON.stringify(purchaseData),
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
      console.error("Error in updatePurchase service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  getTransportcosts: async (page = 1, pageSize = 10) => {
    try {
      const response = await handleRequest(
        `${TRANSPORT_URL}?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
        }
      );

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

  createTransportCost: async (transportInfo: any) => {
    try {
      const response = await handleRequest(
        `${PURCHASES_URL}/transport-payment`,
        {
          method: "POST",
          body: JSON.stringify(transportInfo),
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
      console.error("Error in createTransportCost service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  getEslCustomCosts: async (page = 1, pageSize = 10) => {
    try {
      const response = await handleRequest(
        `${ESL_URL}?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
        }
      );

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

  createEslCustomCost: async (eslInfo: any) => {
    try {
      const response = await handleRequest(`${PURCHASES_URL}/esl-payment`, {
        method: "POST",
        body: JSON.stringify(eslInfo),
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
      console.error("Error creating esl custom cost: ", error);
      throw error;
    }
  },

  createESLPayment: async (eslPaymentData: any) => {
    try {
      const response = await handleRequest(
        `${CATRANSACTIONS_URL}/esl-payment`,
        {
          method: "POST",
          body: JSON.stringify(eslPaymentData),
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
      console.error("Error in createESLPayment service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  getTransitFees: async (page = 1, pageSize = 10) => {
    try {
      const response = await handleRequest(
        `${TRANSIT_FEES_URL}?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
        }
      );

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

  createTransitFee: async (transitInfo: any) => {
    try {
      const response = await handleRequest(`${PURCHASES_URL}/transit-fee`, {
        method: "POST",
        body: JSON.stringify(transitInfo),
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
      console.error("Error creating transit fee: ", error);
      throw error;
    }
  },

  createSupplierPayment: async (purchaseInfo: any) => {
    try {
      const response = await handleRequest(
        `${CATRANSACTIONS_URL}/supplier-payment`,
        {
          method: "POST",
          body: JSON.stringify(purchaseInfo),
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
      console.error("Error in createSupplierPayment service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  deleteTransportCost: async (id: any) => {
    try {
      const response = await handleRequest(
        `${PURCHASES_URL}/transport-payment/${id}`,
        {
          method: "DELETE",
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
      console.error("Error in deleteTransportCost service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  deleteTransitPayment: async (id: any) => {
    try {
      const response = await handleRequest(
        `${PURCHASES_URL}/transit-payment/${id}`,
        {
          method: "DELETE",
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
      console.error("Error in createSupplierPayment service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
  deleteEslPayment: async (id: any) => {
    try {
      const response = await handleRequest(
        `${CATRANSACTIONS_URL}/esl-payment/${id}`,
        {
          method: "DELETE",
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
      console.error("Error in createSupplierPayment service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
  getWaybillNumber: async () => {
    try {
      const response = await handleRequest(`${PURCHASES_URL}/waybill-number/latest`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error('Error retrieving retrieving waybill number');
      }
      const data = await response.json();
      return data;
    
    } catch (error) {
      console.error('Error in getWaybillNumber service:', error);
      throw error;
    }
  },

};
