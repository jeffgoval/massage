import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/authStore.js';
import { Button } from '../../components/ui/Button.jsx';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const login = useAuthStore((s) => s.login);
  const onSubmit = async (data) => { await login(data.email, data.password); };
  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-6">Entrar</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30" placeholder="Email" {...register('email')} />
        {errors.email && <div className="text-sm text-crimson-500">{errors.email.message}</div>}
        <input type="password" className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30" placeholder="Senha" {...register('password')} />
        {errors.password && <div className="text-sm text-crimson-500">{errors.password.message}</div>}
        <Button className="w-full" type="submit">Entrar</Button>
      </form>
    </div>
  );
}


