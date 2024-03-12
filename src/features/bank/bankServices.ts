import { handleRequest } from "../../utils/apiService";
import { BANK_URL } from "../../core/api-routes";
import { CreateBank, Bank } from "../../models/bank";

export const bankService = {
  getBanks: async (page = 1, pageSize = 10) => {
    try {
      const response = await handleRequest(
        `${BANK_URL}?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get banks");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
  createBank: async (bankData: CreateBank) => {
    try {
      const response = await handleRequest(BANK_URL, {
        method: "POST",
        body: JSON.stringify(bankData),
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
      console.error("Error in registerBank service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  updateBank: async (bankData: Bank) => {
    try {
      const response = await handleRequest(`${BANK_URL}/${bankData.id}`, {
        method: "PUT",
        body: JSON.stringify(bankData),
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
      console.error("Error in updateBank service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
  deleteBank: async (bankId: String) => {
    try {
      const response = await handleRequest(`${BANK_URL}/${bankId}`, {
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
      console.error("Error in deleteBank service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
  getBank: async (bankId: String) => {
    try {
      const response = await handleRequest(`${BANK_URL}/${bankId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to get bank");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};
