import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { Button } from '../../components/ui/Button.jsx';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, role } = useAuthStore();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data.email, data.password);

      // Get role from store after login
      const currentRole = useAuthStore.getState().role;

      // Redirect based on role
      if (currentRole === 'profissional' || currentRole === 'admin') {
        navigate('/provider');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Email ou senha incorretos. Tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-light text-luxury-light tracking-wide mb-2">
          Bem-vindo de Volta
        </h1>
        <p className="text-gray-400 font-body">Entre com suas credenciais</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Input */}
        <div>
          <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body placeholder:text-gray-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
            placeholder="seu@email.com"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-sm text-crimson-500">{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div>
          <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
            Senha
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body placeholder:text-gray-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
            placeholder="Digite sua senha"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-crimson-500">{errors.password.message}</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-crimson-600/20 border border-crimson-600/50">
            <p className="text-sm text-crimson-500">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>

        {/* Register Link */}
        <p className="text-center text-gray-400 text-sm">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-gold-500 hover:text-gold-400 transition-colors">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}
