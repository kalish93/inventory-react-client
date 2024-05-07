import { DECLARATIONS_URL, DECLARATION_DETAIL_URL } from "../../core/api-routes";
import { CreateDeclaration } from "../../models/declaration";
import { handleRequest } from "../../utils/apiService";

export const DeclarationService = {
  getDeclarations: async (page?: any, pageSize?: any) => {
    try {
      let url = DECLARATIONS_URL;

      if (page && pageSize) {
        url += `?page=${page}&pageSize=${pageSize}`;
      }

      const response = await handleRequest(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error('Error retrieving declarations');
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Error in getDeclarations service:', error);
      throw error;
    }
  },
  

      registerDeclaration: async (DeclarationData: CreateDeclaration) => {
        try{
          const response = await handleRequest(DECLARATIONS_URL, {
            method: "POST",
            body: JSON.stringify(DeclarationData),
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

    registerCustomTaxPayment: async (DeclarationData: any) => {
      try{
        const response = await handleRequest(`${DECLARATIONS_URL}/custom-tax-payment`, {
          method: "POST",
          body: JSON.stringify(DeclarationData),
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

    deleteCustomTaxPayment: async (id: any) => {
      try{
        const response = await handleRequest(`${DECLARATIONS_URL}/custom-tax-payment/${id}`, {
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
      console.error("Error in registerdriver service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  getDeclarationById: async (declarationId: string) => {
    try {
      const url = `${DECLARATIONS_URL}/${declarationId}`;
      const response = await handleRequest(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error retrieving declaration by ID");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in getDeclarationById service:", error);
      throw error;
    }
  },

  deleteDeclaration: async (id: string) => {
    try {
      const response = await handleRequest(`${DECLARATIONS_URL}/${id}`, {
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
      console.error("Error in deleteStore service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
},

  updateDeclaration: async (DeclarationData: any) => {
    try{
      const response = await handleRequest(`${DECLARATIONS_URL}/${DeclarationData.id}`, {
        method: "PUT",
        body: JSON.stringify(DeclarationData),
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
    console.error("Error in update declaration service:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
  },
  updateDeclarationDetail: async (declarationDetail: any) => {
    try{
      const response = await handleRequest(`${DECLARATION_DETAIL_URL}/${declarationDetail.id}`, {
        method: "PUT",
        body: JSON.stringify(declarationDetail),
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
    console.error("Error in update declaration detail service:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
  },

  deleteDeclarationDetail: async (id: any) => {
    try{
      const response = await handleRequest(`${DECLARATION_DETAIL_URL}/${id}`, {
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
    console.error("Error in delete declaration detail service:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
  },

  createDeclarationDetail: async (declarationDetail: any) => {
    try{
      const response = await handleRequest(DECLARATION_DETAIL_URL, {
        method: "POST",
        body: JSON.stringify(declarationDetail),
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
    console.error("Error in create declaration detail service:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
  },

};
