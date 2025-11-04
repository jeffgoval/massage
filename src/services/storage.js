import { storage } from './appwrite.js';

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

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


