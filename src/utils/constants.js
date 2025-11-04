// User role constants
export const USER_ROLES = {
  CLIENTE: 'cliente',
  PROFISSIONAL: 'profissional',
  ADMIN: 'admin',
};

// User role display names
export const USER_ROLE_NAMES = {
  [USER_ROLES.CLIENTE]: 'Cliente',
  [USER_ROLES.PROFISSIONAL]: 'Profissional',
  [USER_ROLES.ADMIN]: 'Administrador',
};

// User role descriptions
export const USER_ROLE_DESCRIPTIONS = {
  [USER_ROLES.CLIENTE]: 'Busca e agenda serviços de massagem',
  [USER_ROLES.PROFISSIONAL]: 'Oferece serviços profissionais de massagem',
  [USER_ROLES.ADMIN]: 'Acesso completo para moderação e administração',
};

// Permissions by role
export const ROLE_PERMISSIONS = {
  [USER_ROLES.CLIENTE]: {
    canBook: true,
    canReview: true,
    canChat: true,
    canManageProfile: false,
    canModerate: false,
  },
  [USER_ROLES.PROFISSIONAL]: {
    canBook: false,
    canReview: false,
    canChat: true,
    canManageProfile: true,
    canModerate: false,
    canManageBookings: true,
    canManageAvailability: true,
  },
  [USER_ROLES.ADMIN]: {
    canBook: true,
    canReview: true,
    canChat: true,
    canManageProfile: true,
    canModerate: true,
    canManageUsers: true,
    canManageBookings: true,
    canManageAvailability: true,
  },
};
