import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
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
import ProviderDashboard from './pages/Provider/Dashboard.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-luxury-black">
        <Header />
        <main className="flex-1 container py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
                  <Booking />
                </RequireAuth>
              }
            />
            <Route
              path="/provider"
              element={
                <RequireAuth>
                  <ProviderDashboard />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
