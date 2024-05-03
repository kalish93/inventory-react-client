import { BASE_URL } from "../../core/api-routes";


export const ReportService = {

getCustomerAgingReport: async (endDate?: any) => {
    try {
        let url = `${BASE_URL}/customer-aging-report`
        if(endDate){
            url += `?endDate=${endDate}`
        }
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/pdf", // Set Accept header for PDF response
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!response.ok) {
        let errorMessage = `Bad Request: ${response.statusText}`;
        const data = await response.json();
        errorMessage = data.error || errorMessage;
        return { success: false, error: errorMessage };
      }
  
      // Return the response blob directly
      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error("Error in createSupplierPayment service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

getBankTransactionReport: async (selectedBank: any, startDate?: any, endDate?: any) => {
    try {
        let url = `${BASE_URL}/bank-transaction-report?bankId=${selectedBank}`
        if(startDate && endDate){
            url += `&startDate=${startDate}&endDate=${endDate}`
        }
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/pdf", // Set Accept header for PDF response
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!response.ok) {
        let errorMessage = `Bad Request: ${response.statusText}`;
        const data = await response.json();
        errorMessage = data.error || errorMessage;
        return { success: false, error: errorMessage };
      }
  
      // Return the response blob directly
      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error("Error in createSupplierPayment service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  getApAgingReport: async (endDate?: any) => {
    try {
        let url = `${BASE_URL}/ap-aging-report`
        if(endDate){
            url += `?endDate=${endDate}`
        }
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/pdf", // Set Accept header for PDF response
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!response.ok) {
        let errorMessage = `Bad Request: ${response.statusText}`;
        const data = await response.json();
        errorMessage = data.error || errorMessage;
        return { success: false, error: errorMessage };
      }
  
      // Return the response blob directly
      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error("Error in createSupplierPayment service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
  getTransactionListWithSplitsReport: async (startDate?:Date, endDate?:Date) => {
    try {
        let url = `${BASE_URL}/transaction-with-split-report`
        if(startDate && endDate){
          url += `?startDate=${startDate}&endDate=${endDate}`
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/pdf", // Set Accept header for PDF response
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!response.ok) {
        let errorMessage = `Bad Request: ${response.statusText}`;
        const data = await response.json();
        errorMessage = data.error || errorMessage;
        return { success: false, error: errorMessage };
      }
  
      // Return the response blob directly
      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error("Error in generating transaction with list report :", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
  getTrialBalanceReport: async (startDate?:Date, endDate?:Date) => {
    try {
        let url = `${BASE_URL}/trial-balance-report`
        if(startDate && endDate){
          url += `?startDate=${startDate}&endDate=${endDate}`
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/pdf", // Set Accept header for PDF response
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!response.ok) {
        let errorMessage = `Bad Request: ${response.statusText}`;
        const data = await response.json();
        errorMessage = data.error || errorMessage;
        return { success: false, error: errorMessage };
      }
  
      // Return the response blob directly
      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error("Error in generating trial balance report:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  getInventoryValuationReport: async (endDate?:Date) => {
    try {
        let url = `${BASE_URL}/inventory-valuation`
        if(endDate){
          url += `?endDate=${endDate}`
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/pdf", // Set Accept header for PDF response
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!response.ok) {
        let errorMessage = `Bad Request: ${response.statusText}`;
        const data = await response.json();
        errorMessage = data.error || errorMessage;
        return { success: false, error: errorMessage };
      }
  
      // Return the response blob directly
      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error("Error in generating inventory valuation report:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
  getProfitAndLossReport: async (startDate?: any, endDate?: any) => {
    try {
        let url = `${BASE_URL}/profit-and-loss-report?`
        if(startDate && endDate){
            url += `&startDate=${startDate}&endDate=${endDate}`
        }
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/pdf", // Set Accept header for PDF response
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!response.ok) {
        let errorMessage = `Bad Request: ${response.statusText}`;
        const data = await response.json();
        errorMessage = data.error || errorMessage;
        return { success: false, error: errorMessage };
      }
  
      // Return the response blob directly
      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error("Error in profit and loss report service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
  getBalanceSheetReport: async (endDate?: any) => {
    try {
        let url = `${BASE_URL}/balance-sheet-report?`
        if(endDate){
            url += `endDate=${endDate}`
        }
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/pdf", // Set Accept header for PDF response
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!response.ok) {
        let errorMessage = `Bad Request: ${response.statusText}`;
        const data = await response.json();
        errorMessage = data.error || errorMessage;
        return { success: false, error: errorMessage };
      }
  
      // Return the response blob directly
      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error("Error in profit and loss report service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
}