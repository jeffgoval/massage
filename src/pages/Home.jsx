import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-gradient-dark rounded-luxury p-8 shadow-luxury border border-crimson-600/30">
        <h1 className="font-display text-4xl font-light tracking-wide text-luxury-light mb-2">Experiências Exclusivas</h1>
        <p className="text-gray-400 mb-6">Busque profissionais premium e agende sua sessão com discrição.</p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/search"><Button>Buscar Agora</Button></Link>
          <Button variant="gold">Acesso VIP</Button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-gold-500 mb-4">Mais Procuradas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <Card key={i}>
              <div className="h-40 rounded-lg bg-luxury-gray/30 mb-4" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg">Isabella</div>
                  <div className="text-sm text-gray-400">⭐ 5.0 · 89 avaliações</div>
                </div>
                <Link to="/profile/1"><Button className="px-5 py-2">Ver</Button></Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}


