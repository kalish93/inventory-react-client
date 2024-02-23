import { LOGIN_URL, USERS_URL } from "../../core/api-routes";
import { CreateUser } from "../../models/user";

const accessToken = localStorage.getItem("accessToken");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
};

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
    localStorage.setItem("accessToken", data.accessToken);
    
    return { username: data.user.userName, accessToken: data.accessToken };
  },

  logout: () => {
    localStorage.removeItem("accessToken");
  },

  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  registerUser: async (userData: CreateUser) => {
    try {
      const response = await fetch(USERS_URL, {
        method: "POST",
        headers: headers,
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
      const response = await fetch(
        `${USERS_URL}?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error('get users failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in getUsers service:", error);
      throw error;
    }
  },
};
