import { account } from './appwrite.js';
import { db } from './database.js';
import { ID } from 'appwrite';
import { USER_ROLES } from '../utils/constants.js';

export const authService = {
  /**
   * Register a new user with a specific role
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @param {string} role - User role (cliente, profissional, admin)
   * @returns {Promise<{user: object, session: object}>}
   */
  async register(email, password, name, role = USER_ROLES.CLIENTE) {
    try {
      // Create Appwrite account
      const user = await account.create(ID.unique(), email, password, name);

      // Create session (auto-login after registration)
      const session = await account.createEmailPasswordSession(email, password);

      // Update user labels with role (using prefs as labels API might need server SDK)
      await account.updatePrefs({ role });

      // Create user metadata document in database
      await db.createUserMetadata({
        userId: user.$id,
        email: user.email,
        name: user.name,
        role: role,
        createdAt: new Date().toISOString(),
        isActive: true,
      });

      // If user is a professional, create their TENANT
      if (role === USER_ROLES.PROFISSIONAL) {
        const { prepareTenantData } = await import('../utils/tenant.js');

        await db.createTenant(
          prepareTenantData(user.$id, {
            name: user.name,
            bio: '',
            tagline: '',
            location: '',
          })
        );

        // Create a default package
        await db.createPackage({
          tenant_id: user.$id,
          name: 'Massagem Relaxante',
          description: 'Sessão de massagem relaxante personalizada',
          type: 'massage',
          category: 'relaxante',
          price: 20000, // R$200.00 (em centavos)
          duration: 60, // 60 minutos
          isActive: true,
          isPopular: true,
        });
      }

      return { user, session };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login user with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} Session object
   */
  async login(email, password) {
    return await account.createEmailPasswordSession(email, password);
  },

  /**
   * Logout current user
   */
  async logout() {
    return await account.deleteSession('current');
  },

  /**
   * Get current logged-in user
   * @returns {Promise<object|null>} User object or null
   */
  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },

  /**
   * Get current user with role and metadata
   * @returns {Promise<{user: object, metadata: object, role: string}|null>}
   */
  async getCurrentUserWithRole() {
    try {
      const user = await account.get();
      if (!user) return null;

      // Get role from preferences
      const role = user.prefs?.role || USER_ROLES.CLIENTE;

      // Get user metadata from database
      const metadata = await db.getUserMetadata(user.$id);

      return {
        user,
        metadata,
        role,
      };
    } catch (error) {
      console.error('Error getting user with role:', error);
      return null;
    }
  },

  /**
   * Update user role (admin only)
   * @param {string} userId
   * @param {string} newRole
   */
  async updateUserRole(userId, newRole) {
    // Note: This requires server-side implementation or admin SDK
    // For now, we update preferences (which works for current user only)
    await account.updatePrefs({ role: newRole });

    // Update in database
    const metadata = await db.getUserMetadata(userId);
    if (metadata) {
      await db.updateUserMetadata(metadata.$id, { role: newRole });
    }
  },

  /**
   * Send email verification
   */
  async sendVerification() {
    return await account.createVerification(`${window.location.origin}/verify`);
  },

  /**
   * Check if user has a specific role
   * @param {string} role
   * @returns {Promise<boolean>}
   */
  async hasRole(role) {
    try {
      const user = await account.get();
      return user.prefs?.role === role;
    } catch {
      return false;
    }
  },

  /**
   * Check if user is admin
   * @returns {Promise<boolean>}
   */
  async isAdmin() {
    return await this.hasRole(USER_ROLES.ADMIN);
  },

  /**
   * Check if user is professional
   * @returns {Promise<boolean>}
   */
  async isProfessional() {
    return await this.hasRole(USER_ROLES.PROFISSIONAL);
  },

  /**
   * Check if user is client
   * @returns {Promise<boolean>}
   */
  async isClient() {
    return await this.hasRole(USER_ROLES.CLIENTE);
  },
};
