import { LOGIN_URL } from "../../core/api-routes";
import { CreateUser } from "../../models/user";

export const UserService = {
    login: async (userName: string, password: string) => {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      return { username: data.refreshToken, token: data.accessToken };
    },

    registerUser: async (userData: CreateUser) => {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      return { username: data.refreshToken, token: data.accessToken };
    },
    
    logout: () => {
      localStorage.removeItem('token');
    },
  };
  