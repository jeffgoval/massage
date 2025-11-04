import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { USER_ROLE_NAMES } from '../../utils/constants.js';
import { LogOut, UserCircle, Briefcase, Shield } from 'lucide-react';
import client, { databases, Query } from '../../services/appwrite.js';
import { DB_IDS } from '../../services/database.js';

const roleIcons = {
  cliente: UserCircle,
  profissional: Briefcase,
  admin: Shield,
};

export default function Header() {
  const navigate = useNavigate();
  const { user, role, isAuthenticated, isProfessional, isAdmin, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const RoleIcon = role ? roleIcons[role] : UserCircle;

  // Load unread messages count for clients (real-time updates)
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!user || !isAuthenticated || role !== 'cliente') return;

      try {
        // Get all chats for this client
        const chatsResponse = await databases.listDocuments(
          DB_IDS.databaseId,
          DB_IDS.chats,
          [Query.equal('client_id', user.$id)]
        );

        // Count chats with unread messages
        let count = 0;
        for (const chat of chatsResponse.documents) {
          const unreadMessages = await databases.listDocuments(
            DB_IDS.databaseId,
            DB_IDS.messages,
            [
              Query.equal('chat_id', chat.$id),
              Query.equal('isRead', false),
              Query.notEqual('sender_id', user.$id),
              Query.limit(1),
            ]
          );
          if (unreadMessages.total > 0) {
            count++;
          }
        }
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };

    loadUnreadCount();

    // Subscribe to message updates to refresh count in real-time
    if (user && isAuthenticated && role === 'cliente') {
      const channel = `databases.${DB_IDS.databaseId}.collections.${DB_IDS.messages}.documents`;
      const unsubscribe = client.subscribe(channel, (response) => {
        // When a message is created or updated, reload count
        if (response.events.some(event => event.includes('.create') || event.includes('.update'))) {
          loadUnreadCount();
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user, isAuthenticated, role]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-primary text-white">
      <div className="container py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl font-light tracking-wider hover:opacity-90">
          Premium
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/search" className="hover:opacity-80 transition-opacity">
            Buscar
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/chat" className="hover:opacity-80 transition-opacity relative">
                Chat
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-3 w-5 h-5 bg-crimson-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Provider Dashboard Link */}
              {(isProfessional || isAdmin) && (
                <Link to="/provider" className="hover:opacity-80 transition-opacity">
                  Dashboard
                </Link>
              )}
            </>
          )}

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
              {/* User Info */}
              <div className="flex items-center gap-2">
                <RoleIcon className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs opacity-80">{USER_ROLE_NAMES[role]}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-4">
              <Link
                to="/login"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors font-medium"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu - Simplified */}
        <div className="md:hidden flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <RoleIcon className="w-5 h-5" />
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors text-sm font-medium"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
