import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Booking() {
  const { id } = useParams();
  const schema = z.object({
    date: z.string().min(1, 'Selecione a data'),
    time: z.string().min(1, 'Selecione a hora'),
    notes: z.string().max(500).optional(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = () => {};
  return (
    <Card hover={false}>
      <h1 className="font-display text-2xl text-gold-500 mb-4">Agendamento</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm">Data</label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30"
              {...register('date')}
            />
            {errors.date && (
              <div className="text-sm text-crimson-500 mt-1">{errors.date.message}</div>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm">Hora</label>
            <input
              type="time"
              className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30"
              {...register('time')}
            />
            {errors.time && (
              <div className="text-sm text-crimson-500 mt-1">{errors.time.message}</div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm">Pedidos Especiais</label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30"
              {...register('notes')}
            />
          </div>
        </div>
        <Button className="mt-6" type="submit">
          Confirmar
        </Button>
      </form>
    </Card>
  );
}
