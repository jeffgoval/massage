import { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
  Send,
  Paperclip,
  Search,
  MoreVertical,
  Phone,
  Video,
  Star,
  Check,
  CheckCheck,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../store/chatStore.js';

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const messages = useChatStore((s) => s.messages);
  const subscribe = useChatStore((s) => s.subscribe);

  useEffect(() => {
    const unsub = subscribe();
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [subscribe]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat]);

  // Mock data - substituir por dados reais
  const conversations = [
    {
      id: 1,
      name: 'Isabella Santos',
      avatar: null,
      lastMessage: 'Obrigada pelo contato! Quando gostaria de agendar?',
      timestamp: '10:30',
      unread: 2,
      online: true,
      vip: true,
    },
    {
      id: 2,
      name: 'Larissa Oliveira',
      avatar: null,
      lastMessage: 'Perfeito! Te espero então 😊',
      timestamp: 'Ontem',
      unread: 0,
      online: false,
      vip: true,
    },
    {
      id: 3,
      name: 'Camila Alves',
      avatar: null,
      lastMessage: 'Oi! Tudo bem? Estou disponível hoje à noite',
      timestamp: 'Ontem',
      unread: 0,
      online: true,
      vip: true,
    },
    {
      id: 4,
      name: 'Amanda Costa',
      avatar: null,
      lastMessage: 'Você visualizou a mensagem anterior?',
      timestamp: '2 dias',
      unread: 1,
      online: false,
      vip: false,
    },
    {
      id: 5,
      name: 'Gabriela Ferreira',
      avatar: null,
      lastMessage: 'Ok, combinado!',
      timestamp: '3 dias',
      unread: 0,
      online: false,
      vip: true,
    },
  ];

  const chatMessages = [
    {
      id: 1,
      senderId: 1,
      content: 'Olá! Tudo bem?',
      timestamp: '10:20',
      read: true,
      isMine: false,
    },
    {
      id: 2,
      senderId: 'me',
      content: 'Oi! Sim, tudo ótimo. Gostaria de agendar uma sessão para amanhã',
      timestamp: '10:22',
      read: true,
      isMine: true,
    },
    {
      id: 3,
      senderId: 1,
      content: 'Que bom! Qual horário você prefere?',
      timestamp: '10:23',
      read: true,
      isMine: false,
    },
    {
      id: 4,
      senderId: 'me',
      content: 'Por volta das 19h seria perfeito',
      timestamp: '10:25',
      read: true,
      isMine: true,
    },
    {
      id: 5,
      senderId: 1,
      content: 'Perfeito! 19h está confirmado então. Te envio o endereço por aqui mesmo 😊',
      timestamp: '10:30',
      read: false,
      isMine: false,
    },
  ];

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedChat(null);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Implementar envio de mensagem
      console.log('Enviando:', message);
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
                {filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    whileHover={{ x: 4 }}
                    onClick={() => handleSelectChat(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat?.id === conversation.id
                        ? 'bg-crimson-600/20 border border-crimson-600/40'
                        : 'bg-black/30 border border-crimson-600/20 hover:bg-black/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-dark border-2 border-gold-500/50 flex items-center justify-center text-2xl overflow-hidden">
                          {conversation.avatar ? (
                            <img
                              src={conversation.avatar}
                              alt={conversation.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gold-500/50">👤</span>
                          )}
                        </div>
                        {/* Online status */}
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-luxury-black" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-sm font-light text-luxury-light truncate">
                              {conversation.name}
                            </h3>
                            {conversation.vip && (
                              <Star className="w-3 h-3 text-gold-500 fill-current" />
                            )}
                          </div>
                          <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400 truncate flex-1">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-crimson-600 text-white text-xs font-semibold">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
                            {selectedChat.avatar ? (
                              <img
                                src={selectedChat.avatar}
                                alt={selectedChat.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gold-500/50">👤</span>
                            )}
                          </div>
                          {selectedChat.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-luxury-black" />
                          )}
                        </div>

                        {/* Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg font-light text-luxury-light">
                              {selectedChat.name}
                            </h3>
                            {selectedChat.vip && (
                              <Badge variant="vip" icon="⭐" className="text-xs">
                                VIP
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            {selectedChat.online ? 'Online' : 'Offline'}
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
                    <AnimatePresence>
                      {chatMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] ${
                              msg.isMine
                                ? 'bg-gradient-to-r from-crimson-600 to-crimson-500'
                                : 'bg-black/50 border border-crimson-600/20'
                            } rounded-lg px-4 py-2.5`}
                          >
                            <p className="text-luxury-light text-sm leading-relaxed">
                              {msg.content}
                            </p>
                            <div
                              className={`flex items-center gap-1 mt-1 ${
                                msg.isMine ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <span className="text-xs text-gray-300">{msg.timestamp}</span>
                              {msg.isMine && (
                                <>
                                  {msg.read ? (
                                    <CheckCheck className="w-3 h-3 text-blue-400" />
                                  ) : (
                                    <Check className="w-3 h-3 text-gray-300" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-black/50 border border-crimson-600/20 rounded-lg px-4 py-3 flex items-center gap-2">
                          <div className="flex gap-1">
                            <span
                              className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"
                              style={{ animationDelay: '0ms' }}
                            />
                            <span
                              className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"
                              style={{ animationDelay: '150ms' }}
                            />
                            <span
                              className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"
                              style={{ animationDelay: '300ms' }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">digitando...</span>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="pt-4 border-t border-crimson-600/30">
                    <div className="flex items-end gap-2">
                      <button className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors flex-shrink-0">
                        <Paperclip className="w-5 h-5 text-gray-400" />
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
