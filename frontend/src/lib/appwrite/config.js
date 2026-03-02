import { Client, Storage } from "appwrite";

// 1. Define your configuration using environment variables
export const appWriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
};

// 2. Initialize the Appwrite Client
export const client = new Client();

// 3. Configure Client with Safety Checks
if (appWriteConfig.url && appWriteConfig.projectId) {
  client.setEndpoint(appWriteConfig.url).setProject(appWriteConfig.projectId);
} else {
  console.error(
    "CRITICAL ERROR: Appwrite credentials missing. Verify your .env file and restart the Vite dev server.",
  );
}

// 4. Initialize and export Storage
export const storage = new Storage(client);
