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
}