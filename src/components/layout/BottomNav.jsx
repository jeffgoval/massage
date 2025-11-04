import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const { pathname } = useLocation();
  const item = (to, label) => (
    <Link
      to={to}
      className={`flex-1 text-center ${pathname === to ? 'text-gold-500' : 'text-luxury-light'} hover:text-gold-500`}
    >
      {label}
    </Link>
  );
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-luxury-charcoal/95 backdrop-blur-lg border-t border-crimson-600/30">
      <div className="flex justify-around items-center h-14 text-sm">
        {item('/', 'Home')}
        {item('/search', 'Buscar')}
        {item('/chat', 'Chat')}
      </div>
    </nav>
  );
}
