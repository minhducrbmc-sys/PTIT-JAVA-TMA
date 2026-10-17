import axios from "axios";

// If you access via localhost, it uses localhost.
// If your phone accesses via 192.168.x.x, it automatically uses 192.168.x.x!
const BACKEND_PORT = 5454;
export const API_BASE_URL = `http://${window.location.hostname}:${BACKEND_PORT}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;