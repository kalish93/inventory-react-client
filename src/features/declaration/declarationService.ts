import { DECLARATIONS_URL } from "../../core/api-routes";
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

};
