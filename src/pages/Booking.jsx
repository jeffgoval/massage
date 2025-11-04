import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
  Calendar,
  Clock,
  MapPin,
  Home,
  Building2,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Star,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: formulário, 2: confirmação

  // Mock profile data
  const profile = {
    id: 1,
    name: 'Isabella Santos',
    avatar: null,
    vip: true,
    rating: 5.0,
    reviews: 89,
    location: 'Jardins, São Paulo',
  };

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    service: '',
    duration: '2h',
    location: 'proprio',
    specialRequests: '',
  });

  const [errors, setErrors] = useState({});

  // Services disponíveis
  const services = [
    { id: 'tantric', name: 'Tantric Experience', price: 500, duration: '2h' },
    { id: 'nuru', name: 'Nuru Massage Premium', price: 400, duration: '1h30' },
    { id: 'body', name: 'Body to Body Sensual', price: 300, duration: '1h' },
    { id: 'lingam', name: 'Lingam Massage', price: 350, duration: '1h' },
  ];

  // Durations
  const durations = [
    { value: '1h', label: '1 hora' },
    { value: '1h30', label: '1h 30min' },
    { value: '2h', label: '2 horas' },
    { value: '3h', label: '3 horas' },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Selecione uma data';
    if (!formData.time) newErrors.time = 'Selecione um horário';
    if (!formData.service) newErrors.service = 'Selecione um serviço';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setStep(2);
    }
  };

  const handleConfirm = () => {
    // Implementar lógica de confirmação
    console.log('Booking confirmado:', formData);
    // Redirecionar para chat ou página de sucesso
    navigate('/chat');
  };

  // Calcular preço
  const selectedService = services.find((s) => s.id === formData.service);
  const basePrice = selectedService?.price || 0;
  const locationFee = formData.location === 'hotel' ? 100 : 0;
  const totalPrice = basePrice + locationFee;

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-luxury-black pb-20 md:pb-8">
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-[1200px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-light text-luxury-light tracking-wide mb-2">
            Agendar Sessão
          </h1>
          <p className="text-gray-400">Preencha os detalhes para confirmar seu agendamento</p>
        </div>

        {/* Profile Info Card */}
        <Card hover={false} className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-dark border-2 border-gold-500 flex items-center justify-center text-3xl overflow-hidden flex-shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gold-500/50">👤</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display text-xl font-light text-luxury-light">
                  {profile.name}
                </h3>
                {profile.vip && (
                  <Badge variant="vip" icon="⭐">
                    VIP
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-gold-500 fill-current" />
                  {profile.rating} ({profile.reviews} avaliações)
                </div>
              </div>
            </div>
          </div>
        </Card>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            // Step 1: Formulário
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Formulário */}
              <div className="lg:col-span-2">
                <Card hover={false}>
                  <h2 className="font-display text-2xl font-light text-gold-500 mb-6">
                    Detalhes do Agendamento
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Data e Hora */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-luxury-light font-body text-sm font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gold-500" />
                          Data
                        </label>
                        <input
                          type="date"
                          min={today}
                          value={formData.date}
                          onChange={(e) => handleChange('date', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg bg-luxury-black/30 border ${
                            errors.date
                              ? 'border-crimson-500'
                              : 'border-crimson-600/30'
                          } text-luxury-light font-body focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all`}
                        />
                        {errors.date && (
                          <p className="mt-1 text-sm text-crimson-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.date}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 text-luxury-light font-body text-sm font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gold-500" />
                          Horário
                        </label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) => handleChange('time', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg bg-luxury-black/30 border ${
                            errors.time
                              ? 'border-crimson-500'
                              : 'border-crimson-600/30'
                          } text-luxury-light font-body focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all`}
                        />
                        {errors.time && (
                          <p className="mt-1 text-sm text-crimson-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.time}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Serviço */}
                    <div>
                      <label className="block mb-3 text-luxury-light font-body text-sm font-medium">
                        Selecione o Serviço
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            onClick={() => handleChange('service', service.id)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.service === service.id
                                ? 'border-gold-500 bg-gold-500/10'
                                : 'border-crimson-600/30 bg-black/30 hover:border-crimson-600/50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-display text-base text-luxury-light">
                                {service.name}
                              </h4>
                              <span className="text-gold-500 font-semibold">
                                R$ {service.price}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">{service.duration}</p>
                          </div>
                        ))}
                      </div>
                      {errors.service && (
                        <p className="mt-2 text-sm text-crimson-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.service}
                        </p>
                      )}
                    </div>

                    {/* Duração */}
                    <div>
                      <label className="block mb-3 text-luxury-light font-body text-sm font-medium">
                        Duração da Sessão
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {durations.map((dur) => (
                          <button
                            key={dur.value}
                            type="button"
                            onClick={() => handleChange('duration', dur.value)}
                            className={`px-6 py-3 rounded-full font-body text-sm transition-all ${
                              formData.duration === dur.value
                                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black shadow-gold'
                                : 'bg-black/30 border border-crimson-600/30 text-luxury-light hover:border-gold-500/50'
                            }`}
                          >
                            {dur.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Local */}
                    <div>
                      <label className="block mb-3 text-luxury-light font-body text-sm font-medium">
                        Local do Atendimento
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div
                          onClick={() => handleChange('location', 'proprio')}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.location === 'proprio'
                              ? 'border-gold-500 bg-gold-500/10'
                              : 'border-crimson-600/30 bg-black/30 hover:border-crimson-600/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Home className="w-5 h-5 text-gold-500" />
                            <h4 className="font-display text-base text-luxury-light">
                              Local Próprio
                            </h4>
                          </div>
                          <p className="text-xs text-gray-400">
                            Atendimento no espaço da profissional
                          </p>
                        </div>

                        <div
                          onClick={() => handleChange('location', 'hotel')}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.location === 'hotel'
                              ? 'border-gold-500 bg-gold-500/10'
                              : 'border-crimson-600/30 bg-black/30 hover:border-crimson-600/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Building2 className="w-5 h-5 text-gold-500" />
                            <h4 className="font-display text-base text-luxury-light">
                              Hotel/Motel
                            </h4>
                          </div>
                          <p className="text-xs text-gray-400">
                            Taxa adicional de R$ 100
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pedidos Especiais */}
                    <div>
                      <label className="block mb-2 text-luxury-light font-body text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gold-500" />
                        Pedidos Especiais (Opcional)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.specialRequests}
                        onChange={(e) => handleChange('specialRequests', e.target.value)}
                        placeholder="Alguma preferência ou pedido especial para a sessão..."
                        className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body placeholder:text-gray-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all resize-none"
                        maxLength={500}
                      />
                      <p className="mt-1 text-xs text-gray-400 text-right">
                        {formData.specialRequests.length}/500
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full py-4 text-base"
                    >
                      Continuar para Resumo
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Resumo Lateral */}
              <div className="lg:col-span-1">
                <Card hover={false} className="sticky top-6">
                  <h3 className="font-display text-xl font-light text-gold-500 mb-4">
                    Resumo
                  </h3>

                  <div className="space-y-4">
                    {/* Serviço selecionado */}
                    {selectedService && (
                      <div className="pb-4 border-b border-crimson-600/30">
                        <p className="text-xs text-gray-400 mb-1">Serviço</p>
                        <p className="text-luxury-light font-medium">
                          {selectedService.name}
                        </p>
                        <p className="text-sm text-gold-500 mt-1">
                          R$ {selectedService.price}
                        </p>
                      </div>
                    )}

                    {/* Data e hora */}
                    {(formData.date || formData.time) && (
                      <div className="pb-4 border-b border-crimson-600/30">
                        <p className="text-xs text-gray-400 mb-1">Data e Horário</p>
                        {formData.date && (
                          <p className="text-luxury-light text-sm">
                            {new Date(formData.date + 'T00:00:00').toLocaleDateString(
                              'pt-BR',
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </p>
                        )}
                        {formData.time && (
                          <p className="text-luxury-light text-sm">{formData.time}</p>
                        )}
                      </div>
                    )}

                    {/* Duração */}
                    <div className="pb-4 border-b border-crimson-600/30">
                      <p className="text-xs text-gray-400 mb-1">Duração</p>
                      <p className="text-luxury-light">
                        {durations.find((d) => d.value === formData.duration)?.label}
                      </p>
                    </div>

                    {/* Local */}
                    <div className="pb-4 border-b border-crimson-600/30">
                      <p className="text-xs text-gray-400 mb-1">Local</p>
                      <p className="text-luxury-light">
                        {formData.location === 'proprio'
                          ? 'Local Próprio'
                          : 'Hotel/Motel'}
                      </p>
                      {formData.location === 'hotel' && (
                        <p className="text-sm text-gold-500 mt-1">+ R$ 100 (taxa)</p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-luxury-light">R$ {basePrice}</span>
                      </div>
                      {locationFee > 0 && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Taxa de deslocamento</span>
                          <span className="text-luxury-light">R$ {locationFee}</span>
                        </div>
                      )}
                      <div className="pt-3 mt-3 border-t border-crimson-600/30">
                        <div className="flex justify-between items-center">
                          <span className="font-display text-lg text-luxury-light">
                            Total
                          </span>
                          <span className="font-display text-2xl text-gold-500">
                            R$ {totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ) : (
            // Step 2: Confirmação
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card hover={false} className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="font-display text-3xl font-light text-luxury-light mb-2">
                    Confirmar Agendamento
                  </h2>
                  <p className="text-gray-400">
                    Revise os detalhes antes de confirmar
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-lg bg-black/30 border border-crimson-600/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-gold-500" />
                      <h4 className="font-display text-lg text-luxury-light">
                        Data e Horário
                      </h4>
                    </div>
                    <p className="text-luxury-light ml-8">
                      {new Date(formData.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      às {formData.time}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-black/30 border border-crimson-600/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Star className="w-5 h-5 text-gold-500" />
                      <h4 className="font-display text-lg text-luxury-light">Serviço</h4>
                    </div>
                    <p className="text-luxury-light ml-8">
                      {selectedService?.name} - {formData.duration}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-black/30 border border-crimson-600/20">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-gold-500" />
                      <h4 className="font-display text-lg text-luxury-light">Local</h4>
                    </div>
                    <p className="text-luxury-light ml-8">
                      {formData.location === 'proprio'
                        ? 'Local Próprio'
                        : 'Hotel/Motel'}
                    </p>
                  </div>

                  {formData.specialRequests && (
                    <div className="p-4 rounded-lg bg-black/30 border border-crimson-600/20">
                      <div className="flex items-center gap-3 mb-3">
                        <MessageSquare className="w-5 h-5 text-gold-500" />
                        <h4 className="font-display text-lg text-luxury-light">
                          Pedidos Especiais
                        </h4>
                      </div>
                      <p className="text-gray-400 ml-8 text-sm">
                        {formData.specialRequests}
                      </p>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-gradient-to-r from-crimson-600/20 to-gold-500/20 border border-gold-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="w-5 h-5 text-gold-500" />
                      <h4 className="font-display text-lg text-luxury-light">
                        Valor Total
                      </h4>
                    </div>
                    <p className="text-3xl font-light text-gold-500 ml-8">
                      R$ {totalPrice}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button variant="primary" onClick={handleConfirm} className="flex-1">
                    Confirmar Agendamento
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
