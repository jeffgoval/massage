import { useAuthStore } from '../store/authStore';
import { ROLE_PERMISSIONS } from '../utils/constants';

/**
 * Custom hook for authentication and role-based access control
 */
export const useAuth = () => {
  const {
    user,
    role,
    metadata,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
    isProfessional,
    isClient,
    isAuthenticated,
  } = useAuthStore();

  // Get permissions for current user role
  const permissions = role ? ROLE_PERMISSIONS[role] : {};

  /**
   * Check if user has a specific permission
   */
  const can = (permission) => {
    if (!role) return false;
    return permissions[permission] || false;
  };

  /**
   * Check if user can perform any of the listed permissions
   */
  const canAny = (...permissionList) => {
    return permissionList.some((permission) => can(permission));
  };

  /**
   * Check if user can perform all of the listed permissions
   */
  const canAll = (...permissionList) => {
    return permissionList.every((permission) => can(permission));
  };

  return {
    // User data
    user,
    role,
    metadata,
    loading,
    error,

    // Auth methods
    login,
    register,
    logout,

    // Role checks (computed values)
    hasRole,
    isAdmin: role === 'admin',
    isProfessional: role === 'profissional',
    isClient: role === 'cliente',
    isAuthenticated: !!user,

    // Permission checks
    permissions,
    can,
    canAny,
    canAll,
  };
};
