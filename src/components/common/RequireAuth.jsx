import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export default function RequireAuth({ children }) {
  const { user, loading, init } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    init();
  }, [init]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected content
  return children;
}
