/**
 * News Nova - Centralized API Client
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://news-portal-7g52.vercel.app";

const apiRequest = async (endpoint, options = {}) => {
  const { method = "GET", body = null, headers = {} } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Required for production cookies
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, fetchOptions);
    const contentType = res.headers.get("content-type");

    // Parse JSON if available, otherwise return raw text/status
    const data = contentType && contentType.includes("application/json") 
      ? await res.json() 
      : await res.text();

    if (!res.ok) {
      // Throw an error object that our components can catch
      throw new Error(data.message || data || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error.message);
    throw error;
  }
};

export default apiRequest;