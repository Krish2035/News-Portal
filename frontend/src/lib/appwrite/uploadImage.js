import { ID } from "appwrite";
import { appWriteConfig, storage } from "./config";

/**
 * Uploads a file to the Appwrite bucket.
 */
export async function uploadFile(file) {
  if (!file) return null;

  try {
    const uploadedFile = await storage.createFile(
      appWriteConfig.storageId,
      ID.unique(),
      file,
    );
    return uploadedFile;
  } catch (error) {
    console.error("Appwrite Upload Error:", error.message);
    throw error;
  }
}

/**
 * Generates a direct URL to the file.
 * We use getFileView because getFilePreview with parameters
 * is restricted on the Appwrite Free Plan.
 */
export function getFileView(fileId) {
  try {
    if (!fileId) return null;

    // getFileView provides the original file without transformations
    const fileUrl = storage.getFileView(appWriteConfig.storageId, fileId);

    return fileUrl?.href || fileUrl?.toString() || null;
  } catch (error) {
    console.error("Appwrite View Error:", error);
    return null;
  }
}

/**
 * Fallback Preview function without transformation parameters.
 */
export function getFilePreview(fileId) {
  try {
    if (!fileId) return null;

    // We MUST NOT pass width, height, or quality here on the Free Plan
    const fileUrl = storage.getFilePreview(appWriteConfig.storageId, fileId);

    return fileUrl?.href || fileUrl?.toString() || null;
  } catch (error) {
    console.error("Appwrite Preview Error:", error);
    return null;
  }
}