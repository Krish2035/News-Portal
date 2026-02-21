// src/lib/appwrite/uploadImage.js
import { ID, ImageGravity } from "appwrite";
import { appWriteConfig, storage } from "./config";

/**
 * Uploads a file to the Appwrite bucket
 * @param {File} file - The file object from the input field
 */
export async function uploadFile(file) {
  try {
    const uploadedFile = await storage.createFile(
      appWriteConfig.storageId,
      ID.unique(),
      file,
    );
    return uploadedFile;
  } catch (error) {
    console.error("Appwrite Service :: uploadFile :: error", error);
    throw error;
  }
}

/**
 * Generates a preview URL for a specific file
 * @param {string} fileId - The ID of the uploaded file
 */
export function getFilePreview(fileId) {
  try {
    // This method is synchronous and returns a URL object
    const fileUrl = storage.getFilePreview(
      appWriteConfig.storageId,
      fileId,
      2000, // width
      2000, // height
      ImageGravity.Top, // gravity
      100, // quality
    );

    // Return the string version of the URL so it can be used in <img src="..." />
    return fileUrl.href;
  } catch (error) {
    console.error("Appwrite Service :: getFilePreview :: error", error);
    return null;
  }
}
