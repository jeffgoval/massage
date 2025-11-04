export default function Footer() {
  return (
    <footer className="mt-10 border-t border-crimson-600/30">
      <div className="container py-6 text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} Premium Massage</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gold-500">
            Privacidade
          </a>
          <a href="#" className="hover:text-gold-500">
            Termos
          </a>
        </div>
      </div>
    </footer>
  );
}
