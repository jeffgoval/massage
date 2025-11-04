import { create } from 'zustand';
import client from '../services/appwrite.js';

export const useChatStore = create((set, get) => ({
  messages: [],
  subscribe() {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const messagesId = import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID;
    const unsub = client.subscribe(`databases.${databaseId}.collections.${messagesId}.documents`, (res) => {
      const msg = res?.payload;
      if (msg) set({ messages: [...get().messages, msg] });
    });
    return unsub;
  }
}));


