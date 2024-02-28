import { Driver } from "../../models/driver";
import { DRIVER_URL } from "../../core/api-routes";
import { CreateDriver } from "../../models/driver";
import { handleRequest } from "../../utils/apiService";

export const DriverService = {
  getDrivers: async (page?: number, pageSize?: number) => {
    try {
      let url = DRIVER_URL;
  
      if (page && pageSize) {
        url += `?page=${page}&pageSize=${pageSize}`;
      }
      
      const response = await handleRequest(url, {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error("Failed to get drivers");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
  

  createDriver: async (driverData: CreateDriver) => {
    try {
      const response = await handleRequest(DRIVER_URL, {
        method: "POST",
        body: JSON.stringify(driverData),
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

    updateDriver: async (driverData: Driver) => {
        const response = await handleRequest(`${DRIVER_URL}/${driverData.id}`, {
          method: "PUT",
          body: JSON.stringify(driverData),
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


    deleteDriver: async (id: string) => {
        try {
          const response = await handleRequest(`${DRIVER_URL}/${id}`, {
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
};
