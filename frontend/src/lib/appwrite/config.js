import { Client, Storage } from "appwrite";

// 1. Define your configuration using environment variables
export const appWriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
};

// 2. Initialize the Appwrite Client
export const client = new Client();

// 3. Safety Check: Only set the endpoint if the URL string exists
// This prevents the "Uncaught AppwriteException: Endpoint must be a valid string" error
if (appWriteConfig.url) {
  client.setEndpoint(appWriteConfig.url);
} else {
  console.error(
    "CRITICAL ERROR: Appwrite URL is undefined. Please check your .env file and restart your server.",
  );
}

// 4. Set the Project ID
if (appWriteConfig.projectId) {
  client.setProject(appWriteConfig.projectId);
} else {
  console.error(
    "CRITICAL ERROR: Appwrite Project ID is undefined. Please check your .env file.",
  );
}

// 5. Initialize and export Storage
export const storage = new Storage(client);
