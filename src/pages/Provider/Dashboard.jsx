import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function ProviderDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Meu Painel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-gray-400">Satisfação</div>
          <div className="text-3xl text-gold-500">100%</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-400">Agendamentos</div>
          <div className="text-3xl text-gold-500">12</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-400">Disponível</div>
          <div className="text-3xl text-gold-500">Sim</div>
        </Card>
      </div>
      <Card>
        <h2 className="font-display text-2xl text-gold-500 mb-4">Disponibilidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30">
            <option>Disponível</option>
            <option>Ocupada</option>
          </select>
          <Button className="w-full md:w-auto">Salvar</Button>
        </div>
      </Card>
    </div>
  );
}
