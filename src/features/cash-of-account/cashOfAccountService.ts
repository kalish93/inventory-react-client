import { CA_URL } from "../../core/api-routes";
import { handleRequest } from "../../utils/apiService";

export const CashOfAccountService = {
  getCAs: async (page?: any, pageSize?: any) => {
    try {
      let url = CA_URL;

      if (page && pageSize) {
        url += `?page=${page}&pageSize=${pageSize}`;
      }
      const response = await handleRequest(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error retrieving users");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in CA service:", error);
      throw error;
    }
  },

  getCABanks: async () => {
    try {
      const response = await handleRequest(`${CA_URL}/banks`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error retrieving CA Banks");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in CA service:", error);
      throw error;
    }
  },

  getCAExpenses: async () => {
    try {
      const response = await handleRequest(`${CA_URL}/expenses`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error retrieving CA Expenses");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in CA service:", error);
      throw error;
    }
  },

  creataCA: async (createCA: any) => {
    try {
      const response = await handleRequest(CA_URL, {
        method: "POST",
        body: JSON.stringify(createCA),
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
      console.error("Error in creating CA service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
};
