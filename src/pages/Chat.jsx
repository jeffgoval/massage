import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
  Send,
  Smile,
  Search,
  MoreVertical,
  Phone,
  Video,
  Star,
  Check,
  CheckCheck,
  ArrowLeft,
  MessageCircle,
  Loader,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { useChatStore } from '../store/chatStore.js';
import { useAuth } from '../hooks/useAuth.js';
import { db } from '../services/database.js';

export default function Chat() {
  const [searchParams] = useSearchParams();
  const tenantIdParam = searchParams.get('tenantId');

  const { user, role } = useAuth();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [tenantData, setTenantData] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const {
    chats,
    messages,
    selectedChat,
    loading,
    loadChats,
    loadMessages,
    sendMessage: sendChatMessage,
    getOrCreateChat,
    selectChat,
    subscribeToChat,
    subscribeToChats,
    markChatAsRead,
    cleanup,
  } = useChatStore();

  // Initialize: Load chats and subscribe
  useEffect(() => {
    if (!user || !role) return;

    loadChats(user.$id, role);
    const unsub = subscribeToChats(user.$id, role);

    return () => {
      cleanup();
    };
  }, [user, role]);

  // If tenantId in URL, create/open chat with that tenant
  useEffect(() => {
    if (tenantIdParam && user) {
      getOrCreateChat(user.$id, tenantIdParam).then((chat) => {
        handleSelectChat(chat);
      });
    }
  }, [tenantIdParam, user]);

  // Load tenant data for all chats
  useEffect(() => {
    const loadTenantData = async () => {
      for (const chat of chats) {
        const tenantId = chat.tenant_id;
        if (!tenantData[tenantId]) {
          try {
            const tenant = await db.getTenant(tenantId);
            setTenantData((prev) => {
              // Avoid setting if already exists (prevents loops)
              if (prev[tenantId]) return prev;
              return { ...prev, [tenantId]: tenant };
            });
          } catch (error) {
            console.error('Error loading tenant:', error);
          }
        }
      }
    };

    if (chats.length > 0) {
      loadTenantData();
    }
  }, [chats.length]); // Only trigger when number of chats changes

  // Subscribe to selected chat messages
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.$id);
      const unsub = subscribeToChat(selectedChat.$id);

      // Mark as read
      markChatAsRead(selectedChat.$id, user.$id);

      return () => {
        if (unsub) unsub();
      };
    }
  }, [selectedChat?.$id]);

  // Scroll to bottom when messages change (but only on new messages)
  useEffect(() => {
    if (messages.length > 0) {
      // Use timeout to avoid scroll loop
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]); // Only trigger on length change, not on message updates

  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const tenant = tenantData[chat.tenant_id];
      if (!tenant) return false;
      return tenant.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [chats, tenantData, searchQuery]);

  const handleSelectChat = (chat) => {
    selectChat(chat);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    selectChat(null);
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedChat) {
      try {
        await sendChatMessage(
          selectedChat.$id,
          selectedChat.tenant_id,
          user.$id,
          message.trim()
        );
        setMessage('');
        inputRef.current?.focus();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 48) {
      return 'Ontem';
    } else {
      const days = Math.floor(hours / 24);
      return `${days} dias`;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <p className="text-luxury-light">Você precisa estar logado para acessar o chat.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black pb-20 md:pb-8">
      <div className="container mx-auto px-4 lg:px-8 py-6 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Lista de Conversas */}
          <div
            className={`lg:col-span-1 ${showMobileChat ? 'hidden lg:block' : 'block'}`}
          >
            <Card hover={false} className="h-full flex flex-col">
              {/* Header */}
              <div className="pb-4 border-b border-crimson-600/30">
                <h2 className="font-display text-2xl font-light text-luxury-light mb-4">
                  Mensagens
                </h2>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar conversa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light text-sm placeholder:text-gray-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto mt-4 space-y-2">
                {loading && chats.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 text-gold-500 animate-spin" />
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">
                      {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                    </p>
                  </div>
                ) : (
                  filteredChats.map((chat) => {
                    const tenant = tenantData[chat.tenant_id];
                    if (!tenant) return null;

                    return (
                      <motion.div
                        key={chat.$id}
                        whileHover={{ x: 4 }}
                        onClick={() => handleSelectChat(chat)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedChat?.$id === chat.$id
                            ? 'bg-crimson-600/20 border border-crimson-600/40'
                            : 'bg-black/30 border border-crimson-600/20 hover:bg-black/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-dark border-2 border-gold-500/50 flex items-center justify-center text-2xl overflow-hidden">
                              {tenant.avatar ? (
                                <img
                                  src={tenant.avatar}
                                  alt={tenant.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-gold-500/50">👤</span>
                              )}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-display text-sm font-light text-luxury-light truncate">
                                  {tenant.name}
                                </h3>
                                {tenant.isVip && (
                                  <Star className="w-3 h-3 text-gold-500 fill-current" />
                                )}
                              </div>
                              <span className="text-xs text-gray-400">
                                {formatTimestamp(chat.lastMessageTime)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-400 truncate flex-1">
                                {chat.lastMessage || 'Nenhuma mensagem ainda'}
                              </p>
                              {chat.unreadCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-crimson-600 text-white text-xs font-semibold">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Chat Window */}
          <div
            className={`lg:col-span-2 ${showMobileChat ? 'block' : 'hidden lg:block'}`}
          >
            <Card hover={false} className="h-full flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="pb-4 border-b border-crimson-600/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Back button (mobile) */}
                        <button
                          onClick={handleBackToList}
                          className="lg:hidden w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4 text-luxury-light" />
                        </button>

                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-dark border-2 border-gold-500/50 flex items-center justify-center text-2xl overflow-hidden">
                            {tenantData[selectedChat.tenant_id]?.avatar ? (
                              <img
                                src={tenantData[selectedChat.tenant_id].avatar}
                                alt={tenantData[selectedChat.tenant_id]?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gold-500/50">👤</span>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg font-light text-luxury-light">
                              {tenantData[selectedChat.tenant_id]?.name || 'Carregando...'}
                            </h3>
                            {tenantData[selectedChat.tenant_id]?.isVip && (
                              <Badge variant="vip" icon="⭐" className="text-xs">
                                VIP
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            {tenantData[selectedChat.tenant_id]?.location || ''}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors">
                          <Phone className="w-4 h-4 text-luxury-light" />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors">
                          <Video className="w-4 h-4 text-luxury-light" />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors">
                          <MoreVertical className="w-4 h-4 text-luxury-light" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {loading && messages.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader className="w-6 h-6 text-gold-500 animate-spin" />
                      </div>
                    ) : (
                      <AnimatePresence>
                        {messages.map((msg) => {
                          const isMine = msg.sender_id === user.$id;
                          return (
                            <motion.div
                              key={msg.$id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] ${
                                  isMine
                                    ? 'bg-gradient-to-r from-crimson-600 to-crimson-500'
                                    : 'bg-black/50 border border-crimson-600/20'
                                } rounded-lg px-4 py-2.5`}
                              >
                                <p className="text-luxury-light text-sm leading-relaxed">
                                  {msg.content}
                                </p>
                                <div
                                  className={`flex items-center gap-1 mt-1 ${
                                    isMine ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  <span className="text-xs text-gray-300">
                                    {formatTimestamp(msg.createdAt)}
                                  </span>
                                  {isMine && (
                                    <>
                                      {msg.isRead ? (
                                        <CheckCheck className="w-3 h-3 text-blue-400" />
                                      ) : (
                                        <Check className="w-3 h-3 text-gray-300" />
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="pt-4 border-t border-crimson-600/30">
                    {/* Emoji Picker */}
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div
                          ref={emojiPickerRef}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="mb-3"
                        >
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            theme="dark"
                            width="100%"
                            height={400}
                            searchPlaceHolder="Buscar emoji..."
                            previewConfig={{ showPreview: false }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-end gap-2">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                          showEmojiPicker
                            ? 'bg-gold-500/20 text-gold-500'
                            : 'bg-black/30 text-gray-400 hover:bg-black/50'
                        }`}
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        <textarea
                          ref={inputRef}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Digite sua mensagem..."
                          rows={1}
                          className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light placeholder:text-gray-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all resize-none"
                          style={{
                            minHeight: '44px',
                            maxHeight: '120px',
                          }}
                        />
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-crimson-600 to-crimson-500 flex items-center justify-center hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                      >
                        <Send className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Empty State
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-gold/10 flex items-center justify-center mb-4">
                    <MessageCircle className="w-10 h-10 text-gold-500/50" />
                  </div>
                  <h3 className="font-display text-2xl font-light text-luxury-light mb-2">
                    Selecione uma Conversa
                  </h3>
                  <p className="text-gray-400 max-w-md">
                    Escolha uma conversa na lista ao lado para começar a trocar mensagens
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
