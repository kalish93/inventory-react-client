import { Driver } from "../../models/driver";
import { DRIVER_URL } from "../../core/api-routes";
import { CreateDriver } from "../../models/driver";

export const DriverService = {
  getDrivers: async (page?: number, pageSize?: number) => {
    try {
      let url = DRIVER_URL;
  
      if (page && pageSize) {
        url += `?page=${page}&pageSize=${pageSize}`;
      }
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to get drivers");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  },
  

  createDriver: async (driverData: CreateDriver) => {
    try {
      console.log(driverData)
      const response = await fetch(DRIVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        try {
        const response = await fetch(`${DRIVER_URL}/${driverData.id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(driverData),
        });
    
        if (!response.ok) {
            throw new Error("Failed to update driver");
        }
        const data = await response.json();
        return { driver: data.driver };
        } catch (error) {
        console.log("Error", error);
        throw error;
        }
    },

    deleteDriver: async (id: string) => {
        try {
        const response = await fetch(`${DRIVER_URL}/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        });
    
        if (!response.ok) {
            throw new Error("Failed to delete driver");
        }
        const data = await response.json();
        return { driver: data.driver };
        } catch (error) {
        console.log("Error", error);
        throw error;
        }
    },
};
