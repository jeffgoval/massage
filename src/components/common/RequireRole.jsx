import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Route protection component that requires specific role(s)
 * @param {Array<string>} roles - Required roles (user must have at least one)
 * @param {React.ReactNode} children - Protected content
 * @param {string} redirectTo - Where to redirect if unauthorized
 */
export default function RequireRole({ roles = [], children, redirectTo = '/' }) {
  const { role, loading, isAuthenticated } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-luxury-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-luxury-light font-body">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const hasRequiredRole = roles.length === 0 || roles.includes(role);

  // Redirect if unauthorized
  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render protected content
  return children;
}
