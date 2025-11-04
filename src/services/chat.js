import { databases, Query } from './appwrite.js';
import client from './appwrite.js';
import { db, DB_IDS } from './database.js';
import { ID } from 'appwrite';

/**
 * Chat Service with Real-time support
 */
export const chatService = {
  /**
   * Get or create a chat between client and tenant
   */
  async getOrCreateChat(clientId, tenantId) {
    try {
      // Try to find existing chat
      const response = await databases.listDocuments(
        DB_IDS.databaseId,
        DB_IDS.chats,
        [Query.equal('client_id', clientId), Query.equal('tenant_id', tenantId)]
      );

      if (response.documents.length > 0) {
        return response.documents[0];
      }

      // Create new chat
      try {
        return await databases.createDocument(DB_IDS.databaseId, DB_IDS.chats, ID.unique(), {
          client_id: clientId,
          tenant_id: tenantId,
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          createdAt: new Date().toISOString(),
        });
      } catch (createError) {
        // If duplicate (409 Conflict), fetch the existing chat
        if (createError.code === 409) {
          console.log('Chat já existe (conflito detectado), buscando...');
          const retryResponse = await databases.listDocuments(
            DB_IDS.databaseId,
            DB_IDS.chats,
            [Query.equal('client_id', clientId), Query.equal('tenant_id', tenantId)]
          );
          if (retryResponse.documents.length > 0) {
            return retryResponse.documents[0];
          }
        }
        throw createError;
      }
    } catch (error) {
      console.error('Error getting/creating chat:', error);
      throw error;
    }
  },

  /**
   * Get all chats for a user (client or tenant)
   */
  async getChatsForUser(userId, userRole) {
    try {
      const queryField = userRole === 'profissional' ? 'tenant_id' : 'client_id';

      return await databases.listDocuments(DB_IDS.databaseId, DB_IDS.chats, [
        Query.equal(queryField, userId),
        Query.orderDesc('lastMessageTime'),
      ]);
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },

  /**
   * Get messages for a chat
   */
  async getMessages(chatId, limit = 50, offset = 0) {
    try {
      return await databases.listDocuments(DB_IDS.databaseId, DB_IDS.messages, [
        Query.equal('chat_id', chatId),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
        Query.offset(offset),
      ]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  /**
   * Send a message
   */
  async sendMessage(chatId, tenantId, senderId, content, type = 'text') {
    try {
      // Create message
      const message = await databases.createDocument(DB_IDS.databaseId, DB_IDS.messages, ID.unique(), {
        chat_id: chatId,
        tenant_id: tenantId,
        sender_id: senderId,
        content: content,
        type: type,
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      // Update chat last message
      await databases.updateDocument(DB_IDS.databaseId, DB_IDS.chats, chatId, {
        lastMessage: content.substring(0, 100),
        lastMessageTime: new Date().toISOString(),
      });

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Mark message as read
   */
  async markAsRead(messageId) {
    try {
      return await databases.updateDocument(DB_IDS.databaseId, DB_IDS.messages, messageId, {
        isRead: true,
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  /**
   * Mark all messages in chat as read
   */
  async markChatAsRead(chatId, currentUserId) {
    try {
      // Get unread messages not sent by current user
      const messages = await databases.listDocuments(DB_IDS.databaseId, DB_IDS.messages, [
        Query.equal('chat_id', chatId),
        Query.equal('isRead', false),
        Query.notEqual('sender_id', currentUserId),
      ]);

      // Mark all as read
      await Promise.all(
        messages.documents.map((msg) =>
          databases.updateDocument(DB_IDS.databaseId, DB_IDS.messages, msg.$id, {
            isRead: true,
          })
        )
      );

      return messages.documents.length;
    } catch (error) {
      console.error('Error marking chat as read:', error);
      throw error;
    }
  },

  /**
   * Subscribe to new messages in a chat (REAL-TIME)
   */
  subscribeToChat(chatId, onNewMessage, onMessageUpdate) {
    const channel = `databases.${DB_IDS.databaseId}.collections.${DB_IDS.messages}.documents`;

    const unsubscribe = client.subscribe(channel, (response) => {
      const message = response.payload;

      // Filter by chat_id
      if (message.chat_id !== chatId) return;

      // Handle events - check if any event ends with .create or .update
      const isCreate = response.events.some(event => event.includes('.create'));
      const isUpdate = response.events.some(event => event.includes('.update'));

      if (isCreate) {
        onNewMessage && onNewMessage(message);
      }

      if (isUpdate) {
        onMessageUpdate && onMessageUpdate(message);
      }
    });

    return unsubscribe;
  },

  /**
   * Subscribe to all chats for a user (REAL-TIME)
   */
  subscribeToChats(userId, userRole, onChatUpdate) {
    const channel = `databases.${DB_IDS.databaseId}.collections.${DB_IDS.chats}.documents`;

    const unsubscribe = client.subscribe(channel, (response) => {
      const chat = response.payload;

      // Filter by user
      const isUserChat =
        userRole === 'profissional'
          ? chat.tenant_id === userId
          : chat.client_id === userId;

      if (!isUserChat) return;

      onChatUpdate && onChatUpdate(chat);
    });

    return unsubscribe;
  },

  /**
   * Get unread count for a chat
   */
  async getUnreadCount(chatId, currentUserId) {
    try {
      const response = await databases.listDocuments(DB_IDS.databaseId, DB_IDS.messages, [
        Query.equal('chat_id', chatId),
        Query.equal('isRead', false),
        Query.notEqual('sender_id', currentUserId),
      ]);

      return response.total;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  /**
   * Delete a message (soft delete)
   */
  async deleteMessage(messageId) {
    try {
      return await databases.deleteDocument(DB_IDS.databaseId, DB_IDS.messages, messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },
};
