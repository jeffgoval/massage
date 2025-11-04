import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
  Star,
  Bookmark,
  Share2,
  MessageCircle,
  MapPin,
  Clock,
  Shield,
  Camera,
  Award,
  ChevronRight,
  Loader,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../services/database.js';
import { Query } from '../services/appwrite.js';
import { useAuthStore } from '../store/authStore.js';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isSaved, setIsSaved] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState(null);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similarTenants, setSimilarTenants] = useState([]);
  const [pricingConfig, setPricingConfig] = useState(null);

  // Load tenant data - OPTIMIZED: All requests in parallel
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load ALL data in PARALLEL for faster loading
        const [tenantData, packagesData, reviewsData, pricingData, similarData] = await Promise.all([
          db.getTenant(id).catch(err => {
            console.error('Tenant not found:', err);
            return null;
          }),
          db.listPackagesByTenant(id).catch(err => {
            console.error('Error loading packages:', err);
            return { documents: [] };
          }),
          db.listReviewsByTenant(id).catch(err => {
            console.error('Error loading reviews:', err);
            return { documents: [] };
          }),
          db.getPricingConfig(id).catch(err => {
            console.error('Error loading pricing config:', err);
            return null;
          }),
          db.listTenants([Query.limit(10)]).catch(err => {
            console.error('Error loading similar tenants:', err);
            return { documents: [] };
          }),
        ]);

        // Check if tenant exists
        if (!tenantData) {
          setTenant(null);
          setLoading(false);
          return;
        }

        // Set all data at once
        setTenant(tenantData);
        setPackages(packagesData.documents || []);
        setReviews(reviewsData.documents || []);
        setPricingConfig(pricingData);
        setSimilarTenants(
          (similarData.documents || [])
            .filter((t) => t.$id !== id && t.isActive)
            .slice(0, 3)
        );

        setLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        setTenant(null);
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  // Load favorite status
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !id) {
        setIsSaved(false);
        return;
      }

      try {
        const isFav = await db.isFavorite(user.$id, id);
        setIsSaved(isFav);
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };

    checkFavorite();
  }, [user, id]);

  // Toggle save/unsave
  const handleToggleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await db.removeFavorite(user.$id, id);
        setIsSaved(false);
      } else {
        await db.addFavorite(user.$id, id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  // Format price from cents
  const formatPrice = (cents) => {
    if (!cents) return 'Sob consulta';
    return `R$ ${(cents / 100).toFixed(0)}`;
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  };

  if (!tenant) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display text-luxury-light mb-2">
            Perfil não encontrado
          </h2>
          <Button onClick={() => navigate('/search')}>Voltar para busca</Button>
        </div>
      </div>
    );
  }

  // Calculate dynamic price based on current time and day
  const calculateCurrentPrice = () => {
    if (!pricingConfig) {
      // Fallback to package prices if no pricing config
      return packages.length > 0 ? Math.min(...packages.map((p) => p.price)) : 0;
    }

    const now = new Date();
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const currentHour = now.getHours();

    // Determine current period
    let currentPeriod = 'morning';
    if (currentHour >= 12 && currentHour < 18) currentPeriod = 'afternoon';
    else if (currentHour >= 18 && currentHour < 24) currentPeriod = 'evening';
    else if (currentHour >= 0 && currentHour < 6) currentPeriod = 'lateNight';

    // Parse JSON configs
    const parseJSON = (str, defaultValue) => {
      try {
        return str ? JSON.parse(str) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    };

    const periods = parseJSON(pricingConfig.periods, {});
    const weekdays = parseJSON(pricingConfig.weekdays, {});

    const basePrice = pricingConfig.basePrice || 300;
    const periodModifier = periods[currentPeriod]?.modifier || 0;
    const dayModifier = weekdays[currentDay]?.modifier || 0;

    return basePrice + periodModifier + dayModifier;
  };

  const lowestPrice = calculateCurrentPrice();

  // Parse JSON fields from tenant
  const parseJSON = (str, defaultValue) => {
    try {
      return str ? JSON.parse(str) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const tenantPhotos = parseJSON(tenant.photos, []);
  const tenantAmenities = parseJSON(tenant.amenities, [
    '🏠 Local discreto',
    '💆 Atendimento profissional',
    '🔒 Total privacidade',
  ]);
  const tenantAvailability = parseJSON(tenant.availability, {
    monday: { enabled: true, start: '10:00', end: '22:00' },
    tuesday: { enabled: true, start: '10:00', end: '22:00' },
    wednesday: { enabled: true, start: '10:00', end: '22:00' },
    thursday: { enabled: true, start: '10:00', end: '22:00' },
    friday: { enabled: true, start: '10:00', end: '22:00' },
    saturday: { enabled: true, start: '10:00', end: '22:00' },
    sunday: { enabled: false, start: '', end: '' },
  });

  // Format availability for display
  const formatAvailability = (schedule) => {
    if (!schedule) return 'Não disponível';
    if (typeof schedule === 'string') return schedule; // Legacy format
    if (!schedule.enabled) return 'Fechado';
    if (!schedule.start || !schedule.end) return 'Sob consulta';
    return `${schedule.start} - ${schedule.end}`;
  };

  // Map tenant data to profile format for easier refactoring
  const profile = {
    name: tenant.name || tenant.display_name,
    tagline: tenant.tagline || 'Profissional de massagem',
    rating: tenant.reviewCount > 0 ? (tenant.rating || 0) : 0,
    reviewCount: tenant.reviewCount || 0,
    price: lowestPrice,
    avatar: tenant.avatar,
    coverPhoto: tenant.coverPhoto,
    photos: tenantPhotos,
    vip: tenant.isVip,
    verified: tenant.isVerified,
    available: tenant.isActive,
    location: tenant.location || 'Localização não informada',
    about: tenant.bio || 'Profissional experiente oferecendo serviços de qualidade.',
    amenities: tenantAmenities,
    availability: tenantAvailability,
    age: tenant.age,
    height: tenant.height,
    weight: tenant.weight,
    ethnicity: tenant.ethnicity,
    eyeColor: tenant.eyeColor,
    hairColor: tenant.hairColor,
    responseTime: tenant.responseTime || '5min',
    services: packages.map((pkg) => ({
      id: pkg.$id,
      name: pkg.name,
      description: pkg.description,
      duration: formatDuration(pkg.duration),
      price: formatPrice(pkg.price),
      priceRaw: pkg.price,
    })),
    reviews: reviews.map((rev) => ({
      id: rev.$id,
      author: rev.client_name || 'Cliente Anônimo',
      date: new Date(rev.createdAt).toLocaleDateString('pt-BR'),
      rating: rev.rating,
      comment: rev.comment,
      verified: true,
    })),
  };

  // Similar profiles - using real data
  const similarProfiles = similarTenants.map((t) => ({
    id: t.$id,
    name: t.name || t.display_name,
    location: t.location,
    price: 0, // Will be calculated from tenant packages if needed
    rating: t.reviewCount > 0 ? (t.rating || 0) : 0,
    reviews: t.reviewCount || 0,
    avatar: t.avatar,
    vip: t.isVip,
    verified: t.isVerified,
    available: t.isActive,
  }));

  return (
    <div className="min-h-screen bg-luxury-black pb-20 md:pb-8">
      {/* Header com Cover e Avatar */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 bg-gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />

          {/* Botões de ação no topo (mobile) */}
          <div className="absolute top-4 right-4 flex gap-2 md:hidden">
            {user && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleSave}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <Bookmark
                  className={`w-5 h-5 ${isSaved ? 'fill-gold-500 text-gold-500' : 'text-white'}`}
                />
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Share2 className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Avatar e Info Principal */}
        <div className="w-full px-8">
          <div className="relative -mt-16 md:-mt-20">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gold-500 shadow-gold overflow-hidden bg-gradient-dark">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gold-500">
                      👤
                    </div>
                  )}
                </div>
                {profile.available && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-luxury-black animate-pulse" />
                )}
              </motion.div>

              {/* Nome, Tagline e Badges */}
              <div className="flex-1 md:mt-12">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h1 className="font-display text-3xl md:text-4xl font-light text-luxury-light tracking-wide">
                        {profile.name}{profile.age ? `, ${profile.age}` : ''}
                      </h1>
                      {profile.vip && (
                        <Badge variant="vip" icon="⭐">
                          VIP Exclusive
                        </Badge>
                      )}
                      {profile.available && (
                        <Badge variant="available" icon="•">
                          Disponível Agora
                        </Badge>
                      )}
                    </div>

                    <p className="text-gold-500 italic font-display text-lg md:text-xl mb-4">
                      "{profile.tagline}"
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex text-gold-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(profile.rating) ? 'fill-current' : 'fill-none'
                            }`}
                          />
                        ))}
                      </div>
                      {profile.reviewCount > 0 ? (
                        <>
                          <span className="text-luxury-light font-semibold">{profile.rating.toFixed(1)}</span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-400">
                            {profile.reviewCount} {profile.reviewCount === 1 ? 'avaliação' : 'avaliações'}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400">Sem avaliações ainda</span>
                      )}
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                      {profile.featured && (
                        <Badge variant="exclusive" icon="🔥">
                          Mais Procurada
                        </Badge>
                      )}
                      {profile.verified && (
                        <Badge variant="verified" icon="✓">
                          Fotos Verificadas
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Botões de ação (desktop) */}
                  <div className="hidden md:flex gap-3">
                    {user && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleToggleSave}
                        className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/50 transition-colors"
                      >
                        <Bookmark
                          className={`w-5 h-5 ${isSaved ? 'fill-gold-500 text-gold-500' : 'text-white'}`}
                        />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/50 transition-colors"
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="w-full px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galeria de Fotos */}
            <Card hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-light text-luxury-light flex items-center gap-2">
                  <Camera className="w-6 h-6 text-gold-500" />
                  Galeria Premium
                </h2>
                <Badge variant="verified" icon="📸">
                  Verificadas
                </Badge>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                {profile.photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className="aspect-square rounded-lg overflow-hidden bg-luxury-gray/30 cursor-pointer border border-crimson-600/20 hover:border-gold-500/60 transition-colors"
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
                        📷
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Sobre Mim */}
            <Card hover={false}>
              <h2 className="font-display text-2xl font-light text-gold-500 mb-4">Sobre Mim</h2>
              <p className="text-luxury-light leading-relaxed">{profile.about}</p>
            </Card>

            {/* Serviços Oferecidos */}
            <Card hover={false}>
              <h2 className="font-display text-2xl font-light text-gold-500 mb-6">
                Experiências Exclusivas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.services.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-black/30 border border-crimson-600/30 hover:border-gold-500/50 transition-colors"
                  >
                    <h3 className="font-display text-lg text-luxury-light mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">⏱️ {service.duration}</span>
                      <span className="text-gold-500 font-semibold">R$ {service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card hover={false}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-light text-gold-500 flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Avaliações ({profile.reviewCount})
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-gold-500 text-gold-500" />
                  <span className="text-2xl font-light text-gold-500">{profile.rating}</span>
                </div>
              </div>

              <div className="space-y-4">
                {profile.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 rounded-lg bg-black/30 border border-crimson-600/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-luxury-light font-medium">{review.author}</span>
                          {review.verified && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500">
                              ✓ Verificado
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex text-gold-500">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preço e CTA */}
            <Card hover={false} className="sticky top-4">
              <div className="text-center mb-6 p-6 bg-gold-500/5 rounded-lg border border-gold-500/20">
                {pricingConfig && (
                  <div className="mb-2">
                    <Badge variant="exclusive" className="text-xs">
                      💰 Preço Dinâmico
                    </Badge>
                  </div>
                )}
                <div className="text-4xl md:text-5xl font-light text-gold-500 mb-1">
                  R$ {profile.price}
                </div>
                <div className="text-sm text-gray-400">
                  {pricingConfig ? (
                    <>
                      agora • {(() => {
                        const hour = new Date().getHours();
                        if (hour >= 6 && hour < 12) return '🌅 Manhã';
                        if (hour >= 12 && hour < 18) return '☀️ Tarde';
                        if (hour >= 18 && hour < 24) return '🌙 Noite';
                        return '🌃 Madrugada';
                      })()}
                    </>
                  ) : (
                    'por hora'
                  )}
                </div>
                {pricingConfig && (
                  <div className="mt-2 text-xs text-gray-500">
                    * Preço varia por período e dia
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate(`/booking/${id}`)}
                >
                  Agendar Sessão Privada
                </Button>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => navigate(`/chat?tenantId=${id}`)}
                >
                  <MessageCircle className="w-5 h-5" />
                  Iniciar Chat Discreto
                </Button>
              </div>
            </Card>

            {/* Informações Físicas */}
            <Card hover={false}>
              <h3 className="font-display text-xl font-light text-gold-500 mb-4">Informações</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-crimson-600/20">
                  <span className="text-gray-400">Altura</span>
                  <span className="text-luxury-light">{profile.height}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-crimson-600/20">
                  <span className="text-gray-400">Peso</span>
                  <span className="text-luxury-light">{profile.weight}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-crimson-600/20">
                  <span className="text-gray-400">Etnia</span>
                  <span className="text-luxury-light">{profile.ethnicity}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-crimson-600/20">
                  <span className="text-gray-400">Olhos</span>
                  <span className="text-luxury-light">{profile.eyeColor}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400">Cabelo</span>
                  <span className="text-luxury-light">{profile.hairColor}</span>
                </div>
              </div>
            </Card>

            {/* Comodidades */}
            <Card hover={false}>
              <h3 className="font-display text-xl font-light text-gold-500 mb-4">Comodidades</h3>
              <div className="grid grid-cols-1 gap-2">
                {profile.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 rounded-lg bg-crimson-600/10 text-luxury-light text-sm border border-crimson-600/20"
                  >
                    {amenity}
                  </div>
                ))}
              </div>
            </Card>

            {/* Localização */}
            <Card hover={false}>
              <h3 className="font-display text-xl font-light text-gold-500 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Localização
              </h3>
              <p className="text-luxury-light flex items-center gap-2">
                <span>📍</span>
                {profile.location}
              </p>
            </Card>

            {/* Disponibilidade */}
            <Card hover={false}>
              <h3 className="font-display text-xl font-light text-gold-500 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Disponibilidade
              </h3>
              <div className="space-y-2">
                {Object.entries(profile.availability).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between py-2 border-b border-crimson-600/20 last:border-0"
                  >
                    <span className="text-gray-400 capitalize">
                      {day === 'monday' && 'Segunda'}
                      {day === 'tuesday' && 'Terça'}
                      {day === 'wednesday' && 'Quarta'}
                      {day === 'thursday' && 'Quinta'}
                      {day === 'friday' && 'Sexta'}
                      {day === 'saturday' && 'Sábado'}
                      {day === 'sunday' && 'Domingo'}
                    </span>
                    <span className="text-luxury-light text-sm">{formatAvailability(hours)}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Segurança */}
            <Card hover={false}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-luxury-light">Perfil Verificado</h3>
                  <p className="text-xs text-gray-400">Identidade confirmada</p>
                </div>
              </div>
              <div className="text-sm text-gray-400 space-y-2">
                <p>✓ Fotos verificadas pela plataforma</p>
                <p>✓ Documentos validados</p>
                <p>✓ Avaliações 100% reais</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Seção de Perfis Similares */}
      <div className="container mx-auto px-4 lg:px-8 py-12 max-w-[1200px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-light text-luxury-light tracking-wide">
            Perfis Similares
          </h2>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 text-gold-500 hover:text-gold-400 transition-colors text-sm font-medium"
          >
            Ver todos
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid de Perfis Similares */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {similarProfiles.map((similarProfile) => (
            <motion.div
              key={similarProfile.id}
              whileHover={{ y: -8 }}
              onClick={() => {
                navigate(`/profile/${similarProfile.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer"
            >
              <Card className="h-full">
                {/* Imagem/Avatar */}
                <div className="relative mb-3">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gradient-dark border border-crimson-600/20">
                    {similarProfile.avatar ? (
                      <img
                        src={similarProfile.avatar}
                        alt={similarProfile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl text-gold-500/30">
                        👤
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  {similarProfile.available && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="available" icon="•" className="text-xs px-2 py-1">
                        Disponível
                      </Badge>
                    </div>
                  )}

                  {/* VIP Badge */}
                  {similarProfile.vip && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="vip" icon="⭐" className="text-xs px-2 py-1">
                        VIP
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-display text-lg font-light text-luxury-light mb-1">
                    {similarProfile.name}{similarProfile.age ? `, ${similarProfile.age}` : ''}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{similarProfile.location}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-gold-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.round(similarProfile.rating) ? 'fill-current' : 'fill-none'
                          }`}
                        />
                      ))}
                    </div>
                    {similarProfile.reviews > 0 ? (
                      <>
                        <span className="text-xs text-luxury-light font-semibold">
                          {similarProfile.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">({similarProfile.reviews})</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">Sem avaliações</span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-crimson-600/20 text-luxury-light text-xs border border-crimson-600/30">
                      {similarProfile.ethnicity}
                    </span>
                  </div>

                  {/* Preço */}
                  <div className="pt-2 border-t border-crimson-600/30">
                    <div className="text-xl font-light text-gold-500">R$ {similarProfile.price}</div>
                    <div className="text-xs text-gray-400">por hora</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-luxury-charcoal/95 backdrop-blur-lg border-t border-crimson-600/30 p-4 safe-area-inset-bottom z-50">
        <div className="flex gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => navigate(`/booking/${id}`)}
          >
            Agendar Sessão
          </Button>
          <Button variant="ghost" className="w-14" onClick={() => navigate('/chat')}>
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
