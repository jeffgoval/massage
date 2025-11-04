import { databases, Query } from './appwrite.js';
import { ID } from 'appwrite';

export const DB_IDS = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  users: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID, // User metadata
  tenants: import.meta.env.VITE_APPWRITE_TENANTS_COLLECTION_ID, // Profissionais como tenants
  packages: import.meta.env.VITE_APPWRITE_PACKAGES_COLLECTION_ID, // Serviços/pacotes por tenant
  bookings: import.meta.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID,
  reviews: import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION_ID,
  chats: import.meta.env.VITE_APPWRITE_CHATS_COLLECTION_ID,
  messages: import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
  pricing: import.meta.env.VITE_APPWRITE_PRICING_COLLECTION_ID, // Pricing configurations
  favorites: import.meta.env.VITE_APPWRITE_FAVORITES_COLLECTION_ID, // Saved profiles
  // Legacy (mantido para compatibilidade)
  profiles: import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID,
};

// Validate required environment variables
const validateEnvVars = () => {
  const missing = [];
  if (!DB_IDS.databaseId) missing.push('VITE_APPWRITE_DATABASE_ID');
  if (!DB_IDS.users) missing.push('VITE_APPWRITE_USERS_COLLECTION_ID');
  if (!DB_IDS.profiles) missing.push('VITE_APPWRITE_PROFILES_COLLECTION_ID');

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please check your .env file and add the missing variables.');
  }
};

validateEnvVars();

export const db = {
  // Profiles
  listProfiles: (queries = []) =>
    databases.listDocuments(DB_IDS.databaseId, DB_IDS.profiles, queries),

  getProfile: (profileId) =>
    databases.getDocument(DB_IDS.databaseId, DB_IDS.profiles, profileId),

  createProfile: (data) =>
    databases.createDocument(DB_IDS.databaseId, DB_IDS.profiles, ID.unique(), data),

  updateProfile: (profileId, data) =>
    databases.updateDocument(DB_IDS.databaseId, DB_IDS.profiles, profileId, data),

  deleteProfile: (profileId) =>
    databases.deleteDocument(DB_IDS.databaseId, DB_IDS.profiles, profileId),

  // User metadata
  getUserMetadata: async (userId) => {
    try {
      const response = await databases.listDocuments(DB_IDS.databaseId, DB_IDS.users, [
        Query.equal('userId', userId),
      ]);
      return response.documents[0] || null;
    } catch (error) {
      console.error('Error fetching user metadata:', error);
      return null;
    }
  },

  createUserMetadata: (data) =>
    databases.createDocument(DB_IDS.databaseId, DB_IDS.users, ID.unique(), data),

  updateUserMetadata: (documentId, data) =>
    databases.updateDocument(DB_IDS.databaseId, DB_IDS.users, documentId, data),

  // Bookings
  listBookings: (queries = []) =>
    databases.listDocuments(DB_IDS.databaseId, DB_IDS.bookings, queries),

  getBooking: (bookingId) =>
    databases.getDocument(DB_IDS.databaseId, DB_IDS.bookings, bookingId),

  createBooking: (data) =>
    databases.createDocument(DB_IDS.databaseId, DB_IDS.bookings, ID.unique(), data),

  updateBooking: (bookingId, data) =>
    databases.updateDocument(DB_IDS.databaseId, DB_IDS.bookings, bookingId, data),

  // Reviews
  listReviews: (queries = []) =>
    databases.listDocuments(DB_IDS.databaseId, DB_IDS.reviews, queries),

  listReviewsByTenant: (tenantId, queries = []) =>
    databases.listDocuments(DB_IDS.databaseId, DB_IDS.reviews, [
      Query.equal('tenant_id', tenantId),
      ...queries,
    ]),

  createReview: (data) =>
    databases.createDocument(DB_IDS.databaseId, DB_IDS.reviews, ID.unique(), data),

  // ====================
  // MULTI-TENANT METHODS
  // ====================

  // Tenants (Profissionais)
  getTenant: (tenantId) =>
    databases.getDocument(DB_IDS.databaseId, DB_IDS.tenants, tenantId),

  getTenantBySlug: async (slug) => {
    try {
      const response = await databases.listDocuments(DB_IDS.databaseId, DB_IDS.tenants, [
        Query.equal('slug', slug),
      ]);
      return response.documents[0] || null;
    } catch (error) {
      console.error('Error fetching tenant by slug:', error);
      return null;
    }
  },

  listTenants: (queries = []) =>
    databases.listDocuments(DB_IDS.databaseId, DB_IDS.tenants, queries),

  createTenant: (data) =>
    databases.createDocument(DB_IDS.databaseId, DB_IDS.tenants, data.tenant_id, data),

  updateTenant: (tenantId, data) =>
    databases.updateDocument(DB_IDS.databaseId, DB_IDS.tenants, tenantId, {
      ...data,
      updatedAt: new Date().toISOString(),
    }),

  deleteTenant: (tenantId) =>
    databases.deleteDocument(DB_IDS.databaseId, DB_IDS.tenants, tenantId),

  // Packages (Serviços/Pacotes por Tenant)
  listPackages: (queries = []) =>
    databases.listDocuments(DB_IDS.databaseId, DB_IDS.packages, queries),

  listPackagesByTenant: (tenantId, queries = []) =>
    databases.listDocuments(DB_IDS.databaseId, DB_IDS.packages, [
      Query.equal('tenant_id', tenantId),
      ...queries,
    ]),

  getPackage: (packageId) =>
    databases.getDocument(DB_IDS.databaseId, DB_IDS.packages, packageId),

  createPackage: (data) =>
    databases.createDocument(DB_IDS.databaseId, DB_IDS.packages, ID.unique(), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),

  updatePackage: (packageId, data) =>
    databases.updateDocument(DB_IDS.databaseId, DB_IDS.packages, packageId, {
      ...data,
      updatedAt: new Date().toISOString(),
    }),

  deletePackage: (packageId) =>
    databases.deleteDocument(DB_IDS.databaseId, DB_IDS.packages, packageId),

  // Pricing Configurations
  getPricingConfig: async (tenantId) => {
    try {
      const response = await databases.listDocuments(DB_IDS.databaseId, DB_IDS.pricing, [
        Query.equal('tenant_id', tenantId),
      ]);
      return response.documents[0] || null;
    } catch (error) {
      console.error('Error fetching pricing config:', error);
      return null;
    }
  },

  createPricingConfig: (data) =>
    databases.createDocument(DB_IDS.databaseId, DB_IDS.pricing, ID.unique(), data),

  updatePricingConfig: (configId, data) =>
    databases.updateDocument(DB_IDS.databaseId, DB_IDS.pricing, configId, data),

  // Favorites (Saved Profiles)
  listFavorites: async (userId) => {
    try {
      const response = await databases.listDocuments(DB_IDS.databaseId, DB_IDS.favorites, [
        Query.equal('user_id', userId),
      ]);
      return response.documents;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },

  isFavorite: async (userId, tenantId) => {
    try {
      const response = await databases.listDocuments(DB_IDS.databaseId, DB_IDS.favorites, [
        Query.equal('user_id', userId),
        Query.equal('tenant_id', tenantId),
      ]);
      return response.documents.length > 0;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  addFavorite: async (userId, tenantId) => {
    try {
      return await databases.createDocument(
        DB_IDS.databaseId,
        DB_IDS.favorites,
        ID.unique(),
        { user_id: userId, tenant_id: tenantId }
      );
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  removeFavorite: async (userId, tenantId) => {
    try {
      const response = await databases.listDocuments(DB_IDS.databaseId, DB_IDS.favorites, [
        Query.equal('user_id', userId),
        Query.equal('tenant_id', tenantId),
      ]);
      if (response.documents.length > 0) {
        await databases.deleteDocument(
          DB_IDS.databaseId,
          DB_IDS.favorites,
          response.documents[0].$id
        );
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },
};
