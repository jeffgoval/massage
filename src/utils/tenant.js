import { Query } from 'appwrite';
import { USER_ROLES } from './constants.js';

/**
 * Get tenant ID for current user
 * - Profissional: returns their own userId (they ARE the tenant)
 * - Cliente: returns null (not a tenant)
 * - Admin: returns null (can access all tenants)
 */
export const getTenantId = (user, role) => {
  if (!user) return null;
  if (role === USER_ROLES.PROFISSIONAL) return user.$id;
  return null; // Cliente or Admin
};

/**
 * Check if user is a tenant (profissional)
 */
export const isTenant = (role) => {
  return role === USER_ROLES.PROFISSIONAL;
};

/**
 * Add tenant_id filter to queries automatically
 * Throws error if tenantId is required but not provided
 */
export const withTenantFilter = (tenantId, otherQueries = []) => {
  if (!tenantId) {
    throw new Error('tenant_id is required for this operation');
  }
  return [Query.equal('tenant_id', tenantId), ...otherQueries];
};

/**
 * Validate that a resource belongs to the current tenant
 * Throws error if tenant doesn't own the resource
 */
export const ensureTenantOwnership = (resource, currentTenantId) => {
  if (!resource) {
    throw new Error('Resource not found');
  }

  if (!resource.tenant_id) {
    throw new Error('Resource does not have tenant_id');
  }

  if (resource.tenant_id !== currentTenantId) {
    throw new Error('Unauthorized: You do not have access to this resource');
  }

  return true;
};

/**
 * Validate that user has permission to access tenant data
 * Returns true if:
 * - User is the tenant owner
 * - User is admin
 * Otherwise throws error
 */
export const canAccessTenant = (user, role, targetTenantId) => {
  // Admin can access any tenant
  if (role === USER_ROLES.ADMIN) return true;

  // Profissional can only access their own tenant
  if (role === USER_ROLES.PROFISSIONAL && user.$id === targetTenantId) {
    return true;
  }

  throw new Error('Unauthorized: Cannot access this tenant');
};

/**
 * Create slug from name for tenant URL
 */
export const createTenantSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing -
};

/**
 * Get tenant display URL
 */
export const getTenantUrl = (slug) => {
  return `/profissional/${slug}`;
};

/**
 * Validate tenant data before create/update
 */
export const validateTenantData = (data) => {
  const errors = [];

  if (!data.name || data.name.length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }

  if (data.price && (data.price < 0 || data.price > 100000000)) {
    errors.push('Preço inválido');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return true;
};

/**
 * Prepare tenant data for creation
 */
export const prepareTenantData = (userId, userData) => {
  return {
    tenant_id: userId,
    name: userData.name,
    display_name: userData.name,
    slug: createTenantSlug(userData.name),
    bio: userData.bio || '',
    tagline: userData.tagline || '',
    location: userData.location || '',
    isActive: true,
    isVip: false,
    isVerified: false,
    rating: 0,
    reviewCount: 0,
    totalBookings: 0,
    avatar: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
