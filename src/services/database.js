import { databases } from './appwrite.js';

export const DB_IDS = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  profiles: import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID,
  bookings: import.meta.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID,
  reviews: import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION_ID,
  chats: import.meta.env.VITE_APPWRITE_CHATS_COLLECTION_ID,
  messages: import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
};

export const db = {
  listProfiles: (queries = []) =>
    databases.listDocuments(DB_IDS.databaseId, DB_IDS.profiles, queries),
};
