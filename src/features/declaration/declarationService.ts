import { DECLARATIONS_URL } from "../../core/api-routes";
import { CreateDeclaration } from "../../models/declaration";

const accessToken = localStorage.getItem('accessToken');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`,
};

export const DeclarationService = {
  getDeclarations: async (page?: any, pageSize?: any) => {
    try {
      let url = DECLARATIONS_URL;

      if (page && pageSize) {
        url += `?page=${page}&pageSize=${pageSize}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
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
        const response = await fetch(DECLARATIONS_URL, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(DeclarationData),
        });
    
        if (!response.ok) {
          throw new Error('Declaration creation failed');
        }
    
        const data = await response.json();
        return data;
      },
  
};
  