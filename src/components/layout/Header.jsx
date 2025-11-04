import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gradient-primary text-white">
      <div className="container py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-light tracking-wider">
          Premium
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link to="/search" className="hover:opacity-80">
            Buscar
          </Link>
          <Link to="/chat" className="hover:opacity-80">
            Chat
          </Link>
        </nav>
      </div>
    </header>
  );
}
