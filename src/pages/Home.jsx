import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-gradient-dark rounded-luxury p-8 shadow-luxury border border-crimson-600/30">
        <h1 className="font-display text-4xl font-light tracking-wide text-luxury-light mb-2">
          Experiências Exclusivas
        </h1>
        <p className="text-gray-400 mb-6">
          Busque profissionais premium e agende sua sessão com discrição.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/search">
            <Button>Buscar Agora</Button>
          </Link>
          <Button variant="gold">Acesso VIP</Button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-gold-500 mb-4">Profissionais Disponíveis</h2>
        <div className="text-center py-8 bg-black/30 rounded-lg border border-crimson-600/20">
          <p className="text-gray-400 mb-4">Navegue pela lista de profissionais</p>
          <Link to="/search">
            <Button>Ver Todos os Perfis</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
