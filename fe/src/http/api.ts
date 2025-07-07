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

export default http;
