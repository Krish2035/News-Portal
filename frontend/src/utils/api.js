// src/lib/appwrite/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://news-portal-7g52.vercel.app";

const apiRequest = async (endpoint, options = {}) => {
  const { method = "GET", body = null, headers = {} } = options;

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", 
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export default apiRequest;