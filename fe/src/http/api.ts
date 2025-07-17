import { useAuth } from "@/store/useAuth";
import axios from "axios";

const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
});

http.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  // console.log("token is:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
    if (error.response?.status === 403) {
      const forbiddenEvent = new CustomEvent("forbidden", {
        detail: { error: error.response.data },
      });
      window.dispatchEvent(forbiddenEvent);
    }
    if (error.response?.status === 404) {
      const notFoundEvent = new CustomEvent("not-found", {
        detail: { error: error.response.data },
      });
      window.dispatchEvent(notFoundEvent);
    }

    return Promise.reject(error);
  }
);

export default http;
