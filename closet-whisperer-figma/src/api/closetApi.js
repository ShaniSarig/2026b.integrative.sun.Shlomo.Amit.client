import { apiRequest } from "./httpClient";

export const authApi = {
  login: (credentials) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
};

export const inventoryApi = {
  listItems: () => apiRequest("/clothing-items"),
  createItem: (payload) => apiRequest("/clothing-items", { method: "POST", body: JSON.stringify(payload) }),
  updateItem: (id, payload) => apiRequest(`/clothing-items/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteItem: (id) => apiRequest(`/clothing-items/${id}`, { method: "DELETE" }),
};

export const recommendationApi = {
  getToday: () => apiRequest("/recommendations/today"),
  generate: () => apiRequest("/recommendations/generate", { method: "POST" }),
  listOutfits: () => apiRequest("/outfits"),
};

export const weatherApi = {
  getCurrentSnapshot: () => apiRequest("/weather/current"),
};

export const historyApi = {
  listWearHistory: () => apiRequest("/outfit-history"),
};

export const profileApi = {
  getProfile: () => apiRequest("/profile"),
  updateProfile: (payload) => apiRequest("/profile", { method: "PUT", body: JSON.stringify(payload) }),
};

export const adminApi = {
  listUsers: () => apiRequest("/admin/users"),
  getSystemHealth: () => apiRequest("/admin/system-health"),
};
