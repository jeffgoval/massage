import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
  Star,
  Heart,
  Share2,
  MessageCircle,
  MapPin,
  Clock,
  Shield,
  Camera,
  Award,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  // Dados mock - substituir por dados reais da API
  const profile = {
    name: 'Isabella Santos',
    tagline: 'O prazer é uma arte que domino',
    age: 25,
    height: '1,68m',
    weight: '58kg',
    ethnicity: 'Morena',
    eyeColor: 'Castanhos',
    hairColor: 'Castanho escuro',
    rating: 5.0,
    reviewCount: 89,
    price: 500,
    avatar: null, // URL da foto
    coverPhoto: null, // URL da capa
    photos: Array(9).fill(null), // Array de URLs
    vip: true,
    verified: true,
    available: true,
    featured: true,
    stats: {
      satisfaction: '100%',
      averageTime: '2h',
      category: 'VIP',
      responseTime: '5min',
    },
    about:
      'Profissional dedicada a proporcionar experiências únicas e memoráveis. Com anos de experiência em massagens sensuais e tantric, ofereço um atendimento exclusivo e personalizado para clientes exigentes que buscam momentos de puro prazer e relaxamento.',
    services: [
      {
        name: 'Tantric Experience',
        description: 'Massagem tântrica completa com técnicas orientais',
        duration: '2h',
        price: 500,
      },
      {
        name: 'Nuru Massage Premium',
        description: 'Massagem corpo a corpo com gel especial',
        duration: '1h30',
        price: 400,
      },
      {
        name: 'Body to Body Sensual',
        description: 'Experiência sensorial completa',
        duration: '1h',
        price: 300,
      },
      {
        name: 'Lingam Massage',
        description: 'Técnica especializada focada em prazer masculino',
        duration: '1h',
        price: 350,
      },
    ],
    amenities: [
      '🏠 Local próprio discreto',
      '🛁 Hidromassagem premium',
      '🥂 Drinks de cortesia',
      '💆 Óleos aromáticos importados',
      '🎵 Ambiente climatizado',
      '🔒 Total privacidade',
      '💳 Aceita cartão',
      '🌃 Atendimento 24h',
    ],
    availability: {
      monday: '10h - 22h',
      tuesday: '10h - 22h',
      wednesday: '10h - 22h',
      thursday: '10h - 22h',
      friday: '10h - 02h',
      saturday: '14h - 02h',
      sunday: 'Sob consulta',
    },
    location: 'Jardins, São Paulo - SP',
    reviews: [
      {
        id: 1,
        author: 'Cliente Verificado',
        date: '2 dias atrás',
        rating: 5,
        comment:
          'Experiência incrível! Isabella é extremamente profissional e atenciosa. O local é impecável e muito discreto. Definitivamente voltarei.',
        verified: true,
      },
      {
        id: 2,
        author: 'Cliente VIP',
        date: '1 semana atrás',
        rating: 5,
        comment:
          'Simplesmente perfeito. Massagem tântrica foi uma experiência transcendental. Recomendo fortemente!',
        verified: true,
      },
      {
        id: 3,
        author: 'Cliente Verificado',
        date: '2 semanas atrás',
        rating: 5,
        comment:
          'Atendimento de altíssimo nível. Isabella sabe exatamente como proporcionar momentos únicos. Vale cada centavo!',
        verified: true,
      },
    ],
  };

  // Perfis similares - dados mock
  const similarProfiles = [
    {
      id: 2,
      name: 'Larissa Oliveira',
      age: 23,
      location: 'Moema, SP',
      ethnicity: 'Branca',
      price: 400,
      rating: 4.9,
      reviews: 67,
      avatar: null,
      vip: true,
      verified: true,
      available: false,
    },
    {
      id: 3,
      name: 'Camila Alves',
      age: 27,
      location: 'Pinheiros, SP',
      ethnicity: 'Negra',
      price: 600,
      rating: 5.0,
      reviews: 102,
      avatar: null,
      vip: true,
      verified: true,
      available: true,
    },
    {
      id: 5,
      name: 'Gabriela Ferreira',
      age: 26,
      location: 'Itaim Bibi, SP',
      ethnicity: 'Branca',
      price: 700,
      rating: 5.0,
      reviews: 124,
      avatar: null,
      vip: true,
      verified: true,
      available: true,
    },
    {
      id: 8,
      name: 'Bianca Rodrigues',
      age: 29,
      location: 'Perdizes, SP',
      ethnicity: 'Branca',
      price: 650,
      rating: 5.0,
      reviews: 95,
      avatar: null,
      vip: true,
      verified: true,
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-luxury-black pb-20 md:pb-8">
      {/* Header com Cover e Avatar */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 bg-gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />

          {/* Botões de ação no topo (mobile) */}
          <div className="absolute top-4 right-4 flex gap-2 md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-crimson-500 text-crimson-500' : 'text-white'}`}
              />
            </motion.button>
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
                        {profile.name}
                      </h1>
                      {profile.vip && (
                        <Badge variant="vip" icon="⭐">
                          VIP Exclusive
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
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <span className="text-luxury-light font-semibold">{profile.rating}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-400">
                        {profile.reviewCount} avaliações verificadas
                      </span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                      {profile.featured && (
                        <Badge variant="exclusive" icon="🔥">
                          Mais Procurada
                        </Badge>
                      )}
                      {profile.available && (
                        <Badge variant="available" icon="•">
                          Disponível Agora
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
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/50 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${isFavorite ? 'fill-crimson-500 text-crimson-500' : 'text-white'}`}
                      />
                    </motion.button>
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
                <div className="text-4xl md:text-5xl font-light text-gold-500 mb-1">
                  R$ {profile.price}
                </div>
                <div className="text-sm text-gray-400">por hora</div>
              </div>

              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  Agendar Sessão Privada
                </Button>
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
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
                  <span className="text-gray-400">Idade</span>
                  <span className="text-luxury-light">{profile.age} anos</span>
                </div>
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

            {/* Estatísticas */}
            <Card hover={false}>
              <h3 className="font-display text-xl font-light text-gold-500 mb-4">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-black/30 rounded-lg">
                  <div className="text-2xl font-light text-gold-500 mb-1">
                    {profile.stats.satisfaction}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Satisfação</div>
                </div>
                <div className="text-center p-4 bg-black/30 rounded-lg">
                  <div className="text-2xl font-light text-gold-500 mb-1">
                    {profile.stats.averageTime}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Tempo Médio</div>
                </div>
                <div className="text-center p-4 bg-black/30 rounded-lg">
                  <div className="text-2xl font-light text-gold-500 mb-1">
                    {profile.stats.category}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Categoria</div>
                </div>
                <div className="text-center p-4 bg-black/30 rounded-lg">
                  <div className="text-2xl font-light text-gold-500 mb-1">
                    {profile.stats.responseTime}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Resposta</div>
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
                    <span className="text-gray-400 capitalize">{day}</span>
                    <span className="text-luxury-light text-sm">{hours}</span>
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
                    {similarProfile.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{similarProfile.location}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-gold-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-luxury-light font-semibold">
                      {similarProfile.rating}
                    </span>
                    <span className="text-xs text-gray-400">({similarProfile.reviews})</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-crimson-600/20 text-luxury-light text-xs border border-crimson-600/30">
                      {similarProfile.age} anos
                    </span>
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
          <Button variant="primary" className="flex-1">
            Agendar Sessão
          </Button>
          <Button variant="ghost" className="w-14">
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
