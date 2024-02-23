import { ACCOUNT_SUB_TYPES_URL, ACCOUNT_TYPES_URL } from "../../core/api-routes";
import { CreateAccountSubType, CreateAccountType } from "../../models/account-type";

const accessToken = localStorage.getItem("accessToken");
const headers = {
  "Content-Type": "application/json",
  'Authorization': `Bearer ${accessToken}`,
};

export const AccountTypeService = {
  createAccountType: async (accountType: CreateAccountType) => {
    try {
      const response = await fetch(ACCOUNT_TYPES_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(accountType),
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
      console.error("Error in creating account type service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  getAccountTypes: async () => {
    const response = await fetch(ACCOUNT_TYPES_URL, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("account type fetch failed");
    }

    const data = await response.json();
    return data;
  },


  createAccountSubType: async (accountSubType: CreateAccountSubType) => {
    try {
      const response = await fetch(ACCOUNT_SUB_TYPES_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(accountSubType),
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
      console.error("Error in creating account type service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
};
