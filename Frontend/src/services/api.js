const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const apiClient = {
  async get(path) {
    if (!API_BASE_URL) {
      throw new Error("API base URL is not configured yet.");
    }

    const response = await fetch(`${API_BASE_URL}${path}`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  },
};
