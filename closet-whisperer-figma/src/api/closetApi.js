import { apiRequest } from "./httpClient";

const qs = (params) =>
  "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null)).toString();

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  // POST /users  — no auth required
  register: (payload) =>
    apiRequest("/users", { method: "POST", body: JSON.stringify(payload) }),

  // GET /users/login/{systemID}/{userEmail}?password=
  login: ({ systemID, userEmail, password }) =>
    apiRequest(`/users/login/${systemID}/${userEmail}${qs({ password })}`),

  // PUT /users/{systemID}/{userEmail}?password=
  updateUser: (systemID, userEmail, password, payload) =>
    apiRequest(`/users/${systemID}/${userEmail}${qs({ password })}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // DELETE /users/{systemID}/{userEmail}?password=
  deleteUser: (systemID, userEmail, password) =>
    apiRequest(`/users/${systemID}/${userEmail}${qs({ password })}`, {
      method: "DELETE",
    }),
};

// ── User Profile ──────────────────────────────────────────────────────────────

export const profileApi = {
  // POST /profiles?userSystemID=&userEmail=&userPassword=
  createProfile: (auth, payload) =>
    apiRequest(`/profiles${qs(auth)}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // PUT /profiles/{userId}/biometrics?userSystemID=&userEmail=&userPassword=
  updateBiometrics: (userId, auth, payload) =>
    apiRequest(`/profiles/${userId}/biometrics${qs(auth)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // PUT /profiles/{userId}/preferences?userSystemID=&userEmail=&userPassword=
  updatePreferences: (userId, auth, payload) =>
    apiRequest(`/profiles/${userId}/preferences${qs(auth)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // GET /profiles?userSystemID=&userEmail=&userPassword=
  getProfileByEmail: (auth) =>
    apiRequest(`/profiles${qs(auth)}`),
};

// ── Style Weights ─────────────────────────────────────────────────────────────

export const styleWeightApi = {
  // GET /profiles/{userId}/weights?userSystemID=&userEmail=&userPassword=
  getWeights: (userId, auth) =>
    apiRequest(`/profiles/${userId}/weights${qs(auth)}`),

  // PUT /profiles/{userId}/weights?userSystemID=&userEmail=&userPassword=&...
  adjustWeight: (userId, auth, params) =>
    apiRequest(`/profiles/${userId}/weights${qs({ ...auth, ...params })}`, {
      method: "PUT",
    }),

  // DELETE /profiles/{userId}/weights?userSystemID=&userEmail=&userPassword=
  resetWeights: (userId, auth) =>
    apiRequest(`/profiles/${userId}/weights${qs(auth)}`, { method: "DELETE" }),
};

// ── Wardrobe (Clothing Items) ──────────────────────────────────────────────────

export const inventoryApi = {
  // POST /items/analyze?userSystemID=&userEmail=&userPassword=
  analyzeImage: (auth, imageBase64, imageUrl) =>
    apiRequest(`/items/analyze${qs(auth)}`, {
      method: "POST",
      body: JSON.stringify({ imageBase64, imageUrl }),
    }),

  // POST /items?userSystemID=&userEmail=&userPassword=
  createItem: (auth, payload, imageUrl, imageBase64) =>
    apiRequest(
      `/items${qs({ ...auth, ...(imageUrl ? { imageUrl } : {}), ...(imageBase64 ? { imageBase64 } : {}) })}`,
      { method: "POST", body: JSON.stringify(payload) }
    ),

  // PUT /items/{itemId}/details?userSystemID=&userEmail=&userPassword=
  editDetails: (itemId, auth, payload) =>
    apiRequest(`/items/${itemId}/details${qs(auth)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // PUT /items/{itemId}/status?userSystemID=&userEmail=&userPassword=&status=
  changeStatus: (itemId, auth, status) =>
    apiRequest(`/items/${itemId}/status${qs({ ...auth, status })}`, {
      method: "PUT",
    }),

  // DELETE /items/{itemId}?userSystemID=&userEmail=&userPassword=
  deleteItem: (itemId, auth) =>
    apiRequest(`/items/${itemId}${qs(auth)}`, { method: "DELETE" }),

  // GET /items/{itemId}?userSystemID=&userEmail=&userPassword=
  getItem: (itemId, auth) =>
    apiRequest(`/items/${itemId}${qs(auth)}`),

  // GET /items?userSystemID=&userEmail=&userPassword=&ownerProfileId=&page=&size=&activeOnly=
  listItems: (auth, ownerProfileId, page = 0, size = 50, activeOnly = true) =>
    apiRequest(`/items${qs({ ...auth, ownerProfileId, page, size, activeOnly })}`),
};

// ── Outfits ───────────────────────────────────────────────────────────────────

export const recommendationApi = {
  // POST /outfits?userId=&userSystemID=&userEmail=&userPassword=
  generateOutfit: (auth, userId, hints) =>
    apiRequest(`/outfits${qs({ userId, ...auth })}`, {
      method: "POST",
      body: hints ? JSON.stringify(hints) : undefined,
    }),

  // PUT /outfits/{outfitId}/confirm?userSystemID=&userEmail=&userPassword=
  confirmOutfit: (outfitId, auth) =>
    apiRequest(`/outfits/${outfitId}/confirm${qs(auth)}`, { method: "PUT" }),

  // PUT /outfits/{outfitId}/rate?score=&userSystemID=&userEmail=&userPassword=
  rateOutfit: (outfitId, score, auth) =>
    apiRequest(`/outfits/${outfitId}/rate${qs({ score, ...auth })}`, {
      method: "PUT",
    }),

  // DELETE /outfits/{outfitId}?userSystemID=&userEmail=&userPassword=
  deleteOutfit: (outfitId, auth) =>
    apiRequest(`/outfits/${outfitId}${qs(auth)}`, { method: "DELETE" }),
};

// ── Outfit History ────────────────────────────────────────────────────────────

export const historyApi = {
  // GET /outfits/history?userId=&userSystemID=&userEmail=&userPassword=&page=&size=
  listWearHistory: (auth, userId, page = 0, size = 20) =>
    apiRequest(`/outfits/history${qs({ userId, ...auth, page, size })}`),
};// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminApi = {
  // GET /admin/users?userSystemID=&userEmail=&userPassword=&page=&size=
  listUsers: (auth, page = 0, size = 20) =>
    apiRequest(`/admin/users${qs({ ...auth, page, size })}`),

  // DELETE /admin/users?userSystemID=&userEmail=&userPassword=
  deleteAllUsers: (auth) =>
    apiRequest(`/admin/users${qs(auth)}`, { method: "DELETE" }),

  // GET /admin/commands?userSystemID=&userEmail=&userPassword=&page=&size=
  listCommands: (auth, page = 0, size = 20) =>
    apiRequest(`/admin/commands${qs({ ...auth, page, size })}`),

  // DELETE /admin/commands?userSystemID=&userEmail=&userPassword=
  deleteAllCommands: (auth) =>
    apiRequest(`/admin/commands${qs(auth)}`, { method: "DELETE" }),

  // GET /admin/objects?userSystemID=&userEmail=&userPassword=&page=&size=
  listObjects: (auth, page = 0, size = 20) =>
    apiRequest(`/admin/objects${qs({ ...auth, page, size })}`),

  // DELETE /admin/objects?userSystemID=&userEmail=&userPassword=
  deleteAllObjects: (auth) =>
    apiRequest(`/admin/objects${qs(auth)}`, { method: "DELETE" }),

  // GET /admin/config (Public)
  getConfig: () =>
    apiRequest(`/admin/config`),

  // PUT /admin/config?userSystemID=&userEmail=&userPassword=
  updateConfig: (auth, settings) =>
    apiRequest(`/admin/config${qs(auth)}`, {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  // PUT /admin/users/{systemID}/{userEmail}/role?userSystemID=&userEmail=&userPassword=&role=
  updateUserRole: (auth, targetSystemId, targetEmail, role) =>
    apiRequest(`/admin/users/${targetSystemId}/${targetEmail}/role${qs({ ...auth, role })}`, {
      method: "PUT",
    }),

  // DELETE /admin/users/{systemID}/{userEmail}?userSystemID=&userEmail=&userPassword=
  deleteUser: (auth, targetSystemId, targetEmail) =>
    apiRequest(`/admin/users/${targetSystemId}/${targetEmail}${qs(auth)}`, {
      method: "DELETE",
    }),
};

// ── Commands ─────────────────────────────────────────────────────────────────

export const commandApi = {
  // POST /commands?userPassword=
  invokeCommand: (userPassword, payload) =>
    apiRequest(`/commands${qs({ userPassword })}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
