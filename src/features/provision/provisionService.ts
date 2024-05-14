import { PROVISIONS_URL } from "../../core/api-routes";
import { handleRequest } from "../../utils/apiService";

export const ProvisionService = {
  getProvisions: async (page = 1, pageSize = 10) => {
    try {
      const url =
        page && pageSize
          ? `${PROVISIONS_URL}?page=${page}&pageSize=${pageSize}`
          : PROVISIONS_URL;

      const response = await handleRequest(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error retrieving provisions");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in getProvisions service:", error);
      throw error;
    }
  },
  getMonthlyProvisions: async (month: number, year: number) => {
    try {
      const url = `${PROVISIONS_URL}-summary?month=${month}&year=${year}`;

      const response = await handleRequest(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error retrieving monthly provisions");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in getMonthlyProvisions service:", error);
      throw error;
    }
  },
};
