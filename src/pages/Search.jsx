import { useState } from 'react';
import { Input } from '../components/ui/Input.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Star, Heart, MapPin, Filter, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const navigate = useNavigate();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    bodyType: '',
    ethnicity: '',
    age: '',
    specialty: '',
    price: '',
    availability: '',
    category: ''
  });
  const [sortBy, setSortBy] = useState('featured');

  // Dados mock - substituir por dados da API
  const profiles = [
    {
      id: 1,
      name: 'Isabella Santos',
      age: 25,
      location: 'Jardins, SP',
      ethnicity: 'Morena',
      price: 500,
      rating: 5.0,
      reviews: 89,
      avatar: null,
      vip: true,
      verified: true,
      available: true,
      featured: true,
      photos: 9
    },
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
      featured: true,
      photos: 12
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
      featured: false,
      photos: 8
    },
    {
      id: 4,
      name: 'Amanda Costa',
      age: 24,
      location: 'Vila Madalena, SP',
      ethnicity: 'Morena',
      price: 350,
      rating: 4.8,
      reviews: 54,
      avatar: null,
      vip: false,
      verified: true,
      available: true,
      featured: false,
      photos: 6
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
      featured: true,
      photos: 15
    },
    {
      id: 6,
      name: 'Juliana Martins',
      age: 28,
      location: 'Brooklin, SP',
      ethnicity: 'Oriental',
      price: 550,
      rating: 4.9,
      reviews: 78,
      avatar: null,
      vip: true,
      verified: true,
      available: false,
      featured: false,
      photos: 10
    },
    {
      id: 7,
      name: 'Rafaela Lima',
      age: 22,
      location: 'Centro, SP',
      ethnicity: 'Morena',
      price: 300,
      rating: 4.7,
      reviews: 45,
      avatar: null,
      vip: false,
      verified: true,
      available: true,
      featured: false,
      photos: 7
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
      featured: true,
      photos: 11
    },
    {
      id: 9,
      name: 'Fernanda Silva',
      age: 25,
      location: 'Vila Olímpia, SP',
      ethnicity: 'Negra',
      price: 500,
      rating: 4.9,
      reviews: 71,
      avatar: null,
      vip: true,
      verified: true,
      available: false,
      featured: false,
      photos: 9
    }
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      bodyType: '',
      ethnicity: '',
      age: '',
      specialty: '',
      price: '',
      availability: '',
      category: ''
    });
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
    // Implementar lógica de filtro aqui
  };

  const FilterSection = () => (
    <div className="space-y-5">
      {/* Localização */}
      <div>
        <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
          Localização
        </label>
        <input
          type="text"
          placeholder="Bairro ou região"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body placeholder:text-gray-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
        />
      </div>

      {/* Biotipo */}
      <div>
        <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
          Biotipo
        </label>
        <select
          value={filters.bodyType}
          onChange={(e) => handleFilterChange('bodyType', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 cursor-pointer transition-all duration-300"
        >
          <option value="">Todos os tipos</option>
          <option value="magra">Magra</option>
          <option value="atletica">Atlética</option>
          <option value="curvilinea">Curvilínea</option>
          <option value="plus">Plus Size</option>
        </select>
      </div>

      {/* Etnia */}
      <div>
        <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
          Etnia
        </label>
        <select
          value={filters.ethnicity}
          onChange={(e) => handleFilterChange('ethnicity', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 cursor-pointer transition-all duration-300"
        >
          <option value="">Todas</option>
          <option value="branca">Branca</option>
          <option value="morena">Morena</option>
          <option value="negra">Negra</option>
          <option value="oriental">Oriental</option>
          <option value="latina">Latina</option>
        </select>
      </div>

      {/* Idade */}
      <div>
        <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
          Idade
        </label>
        <select
          value={filters.age}
          onChange={(e) => handleFilterChange('age', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 cursor-pointer transition-all duration-300"
        >
          <option value="">Qualquer idade</option>
          <option value="18-25">18 - 25 anos</option>
          <option value="26-35">26 - 35 anos</option>
          <option value="36-45">36 - 45 anos</option>
          <option value="45+">45+ anos</option>
        </select>
      </div>

      {/* Especialidade */}
      <div>
        <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
          Especialidade
        </label>
        <select
          value={filters.specialty}
          onChange={(e) => handleFilterChange('specialty', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 cursor-pointer transition-all duration-300"
        >
          <option value="">Todas especialidades</option>
          <option value="tantric">Tantric Experience</option>
          <option value="nuru">Nuru Massage</option>
          <option value="body">Body to Body</option>
          <option value="lingam">Lingam/Yoni</option>
          <option value="premium">Experiência Premium</option>
        </select>
      </div>

      {/* Investimento */}
      <div>
        <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
          Investimento
        </label>
        <select
          value={filters.price}
          onChange={(e) => handleFilterChange('price', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 cursor-pointer transition-all duration-300"
        >
          <option value="">Qualquer valor</option>
          <option value="0-400">Até R$ 400</option>
          <option value="400-700">R$ 400 - R$ 700</option>
          <option value="700-1000">R$ 700 - R$ 1.000</option>
          <option value="1000+">Acima de R$ 1.000</option>
        </select>
      </div>

      {/* Disponibilidade */}
      <div>
        <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
          Disponibilidade
        </label>
        <select
          value={filters.availability}
          onChange={(e) => handleFilterChange('availability', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 cursor-pointer transition-all duration-300"
        >
          <option value="">Qualquer horário</option>
          <option value="now">Disponível agora</option>
          <option value="morning">Manhã (6h-12h)</option>
          <option value="afternoon">Tarde (12h-18h)</option>
          <option value="evening">Noite (18h-00h)</option>
          <option value="latenight">Madrugada (00h-6h)</option>
        </select>
      </div>

      {/* Categoria */}
      <div>
        <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
          Categoria
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light font-body focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 cursor-pointer transition-all duration-300"
        >
          <option value="">Todas categorias</option>
          <option value="vip">⭐ VIP Exclusive</option>
          <option value="elite">👑 Elite Premium</option>
          <option value="luxury">💎 Luxury Diamond</option>
          <option value="featured">🔥 Mais Procuradas</option>
        </select>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="flex-1"
        >
          Limpar
        </Button>
        <Button
          variant="gold"
          onClick={applyFilters}
          className="flex-1"
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-black pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-dark border-b border-crimson-600/30 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-light text-luxury-light tracking-wide">
                Encontre Sua Experiência Ideal
              </h1>
              <p className="text-gold-500 italic font-display text-lg mt-2">
                {profiles.length} profissionais disponíveis
              </p>
            </div>

            {/* Botão Filtros Mobile */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden w-12 h-12 rounded-full bg-gradient-gold text-black flex items-center justify-center shadow-gold"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Ordenação e Resultados */}
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              {profiles.length} resultados encontrados
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light text-sm focus:outline-none focus:border-gold-500 cursor-pointer transition-colors"
            >
              <option value="featured">🔥 Mais Procuradas</option>
              <option value="rating">⭐ Melhor Avaliadas</option>
              <option value="price-low">💰 Menor Preço</option>
              <option value="price-high">💎 Maior Preço</option>
              <option value="newest">🆕 Mais Recentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filtros (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <Card hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-light text-gold-500 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtros Avançados
                  </h3>
                </div>
                <FilterSection />
              </Card>
            </div>
          </aside>

          {/* Grid de Perfis */}
          <section className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {profiles.map((profile) => (
                <motion.div
                  key={profile.id}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/profile/${profile.id}`)}
                  className="cursor-pointer"
                >
                  <Card className="h-full">
                    {/* Imagem/Avatar */}
                    <div className="relative mb-4">
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gradient-dark border border-crimson-600/20">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl text-gold-500/30">
                            👤
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      {profile.available && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="available" icon="•">Disponível</Badge>
                        </div>
                      )}

                      {/* Favorito */}
                      <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors">
                        <Heart className="w-5 h-5 text-white" />
                      </button>

                      {/* Contador de fotos */}
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
                        📷 {profile.photos}
                      </div>
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-light text-luxury-light mb-1">
                            {profile.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{profile.location}</span>
                          </div>
                        </div>
                        {profile.vip && (
                          <Badge variant="vip" icon="⭐">VIP</Badge>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-gold-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-luxury-light font-semibold">{profile.rating}</span>
                        <span className="text-sm text-gray-400">({profile.reviews})</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 rounded-full bg-crimson-600/20 text-luxury-light text-xs border border-crimson-600/30">
                          {profile.age} anos
                        </span>
                        <span className="px-2 py-1 rounded-full bg-crimson-600/20 text-luxury-light text-xs border border-crimson-600/30">
                          {profile.ethnicity}
                        </span>
                        {profile.verified && (
                          <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500">
                            ✓ Verificada
                          </span>
                        )}
                      </div>

                      {/* Preço */}
                      <div className="flex items-center justify-between pt-3 border-t border-crimson-600/30">
                        <div>
                          <div className="text-2xl font-light text-gold-500">R$ {profile.price}</div>
                          <div className="text-xs text-gray-400">por hora</div>
                        </div>
                        <Button variant="primary" className="px-4 py-2 text-sm">
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Modal Filtros Mobile */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Painel de Filtros */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-luxury-charcoal z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-light text-gold-500 flex items-center gap-2">
                    <Filter className="w-6 h-6" />
                    Filtros
                  </h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-luxury-light" />
                  </button>
                </div>

                {/* Filtros */}
                <FilterSection />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


