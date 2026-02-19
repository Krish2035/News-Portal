import { Client, Storage } from "appwrite";

export const appWriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
}

export const client = new Client()

client.setEndpoint(appWriteConfig.url)
client.setProject(appWriteConfig.projectId)

export const storage = new Storage(client)