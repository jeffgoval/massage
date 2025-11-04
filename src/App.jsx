import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import { ToastProvider } from './components/ui/Toast.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Profile from './pages/Profile.jsx';
import Chat from './pages/Chat.jsx';
import Booking from './pages/Booking.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import BottomNav from './components/layout/BottomNav.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import RequireAuth from './components/common/RequireAuth.jsx';
import RequireRole from './components/common/RequireRole.jsx';
import ProviderDashboard from './pages/Provider/Dashboard.jsx';
import { USER_ROLES } from './utils/constants.js';

export default function App() {
  const init = useAuthStore((state) => state.init);

  // Initialize auth state on app load
  useEffect(() => {
    init();
  }, [init]);

  return (
    <ToastProvider>
      <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-luxury-black">
        <Header />
        <main className="flex-1 container py-6">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes - require authentication */}
            <Route
              path="/chat"
              element={
                <RequireAuth>
                  <Chat />
                </RequireAuth>
              }
            />
            <Route
              path="/booking/:id"
              element={
                <RequireAuth>
                  <RequireRole roles={[USER_ROLES.CLIENTE, USER_ROLES.ADMIN]}>
                    <Booking />
                  </RequireRole>
                </RequireAuth>
              }
            />

            {/* Provider-only routes */}
            <Route
              path="/provider"
              element={
                <RequireAuth>
                  <RequireRole roles={[USER_ROLES.PROFISSIONAL, USER_ROLES.ADMIN]}>
                    <ProviderDashboard />
                  </RequireRole>
                </RequireAuth>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
        <BottomNav />
      </div>
    </BrowserRouter>
    </ToastProvider>
  );
}
