import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { Button } from '../../components/ui/Button.jsx';
import { USER_ROLES, USER_ROLE_NAMES, USER_ROLE_DESCRIPTIONS } from '../../utils/constants.js';
import { UserCircle, Briefcase, Shield, CheckCircle } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum([USER_ROLES.CLIENTE, USER_ROLES.PROFISSIONAL, USER_ROLES.ADMIN]),
});

const roleIcons = {
  [USER_ROLES.CLIENTE]: UserCircle,
  [USER_ROLES.PROFISSIONAL]: Briefcase,
  [USER_ROLES.ADMIN]: Shield,
};

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.CLIENTE);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: USER_ROLES.CLIENTE,
    },
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await registerUser(data.email, data.password, data.name, data.role);

      // Get role from store after register
      const currentRole = useAuthStore.getState().role;

      // Redirect based on role
      if (currentRole === 'profissional' || currentRole === 'admin') {
        navigate('/provider');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);

      // Handle specific Appwrite errors
      if (err.message?.includes('already exists')) {
        setError('Este email já está cadastrado. Faça login ou use outro email.');
      } else if (err.code === 409) {
        setError('Este email já está cadastrado. Faça login ou use outro email.');
      } else if (err.message?.includes('Invalid email')) {
        setError('Email inválido. Verifique e tente novamente.');
      } else if (err.message?.includes('Password')) {
        setError('A senha deve ter pelo menos 8 caracteres.');
      } else {
        setError(err.message || 'Erro ao criar conta. Tente novamente.');
      }
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-light text-luxury-light tracking-wide mb-2">
          Criar Conta
        </h1>
        <p className="text-gray-400 font-body">
          Preencha os dados abaixo para começar
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block mb-3 text-luxury-light font-body text-sm font-medium">
            Tipo de Conta
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <button
              type="button"
              onClick={() => handleRoleSelect(USER_ROLES.CLIENTE)}
              className={`
                relative p-6 rounded-luxury border-2 transition-all duration-300
                ${
                  selectedRole === USER_ROLES.CLIENTE
                    ? 'border-gold-500 bg-gold-500/10'
                    : 'border-crimson-600/30 bg-luxury-charcoal/50 hover:border-gold-500/50'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${
                    selectedRole === USER_ROLES.CLIENTE
                      ? 'bg-gold-500 text-black'
                      : 'bg-luxury-gray text-gold-500'
                  }
                `}
                >
                  <UserCircle className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-display text-luxury-light mb-1">
                    {USER_ROLE_NAMES[USER_ROLES.CLIENTE]}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {USER_ROLE_DESCRIPTIONS[USER_ROLES.CLIENTE]}
                  </p>
                </div>
                {selectedRole === USER_ROLES.CLIENTE && (
                  <CheckCircle className="w-5 h-5 text-gold-500 absolute top-4 right-4" />
                )}
              </div>
            </button>

            {/* Profissional */}
            <button
              type="button"
              onClick={() => handleRoleSelect(USER_ROLES.PROFISSIONAL)}
              className={`
                relative p-6 rounded-luxury border-2 transition-all duration-300
                ${
                  selectedRole === USER_ROLES.PROFISSIONAL
                    ? 'border-gold-500 bg-gold-500/10'
                    : 'border-crimson-600/30 bg-luxury-charcoal/50 hover:border-gold-500/50'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${
                    selectedRole === USER_ROLES.PROFISSIONAL
                      ? 'bg-gold-500 text-black'
                      : 'bg-luxury-gray text-gold-500'
                  }
                `}
                >
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-display text-luxury-light mb-1">
                    {USER_ROLE_NAMES[USER_ROLES.PROFISSIONAL]}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {USER_ROLE_DESCRIPTIONS[USER_ROLES.PROFISSIONAL]}
                  </p>
                </div>
                {selectedRole === USER_ROLES.PROFISSIONAL && (
                  <CheckCircle className="w-5 h-5 text-gold-500 absolute top-4 right-4" />
                )}
              </div>
            </button>
          </div>
          <input type="hidden" {...register('role')} />
        </div>

        {/* Name Input */}
        <div>
          <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
            Nome Completo
          </label>
          <input
            className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body placeholder:text-gray-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
            placeholder="Digite seu nome completo"
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-sm text-crimson-500">{errors.name.message}</p>}
        </div>

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
            placeholder="Mínimo 6 caracteres"
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
            {error.includes('já está cadastrado') && (
              <Link
                to="/login"
                className="text-sm text-gold-500 hover:text-gold-400 mt-2 inline-block"
              >
                Ir para login →
              </Link>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </Button>

        {/* Login Link */}
        <p className="text-center text-gray-400 text-sm">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-gold-500 hover:text-gold-400 transition-colors">
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
}
