import { create } from 'zustand';
import { authService } from '../services/auth.js';

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  async init() {
    set({ loading: true });
    const user = await authService.getCurrentUser();
    set({ user, loading: false });
  },
  async login(email, password) {
    await authService.login(email, password);
    const user = await authService.getCurrentUser();
    set({ user });
  },
  async logout() {
    await authService.logout();
    set({ user: null });
  },
}));


