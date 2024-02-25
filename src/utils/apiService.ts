import { refreshAccessToken, getAccessToken, updateAccessToken } from "./tokenService";

const headers = {
  "Content-Type": "application/json",
  'Authorization': `Bearer ${getAccessToken()}`,
};

export async function handleRequest(url: any, options: any) {
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response;
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Token expired") {
      try {
        const newAccessToken = await refreshAccessToken();
        updateAccessToken(newAccessToken);
        headers.Authorization = `Bearer ${newAccessToken}`;

        return await fetch(url, { ...options, headers }).then(response => response);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        throw new Error("Failed to refresh access token");
      }
    }

    throw error;
  }
}
