const normalizeBasePath = (value) => {
  if (!value || value === "/") return "";
  return value.startsWith("/") ? value : `/${value}`;
};

export const appConfig = {
  backendProtocol: import.meta.env.VITE_BACKEND_PROTOCOL || "http",
  backendHost: import.meta.env.VITE_BACKEND_HOST || "localhost",
  backendPort: import.meta.env.VITE_BACKEND_PORT || "8080",
  apiBasePath: normalizeBasePath(import.meta.env.VITE_API_BASE_PATH || "/api"),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || null,
};

export const getApiBaseUrl = () => {
  if (appConfig.apiBaseUrl) return appConfig.apiBaseUrl.replace(/\/$/, "");

  const port = appConfig.backendPort ? `:${appConfig.backendPort}` : "";
  return `${appConfig.backendProtocol}://${appConfig.backendHost}${port}${appConfig.apiBasePath}`.replace(/\/$/, "");
};
