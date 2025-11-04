import { create } from 'zustand';
import { authService } from '../services/auth.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  metadata: null,
  loading: true, // Start with true to prevent redirect before init completes
  error: null,
  initialized: false,

  /**
   * Initialize auth state - call this on app load
   */
  async init() {
    // Only init once
    const state = get();
    if (state.initialized) return;

    set({ loading: true, error: null });
    try {
      const data = await authService.getCurrentUserWithRole();
      if (data) {
        set({
          user: data.user,
          role: data.role,
          metadata: data.metadata,
          loading: false,
          initialized: true,
        });
      } else {
        set({ user: null, role: null, metadata: null, loading: false, initialized: true });
      }
    } catch (error) {
      console.error('Auth init error:', error);
      set({ user: null, role: null, metadata: null, loading: false, initialized: true, error: error.message });
    }
  },

  /**
   * Login user
   */
  async login(email, password) {
    set({ loading: true, error: null });
    try {
      await authService.login(email, password);
      const data = await authService.getCurrentUserWithRole();
      set({
        user: data.user,
        role: data.role,
        metadata: data.metadata,
        loading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Register new user with role
   */
  async register(email, password, name, role) {
    set({ loading: true, error: null });
    try {
      const { user } = await authService.register(email, password, name, role);
      const data = await authService.getCurrentUserWithRole();
      set({
        user: data.user,
        role: data.role,
        metadata: data.metadata,
        loading: false,
      });
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout() {
    set({ loading: true, error: null });
    try {
      await authService.logout();
      set({ user: null, role: null, metadata: null, loading: false });
    } catch (error) {
      console.error('Logout error:', error);
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Check if user has a specific role
   */
  hasRole: (role) => {
    const state = get();
    return state.role === role;
  },

  /**
   * Check if user is admin
   */
  isAdmin: () => {
    const state = get();
    return state.role === 'admin';
  },

  /**
   * Check if user is professional
   */
  isProfessional: () => {
    const state = get();
    return state.role === 'profissional';
  },

  /**
   * Check if user is client
   */
  isClient: () => {
    const state = get();
    return state.role === 'cliente';
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const state = get();
    return !!state.user;
  },
}));
