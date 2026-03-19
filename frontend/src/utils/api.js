// Matches the variable name in your .env file
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

const apiRequest = async (endpoint, options = {}) => {
  const { method = "GET", body = null, headers = {} } = options;
  
  // Ensure the URL is correctly constructed without double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${cleanEndpoint}`;

  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    // Essential for keeping users logged in across domains (Vercel Frontend -> Vercel Backend)
    credentials: "include", 
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error.message);
    throw error;
  }
};

export default apiRequest;