import { CHANGE_PASSWORD_URL, LOGIN_URL, USERS_URL } from "../../core/api-routes";
import { CreateUser } from "../../models/user";
import { handleRequest } from "../../utils/apiService";

export const UserService = {
  login: async (userName: string, password: string) => {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return {
      username: data.user.userName,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  },

  logout: () => {
    localStorage.removeItem("accessToken");
  },

  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  registerUser: async (userData: CreateUser) => {
    try {
      const response = await handleRequest(USERS_URL, {
        method: "POST",
        body: JSON.stringify(userData),
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
      console.error("Error in registerUser service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  getUsers: async (page = 1, pageSize = 10) => {
    try {
      const response = await handleRequest(
        `${USERS_URL}?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("get users failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in getUsers service:", error);
      throw error;
    }
  },

  updateUser: async (userData: any) => {
    try {
      const response = await handleRequest(`${USERS_URL}/${userData.id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
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
      console.error("Error in update User service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  deleteUser: async (id: any) => {
    try {
      const response = await handleRequest(`${USERS_URL}/${id}`, {
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
      console.error("Error in delete User service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },

  changePassword: async (passwordData: any) => {
    try {
      const response = await handleRequest(CHANGE_PASSWORD_URL, {
        method: "PUT",
        body: JSON.stringify(passwordData),
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
      console.error("Error in change password service:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  },
};
