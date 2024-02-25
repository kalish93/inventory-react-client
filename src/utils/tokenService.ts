import { REFRESH_URL } from "../core/api-routes";

let accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

export const getAccessToken = () => accessToken;

export const updateAccessToken = (newToken: string) => {
  accessToken = newToken;
  localStorage.setItem('accessToken',accessToken)
};

export async function refreshAccessToken() {
  try {
    const response = await fetch(REFRESH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    
    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Failed to refresh access token");
  }
}
