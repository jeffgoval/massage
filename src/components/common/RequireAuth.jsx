import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useEffect } from 'react';

export default function RequireAuth({ children }) {
  const { user, loading, init } = useAuthStore();
  const location = useLocation();
  useEffect(() => {
    init();
  }, [init]);
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
