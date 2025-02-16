// src/services/axiosInstance.ts

import axios from "axios";

// Base URL for your API
const BASE_URL = "http://localhost:8080/api";

// Function to retrieve the token from localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Interceptor to add the Authorization header to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
