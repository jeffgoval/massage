import { Input } from '../components/ui/Input.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';

export default function Search() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <Card hover={false}>
          <h3 className="font-display text-xl text-gold-500 mb-4">Filtros</h3>
          <Input label="Localização" placeholder="Bairro ou região" />
          <div className="mb-6">
            <label className="block mb-2 text-sm">Investimento</label>
            <select className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light">
              <option>Qualquer</option>
              <option>Até R$ 400</option>
              <option>R$ 400 - R$ 700</option>
              <option>R$ 700 - R$ 1.000</option>
              <option>Acima de R$ 1.000</option>
            </select>
          </div>
          <Button variant="gold" className="w-full">Aplicar</Button>
        </Card>
      </aside>
      <section className="lg:col-span-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i}>
              <div className="h-40 rounded-lg bg-luxury-gray/30 mb-4" />
              <div className="text-lg">Perfil #{i + 1}</div>
              <div className="text-sm text-gray-400">⭐ 4.{i % 5} · {(i+1)*3} avaliações</div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}


