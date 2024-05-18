import { CreateCATransaction } from "../../models/ca-transaction";
import { handleRequest } from "../../utils/apiService";
import {
  BASE_URL,
  CATRANSACTIONS_URL,
  JOURNAL_ENTRY_URL,
} from "../../core/api-routes";

export const CATransactionService = {
  getCATransactions: async (page?: number | undefined, pageSize?: number | undefined) => {
    try {
      const url =
        page && pageSize
          ? `${CATRANSACTIONS_URL}?page=${page}&pageSize=${pageSize}`
          : CATRANSACTIONS_URL;
      const response = await handleRequest(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error retrieving CA Transactions");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in getCATransactions service:", error);
      throw error;
    }
  },

  getTransactionsByMonth: async (month: number, year: number) => {
    try {
      const response = await handleRequest(
        `${CATRANSACTIONS_URL}-summary?month=${month}&year=${year}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Error retrieving CA Transactions");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in getTransactionsByMonth service:", error);
      throw error;
    }
  },
  registerCATransactions: async (CATransactionData: CreateCATransaction) => {
    try {
      const response = await handleRequest(CATRANSACTIONS_URL, {
        method: "POST",
        body: JSON.stringify(CATransactionData),
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
      console.error("Error in registerCATransactions service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  createTransitPayments: async (transitPaymentData: any) => {
    try {
      const response = await handleRequest(
        `${CATRANSACTIONS_URL}/transit-payment`,
        {
          method: "POST",
          body: JSON.stringify(transitPaymentData),
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
      console.error("Error in createTransitPayments service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  registerJournalEntry: async (CATransactionData: any) => {
    try {
      const response = await handleRequest(JOURNAL_ENTRY_URL, {
        method: "POST",
        body: JSON.stringify(CATransactionData),
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
      console.error("Error in registerCATransactions service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  registerMonthlyJournalEntry: async (CATransactionData: any) => {
    try {
      const response = await handleRequest(`${JOURNAL_ENTRY_URL}/montly-summary`, {
        method: "POST",
        body: JSON.stringify(CATransactionData),
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
      console.error("Error in registerMonthlyJournalEntry service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  deleteMonthlyJournalEntry: async (id: any) => {
    try {
      const response = await handleRequest(`${JOURNAL_ENTRY_URL}/montly-summary/${id}`, {
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
      console.error("Error in deleteMonthlyJournalEntry service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  deleteJournalEntry: async (id: any) => {
    const response = await handleRequest(`${JOURNAL_ENTRY_URL}/${id}`, {
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
  },

  deleteCaTransaction: async (id: any) => {
    const response = await handleRequest(`${CATRANSACTIONS_URL}/${id}`, {
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
  },

  createExpensesPayment: async (expensesData: any) => {
    const response = await handleRequest(
      `${CATRANSACTIONS_URL}/expenses-payment`,
      {
        method: "POST",
        body: JSON.stringify(expensesData),
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
  },

  deleteExpensesPayment: async (id: any) => {
    const response = await handleRequest(
      `${CATRANSACTIONS_URL}/expenses-payment/${id}`,
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
  },
};
