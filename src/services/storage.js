import { storage } from './appwrite.js';
import { ID } from 'appwrite';

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
const PROFILES_BUCKET_ID = import.meta.env.VITE_APPWRITE_PROFILES_BUCKET_ID;

export function getOptimizedImage(fileId, width = 400) {
  return storage.getFilePreview(
    BUCKET_ID,
    fileId,
    width,
    0,
    'center',
    80,
    0,
    '000000',
    0,
    0,
    0,
    0,
    'webp'
  );
}

export const storageService = {
  /**
   * Upload profile image
   * @param {File} file - Image file to upload
   * @returns {Promise<object>} - File info with URL
   */
  async uploadProfileImage(file) {
    try {
      // Upload file
      const response = await storage.createFile(
        PROFILES_BUCKET_ID,
        ID.unique(),
        file
      );

      // Get file URL
      const fileUrl = storage.getFileView(PROFILES_BUCKET_ID, response.$id);

      return {
        fileId: response.$id,
        fileUrl: fileUrl.href,
      };
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },

  /**
   * Delete profile image
   * @param {string} fileId - ID of file to delete
   */
  async deleteProfileImage(fileId) {
    try {
      await storage.deleteFile(PROFILES_BUCKET_ID, fileId);
    } catch (error) {
      console.error('Error deleting profile image:', error);
      throw error;
    }
  },

  /**
   * Get profile image URL
   * @param {string} fileId - ID of file
   * @returns {string} - URL of image
   */
  getProfileImageUrl(fileId) {
    if (!fileId) return null;
    const fileUrl = storage.getFileView(PROFILES_BUCKET_ID, fileId);
    return fileUrl.href;
  },
};
