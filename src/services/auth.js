import { account } from './appwrite.js';

export const authService = {
  async register(email, password, name) {
    return await account.create('unique()', email, password, name);
  },
  async login(email, password) {
    return await account.createEmailSession(email, password);
  },
  async logout() {
    return await account.deleteSession('current');
  },
  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },
  async sendVerification() {
    return await account.createVerification(`${window.location.origin}/verify`);
  },
};
