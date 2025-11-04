import { useState, useEffect } from 'react';
import { Input } from '../components/ui/Input.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Star, Bookmark, MapPin, Filter, X, ChevronDown, Grid3x3, List, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/database.js';
import { useAuthStore } from '../store/authStore.js';

export default function Search() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [filters, setFilters] = useState({
    location: '',
    bodyType: '',
    ethnicity: '',
    age: '',
    specialty: '',
    price: '',
    availability: '',
    category: '',
  });
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [tenantsPackages, setTenantsPackages] = useState({});
  const [tenantsPricing, setTenantsPricing] = useState({});
  const [favorites, setFavorites] = useState(new Set());

  // Load tenants from Appwrite
  useEffect(() => {
    const loadTenants = async () => {
      try {
        setLoading(true);
        const response = await db.listTenants([]);
        setTenants(response.documents.filter(t => t.isActive));

        // Load packages and pricing for each tenant
        const packagesPromises = response.documents.map(async (tenant) => {
          try {
            const pkgs = await db.listPackagesByTenant(tenant.$id);
            return { tenantId: tenant.$id, packages: pkgs.documents };
          } catch (error) {
            return { tenantId: tenant.$id, packages: [] };
          }
        });

        const pricingPromises = response.documents.map(async (tenant) => {
          try {
            const pricing = await db.getPricingConfig(tenant.$id);
            return { tenantId: tenant.$id, pricing };
          } catch (error) {
            return { tenantId: tenant.$id, pricing: null };
          }
        });

        const packagesResults = await Promise.all(packagesPromises);
        const pricingResults = await Promise.all(pricingPromises);

        const packagesMap = {};
        packagesResults.forEach(({ tenantId, packages }) => {
          packagesMap[tenantId] = packages;
        });
        setTenantsPackages(packagesMap);

        const pricingMap = {};
        pricingResults.forEach(({ tenantId, pricing }) => {
          pricingMap[tenantId] = pricing;
        });
        setTenantsPricing(pricingMap);

        setLoading(false);
      } catch (error) {
        console.error('Error loading tenants:', error);
        setLoading(false);
      }
    };

    loadTenants();
  }, []);

  // Load user favorites
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites(new Set());
        return;
      }

      try {
        const userFavorites = await db.listFavorites(user.$id);
        const favoriteIds = new Set(userFavorites.map(fav => fav.tenant_id));
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, [user]);

  // Format price - handles both cents (from packages) and reais (from dynamic pricing)
  const formatPrice = (price, isDynamic = false) => {
    if (!price) return 'Sob consulta';
    // If dynamic pricing, price is already in reais
    if (isDynamic) return `R$ ${price}`;
    // Otherwise, price is in cents from packages
    return `R$ ${(price / 100).toFixed(0)}`;
  };

  // Calculate dynamic price based on current time and day
  const calculateDynamicPrice = (tenantId) => {
    const pricingConfig = tenantsPricing[tenantId];
    const packages = tenantsPackages[tenantId] || [];

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

  // Toggle favorite (save/unsave)
  const handleToggleFavorite = async (e, tenantId) => {
    e.stopPropagation(); // Prevent card click
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const isSaved = favorites.has(tenantId);

      if (isSaved) {
        await db.removeFavorite(user.$id, tenantId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(tenantId);
          return newSet;
        });
      } else {
        await db.addFavorite(user.$id, tenantId);
        setFavorites(prev => new Set(prev).add(tenantId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Map tenants to profiles format
  const profiles = tenants.map((tenant) => {
    const dynamicPrice = calculateDynamicPrice(tenant.$id);

    return {
      id: tenant.$id,
      name: tenant.name || tenant.display_name,
      location: tenant.location || 'Localização não informada',
      price: dynamicPrice,
      rating: tenant.reviewCount > 0 ? (tenant.rating || 0) : 0,
      reviews: tenant.reviewCount || 0,
      avatar: tenant.avatar,
      vip: tenant.isVip,
      verified: tenant.isVerified,
      available: tenant.isActive,
      featured: tenant.isVip, // VIP são featured
      photos: tenant.photos?.length || 0,
      age: tenant.age,
      ethnicity: tenant.ethnicity,
      height: tenant.height,
      weight: tenant.weight,
      hasDynamicPricing: !!tenantsPricing[tenant.$id],
    };
  });


  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
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
      category: '',
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
        <label className="block mb-2 text-luxury-light font-body text-sm font-medium">Etnia</label>
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
        <label className="block mb-2 text-luxury-light font-body text-sm font-medium">Idade</label>
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
        <Button variant="ghost" onClick={clearFilters} className="flex-1">
          Limpar
        </Button>
        <Button variant="gold" onClick={applyFilters} className="flex-1">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black pb-20 md:pb-8">
      {/* Container Principal */}
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-[1200px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-light text-luxury-light tracking-wide mb-3">
            Experiências Exclusivas
          </h1>
          <p className="text-gold-500 italic font-display text-lg md:text-xl">
            {profiles.length} profissionais disponíveis
          </p>
        </div>

        {/* Sistema de Filtros Premium */}
        <div className="bg-black/40 rounded-luxury p-6 md:p-8 mb-8 border border-crimson-600/20">
          <h3 className="font-display text-xl md:text-2xl font-light text-gold-500 mb-6">
            Encontre Sua Experiência Ideal
          </h3>

          {/* Botão Filtros Mobile */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden w-full px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-black font-display text-base tracking-wide shadow-gold flex items-center justify-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Abrir Filtros
          </button>

          {/* Filtros Desktop */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
            </div>

            {/* Botão Aplicar Filtros */}
            <button
              onClick={applyFilters}
              className="w-full mt-6 px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-black font-display text-base tracking-wide shadow-gold hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>

        {/* Ordenação e Resultados */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="text-gray-400 text-sm">
            {profiles.length} resultados encontrados
          </div>
          <div className="flex items-center gap-4">
            {/* Toggle View Mode */}
            <div className="flex items-center gap-2 bg-luxury-black/30 border border-crimson-600/30 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-gold-500 text-black'
                    : 'text-gray-400 hover:text-luxury-light'
                }`}
                title="Visualização em grade"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-gold-500 text-black'
                    : 'text-gray-400 hover:text-luxury-light'
                }`}
                title="Visualização em lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Ordenação */}
            <div className="flex items-center gap-3">
              <span className="text-luxury-light text-sm font-medium">Ordenar por:</span>
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

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl text-gold-500/30">
                          👤
                        </div>
                      )}
                    </div>

                    {/* Salvar */}
                    {user && (
                      <button
                        onClick={(e) => handleToggleFavorite(e, profile.id)}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <Bookmark
                          className={`w-5 h-5 ${
                            favorites.has(profile.id) ? 'fill-gold-500 text-gold-500' : 'text-white'
                          }`}
                        />
                      </button>
                    )}

                    {/* Contador de fotos */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
                      📷 {profile.photos}
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-display text-xl font-light text-luxury-light">
                        {profile.name}{profile.age ? `, ${profile.age}` : ''}
                      </h3>
                      {profile.vip && (
                        <Badge variant="vip" icon="⭐">
                          VIP
                        </Badge>
                      )}
                      {profile.available && (
                        <Badge variant="available" icon="•">
                          Disponível
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{profile.location}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-gold-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(profile.rating) ? 'fill-current' : 'fill-none'
                            }`}
                          />
                        ))}
                      </div>
                      {profile.reviews > 0 ? (
                        <>
                          <span className="text-sm text-luxury-light font-semibold">
                            {profile.rating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-400">({profile.reviews})</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">Sem avaliações</span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
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
                        <div className="text-2xl font-light text-gold-500">
                          {formatPrice(profile.price, profile.hasDynamicPricing)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {profile.hasDynamicPricing ? 'agora' : 'por hora'}
                        </div>
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
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {profiles.map((profile) => (
              <motion.div
                key={profile.id}
                whileHover={{ x: 4 }}
                onClick={() => navigate(`/profile/${profile.id}`)}
                className="cursor-pointer"
              >
                <Card className="overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Imagem */}
                    <div className="relative md:w-48 flex-shrink-0">
                      <div className="aspect-[3/4] md:aspect-auto md:h-full rounded-lg overflow-hidden bg-gradient-dark border border-crimson-600/20">
                        {profile.avatar ? (
                          <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl text-gold-500/30">
                            👤
                          </div>
                        )}
                      </div>

                      {/* Contador de fotos */}
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
                        📷 {profile.photos}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-display text-2xl font-light text-luxury-light">
                              {profile.name}{profile.age ? `, ${profile.age}` : ''}
                            </h3>
                            {profile.vip && (
                              <Badge variant="vip" icon="⭐">
                                VIP
                              </Badge>
                            )}
                            {profile.available && (
                              <Badge variant="available" icon="•">
                                Disponível
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{profile.location}</span>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-gold-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.round(profile.rating) ? 'fill-current' : 'fill-none'
                                  }`}
                                />
                              ))}
                            </div>
                            {profile.reviews > 0 ? (
                              <>
                                <span className="text-sm text-luxury-light font-semibold">
                                  {profile.rating.toFixed(1)}
                                </span>
                                <span className="text-sm text-gray-400">
                                  ({profile.reviews} {profile.reviews === 1 ? 'avaliação' : 'avaliações'})
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-400">Sem avaliações</span>
                            )}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-crimson-600/20 text-luxury-light text-xs border border-crimson-600/30">
                              {profile.ethnicity}
                            </span>
                            {profile.verified && (
                              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500">
                                ✓ Verificada
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Salvar */}
                        {user && (
                          <button
                            onClick={(e) => handleToggleFavorite(e, profile.id)}
                            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
                          >
                            <Bookmark
                              className={`w-5 h-5 ${
                                favorites.has(profile.id) ? 'fill-gold-500 text-gold-500' : 'text-white'
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Footer com Preço e Ação */}
                      <div className="flex items-center justify-between pt-4 border-t border-crimson-600/30 mt-auto">
                        <div>
                          <div className="text-3xl font-light text-gold-500">
                            {formatPrice(profile.price, profile.hasDynamicPricing)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {profile.hasDynamicPricing ? 'agora' : 'por hora'}
                          </div>
                        </div>
                        <Button variant="primary" className="px-6 py-3">
                          Ver Perfil Completo
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
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
