import { create } from 'zustand';
import { chatService } from '../services/chat.js';

export const useChatStore = create((set, get) => ({
  // State
  chats: [],
  messages: [],
  selectedChat: null,
  loading: false,
  error: null,
  unsubscribeChat: null,
  unsubscribeChats: null,

  // Load all chats for current user
  async loadChats(userId, userRole) {
    set({ loading: true, error: null });
    try {
      const response = await chatService.getChatsForUser(userId, userRole);
      set({ chats: response.documents, loading: false });
    } catch (error) {
      console.error('Error loading chats:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Load messages for a specific chat
  async loadMessages(chatId) {
    set({ loading: true, error: null });
    try {
      const response = await chatService.getMessages(chatId);
      // Reverse to show oldest first
      set({ messages: response.documents.reverse(), loading: false });
    } catch (error) {
      console.error('Error loading messages:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Send a message
  async sendMessage(chatId, tenantId, senderId, content, type = 'text') {
    try {
      const message = await chatService.sendMessage(chatId, tenantId, senderId, content, type);
      // Message will be added via real-time subscription
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      set({ error: error.message });
      throw error;
    }
  },

  // Get or create chat with a tenant
  async getOrCreateChat(clientId, tenantId) {
    set({ loading: true, error: null });
    try {
      const chat = await chatService.getOrCreateChat(clientId, tenantId);

      // Add to chats if not exists
      const existingChat = get().chats.find((c) => c.$id === chat.$id);
      if (!existingChat) {
        set({ chats: [chat, ...get().chats] });
      }

      set({ selectedChat: chat, loading: false });
      return chat;
    } catch (error) {
      console.error('Error getting/creating chat:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Mark chat as read
  async markChatAsRead(chatId, currentUserId) {
    try {
      await chatService.markChatAsRead(chatId, currentUserId);
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  },

  // Subscribe to chat messages (real-time)
  subscribeToChat(chatId) {
    // Unsubscribe from previous chat if any
    const prevUnsub = get().unsubscribeChat;
    if (prevUnsub) prevUnsub();

    const unsubscribe = chatService.subscribeToChat(
      chatId,
      // On new message
      (newMessage) => {
        set({ messages: [...get().messages, newMessage] });
      },
      // On message update
      (updatedMessage) => {
        set({
          messages: get().messages.map((msg) =>
            msg.$id === updatedMessage.$id ? updatedMessage : msg
          ),
        });
      }
    );

    set({ unsubscribeChat: unsubscribe });
    return unsubscribe;
  },

  // Subscribe to all chats (real-time)
  subscribeToChats(userId, userRole) {
    const unsubscribe = chatService.subscribeToChats(userId, userRole, (updatedChat) => {
      set({
        chats: get().chats.map((chat) =>
          chat.$id === updatedChat.$id ? updatedChat : chat
        ),
      });
    });

    set({ unsubscribeChats: unsubscribe });
    return unsubscribe;
  },

  // Select a chat
  selectChat(chat) {
    set({ selectedChat: chat, messages: [] });
  },

  // Cleanup subscriptions
  cleanup() {
    const { unsubscribeChat, unsubscribeChats } = get();
    if (unsubscribeChat) unsubscribeChat();
    if (unsubscribeChats) unsubscribeChats();
    set({ unsubscribeChat: null, unsubscribeChats: null });
  },
}));
