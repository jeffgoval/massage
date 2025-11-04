import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { USER_ROLE_NAMES } from '../../utils/constants.js';
import { LogOut, UserCircle, Briefcase, Shield } from 'lucide-react';

const roleIcons = {
  cliente: UserCircle,
  profissional: Briefcase,
  admin: Shield,
};

export default function Header() {
  const navigate = useNavigate();
  const { user, role, isAuthenticated, isProfessional, isAdmin, logout } = useAuth();

  const RoleIcon = role ? roleIcons[role] : UserCircle;

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
              <Link to="/chat" className="hover:opacity-80 transition-opacity">
                Chat
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
