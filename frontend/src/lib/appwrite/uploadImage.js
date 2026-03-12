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
 * FIXED: Standardizes image retrieval for News Nova.
 * Forces the 'view' endpoint which is free and unrestricted.
 */
export function getFileView(fileId) {
  try {
    if (!fileId) return null;

    // We use getFileView because it bypasses the transformation engine
    const fileUrl = storage.getFileView(appWriteConfig.storageId, fileId);

    // Ensure we return the href string and strip any accidental query params
    return fileUrl?.href ? fileUrl.href.split('&')[0] : fileUrl.toString();
  } catch (error) {
    console.error("Appwrite View Error:", error);
    return null;
  }
}

/**
 * FIXED: Fallback that redirects to View to avoid 403 transformation errors.
 */
export function getFilePreview(fileId) {
  // On the Free Plan, getFilePreview often fails due to default headers.
  // We redirect this call to getFileView for maximum reliability.
  return getFileView(fileId);
}