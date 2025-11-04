import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import {
  LayoutDashboard,
  User,
  Calendar,
  MessageSquare,
  Star,
  Settings,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Image,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore.js';
import { db, DB_IDS } from '../../services/database.js';
import { databases } from '../../services/appwrite.js';
import { storageService } from '../../services/storage.js';
import { Query } from 'appwrite';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAvailable, setIsAvailable] = useState(true);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    bio: '',
    location: '',
    whatsapp: '',
    age: 25,
    height: '',
    weight: '',
    ethnicity: '',
    eyeColor: '',
    hairColor: '',
  });

  const [amenities, setAmenities] = useState([
    '🏠 Local discreto',
    '💆 Atendimento profissional',
    '🔒 Total privacidade',
  ]);
  const [newAmenity, setNewAmenity] = useState('');
  const [uploading, setUploading] = useState(false);

  // Pricing state
  const [pricing, setPricing] = useState({
    basePrice: 300, // Preço base em R$
    periods: {
      morning: { enabled: true, modifier: 0 }, // 06:00 - 12:00
      afternoon: { enabled: true, modifier: 0 }, // 12:00 - 18:00
      evening: { enabled: true, modifier: 50 }, // 18:00 - 00:00
      lateNight: { enabled: true, modifier: 100 }, // 00:00 - 06:00
    },
    weekdays: {
      monday: { enabled: true, modifier: 0 },
      tuesday: { enabled: true, modifier: 0 },
      wednesday: { enabled: true, modifier: 0 },
      thursday: { enabled: true, modifier: 0 },
      friday: { enabled: true, modifier: 50 },
      saturday: { enabled: true, modifier: 100 },
      sunday: { enabled: true, modifier: 100 },
    },
  });

  // Load tenant data
  useEffect(() => {
    const loadTenantData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const tenantData = await db.getTenant(user.$id);
        setTenant(tenantData);
        setIsAvailable(tenantData.isActive);

        // Parse JSON fields
        const parseJSON = (str, defaultValue) => {
          try {
            return str ? JSON.parse(str) : defaultValue;
          } catch (e) {
            return defaultValue;
          }
        };

        const tenantAmenities = parseJSON(tenantData.amenities, [
          '🏠 Local discreto',
          '💆 Atendimento profissional',
          '🔒 Total privacidade',
        ]);
        setAmenities(tenantAmenities);

        const tenantAvailability = parseJSON(tenantData.availability, {
          monday: { enabled: true, start: '10:00', end: '22:00' },
          tuesday: { enabled: true, start: '10:00', end: '22:00' },
          wednesday: { enabled: true, start: '10:00', end: '22:00' },
          thursday: { enabled: true, start: '10:00', end: '22:00' },
          friday: { enabled: true, start: '10:00', end: '02:00' },
          saturday: { enabled: true, start: '14:00', end: '02:00' },
          sunday: { enabled: false, start: '', end: '' },
        });
        setAvailability(tenantAvailability);

        // Load pricing config from separate collection
        const pricingConfig = await db.getPricingConfig(user.$id);
        if (pricingConfig) {
          const parseJSON = (str, defaultValue) => {
            try {
              return str ? JSON.parse(str) : defaultValue;
            } catch (e) {
              return defaultValue;
            }
          };

          setPricing({
            basePrice: pricingConfig.basePrice || 300,
            periods: parseJSON(pricingConfig.periods, {
              morning: { enabled: true, modifier: 0 },
              afternoon: { enabled: true, modifier: 0 },
              evening: { enabled: true, modifier: 50 },
              lateNight: { enabled: true, modifier: 100 },
            }),
            weekdays: parseJSON(pricingConfig.weekdays, {
              monday: { enabled: true, modifier: 0 },
              tuesday: { enabled: true, modifier: 0 },
              wednesday: { enabled: true, modifier: 0 },
              thursday: { enabled: true, modifier: 0 },
              friday: { enabled: true, modifier: 50 },
              saturday: { enabled: true, modifier: 100 },
              sunday: { enabled: true, modifier: 100 },
            }),
          });
        }

        setFormData({
          name: tenantData.name || tenantData.display_name || '',
          tagline: tenantData.tagline || '',
          bio: tenantData.bio || '',
          location: tenantData.location || '',
          whatsapp: tenantData.whatsapp || '',
          age: tenantData.age || 25,
          height: tenantData.height || '',
          weight: tenantData.weight || '',
          ethnicity: tenantData.ethnicity || '',
          eyeColor: tenantData.eyeColor || '',
          hairColor: tenantData.hairColor || '',
        });
      } catch (error) {
        console.error('Error loading tenant:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTenantData();
  }, [user]);

  // Load dashboard data (bookings, messages, reviews)
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        // Load bookings
        const bookingsResponse = await db.listBookings([
          Query.equal('tenant_id', user.$id),
          Query.orderDesc('date'),
        ]);
        const allBookings = bookingsResponse.documents;

        // Filter upcoming bookings (pending or confirmed, future dates)
        const today = new Date().toISOString().split('T')[0];
        const upcoming = allBookings.filter(
          (b) =>
            b.date >= today && (b.status === 'pending' || b.status === 'confirmed')
        );
        setUpcomingBookings(upcoming);

        // Load reviews
        const reviewsResponse = await db.listReviewsByTenant(user.$id);
        setReviews(reviewsResponse.documents);

        // Load chats for messages
        const chatsResponse = await databases.listDocuments(
          DB_IDS.databaseId,
          DB_IDS.chats,
          [Query.equal('tenant_id', user.$id), Query.orderDesc('$createdAt')]
        );
        const chats = chatsResponse.documents;

        // Get unread messages count
        const unreadCount = chats.filter((chat) => chat.unread_count_tenant > 0).length;

        // Calculate monthly revenue (bookings from this month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyBookings = allBookings.filter((b) => {
          const bookingDate = new Date(b.createdAt);
          return (
            bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear &&
            b.status === 'confirmed'
          );
        });
        const monthlyRevenue = monthlyBookings.reduce(
          (sum, b) => sum + (b.totalPrice || 0),
          0
        );

        // Calculate average rating
        const avgRating =
          reviewsResponse.documents.length > 0
            ? reviewsResponse.documents.reduce((sum, r) => sum + r.rating, 0) /
              reviewsResponse.documents.length
            : 0;

        // Set stats
        setStats({
          totalBookings: allBookings.length,
          monthlyRevenue: monthlyRevenue / 100, // Convert from cents
          satisfaction: avgRating,
          totalReviews: reviewsResponse.documents.length,
          pendingMessages: unreadCount,
          upcomingBookings: upcoming.length,
        });

        // Format recent messages from chats
        const formattedMessages = chats.slice(0, 5).map((chat) => ({
          id: chat.$id,
          client: chat.client_name || 'Cliente',
          message: chat.last_message || 'Nova conversa',
          time: formatTimeAgo(chat.$createdAt),
          unread: chat.unread_count_tenant > 0,
        }));
        setRecentMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [user]);

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
  };

  // Input masks
  const formatWhatsApp = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
  };

  const formatHeight = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length === 1) return `${numbers[0]}`;
    return `${numbers[0]}.${numbers.substring(1, 3)}m`;
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);

      await db.updateTenant(user.$id, {
        name: formData.name,
        tagline: formData.tagline,
        bio: formData.bio,
        location: formData.location,
        whatsapp: formData.whatsapp,
        age: parseInt(formData.age),
        height: formData.height,
        weight: formData.weight,
        ethnicity: formData.ethnicity,
        eyeColor: formData.eyeColor,
        hairColor: formData.hairColor,
        amenities: JSON.stringify(amenities),
      });

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // Profile image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 10MB');
      return;
    }

    try {
      setUploading(true);

      // Delete old avatar if exists
      if (tenant?.avatarId) {
        try {
          await storageService.deleteProfileImage(tenant.avatarId);
        } catch (error) {
          console.error('Error deleting old avatar:', error);
        }
      }

      // Upload new image
      const { fileId, fileUrl } = await storageService.uploadProfileImage(file);

      // Update tenant
      await db.updateTenant(user.$id, {
        avatar: fileUrl,
        avatarId: fileId,
      });

      // Update local state
      setTenant({ ...tenant, avatar: fileUrl, avatarId: fileId });

      toast.success('Foto atualizada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  // Amenities management
  const addAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  // Availability management
  const updateAvailability = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value,
      },
    });
  };

  const handleSaveAvailability = async () => {
    if (!user) return;

    try {
      setSaving(true);

      await db.updateTenant(user.$id, {
        availability: JSON.stringify(availability),
      });

      toast.success('Disponibilidade atualizada com sucesso!');
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Erro ao salvar disponibilidade. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle availability status
  const handleToggleAvailability = async (newStatus) => {
    if (!user) return;

    try {
      setIsAvailable(newStatus);
      await db.updateTenant(user.$id, {
        isActive: newStatus,
      });
    } catch (error) {
      console.error('Error updating availability status:', error);
      // Revert on error
      setIsAvailable(!newStatus);
      toast.error('Erro ao atualizar status. Tente novamente.');
    }
  };

  // Pricing management
  const updatePricingPeriod = (period, field, value) => {
    setPricing({
      ...pricing,
      periods: {
        ...pricing.periods,
        [period]: {
          ...pricing.periods[period],
          [field]: field === 'modifier' ? parseInt(value) || 0 : value,
        },
      },
    });
  };

  const updatePricingWeekday = (day, field, value) => {
    setPricing({
      ...pricing,
      weekdays: {
        ...pricing.weekdays,
        [day]: {
          ...pricing.weekdays[day],
          [field]: field === 'modifier' ? parseInt(value) || 0 : value,
        },
      },
    });
  };

  const handleSavePricing = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Check if pricing config exists
      const existingConfig = await db.getPricingConfig(user.$id);

      const pricingData = {
        tenant_id: user.$id,
        basePrice: pricing.basePrice,
        periods: JSON.stringify(pricing.periods),
        weekdays: JSON.stringify(pricing.weekdays),
      };

      if (existingConfig) {
        // Update existing
        await db.updatePricingConfig(existingConfig.$id, pricingData);
      } else {
        // Create new
        await db.createPricingConfig(pricingData);
      }

      toast.success('Preços atualizados com sucesso!');
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Erro ao salvar preços. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // Calculate final price based on period and day
  const calculatePrice = (period, day) => {
    const base = pricing.basePrice;
    const periodModifier = pricing.periods[period]?.modifier || 0;
    const dayModifier = pricing.weekdays[day]?.modifier || 0;
    return base + periodModifier + dayModifier;
  };

  // Booking management
  const handleConfirmBooking = async (bookingId) => {
    try {
      await db.updateBooking(bookingId, {
        status: 'confirmed',
      });

      // Reload bookings
      const bookingsResponse = await db.listBookings([
        Query.equal('tenant_id', user.$id),
        Query.orderDesc('date'),
      ]);
      const allBookings = bookingsResponse.documents;
      const today = new Date().toISOString().split('T')[0];
      const upcoming = allBookings.filter(
        (b) =>
          b.date >= today && (b.status === 'pending' || b.status === 'confirmed')
      );
      setUpcomingBookings(upcoming);

      toast.success('Agendamento confirmado com sucesso!');
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Erro ao confirmar agendamento. Tente novamente.');
    }
  };

  const handleRejectBooking = (bookingId) => {
    setConfirmDialog({
      message: 'Tem certeza que deseja recusar este agendamento?',
      onConfirm: async () => {
        try {
          await db.updateBooking(bookingId, {
            status: 'rejected',
          });

          // Remove from list
          setUpcomingBookings(upcomingBookings.filter((b) => b.$id !== bookingId));

          toast.info('Agendamento recusado.');
        } catch (error) {
          console.error('Error rejecting booking:', error);
          toast.error('Erro ao recusar agendamento. Tente novamente.');
        } finally {
          setConfirmDialog(null);
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  // Real data from Appwrite
  const [stats, setStats] = useState({
    totalBookings: 0,
    monthlyRevenue: 0,
    satisfaction: 0,
    totalReviews: 0,
    pendingMessages: 0,
    upcomingBookings: 0,
  });

  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: '10:00', end: '22:00' },
    tuesday: { enabled: true, start: '10:00', end: '22:00' },
    wednesday: { enabled: true, start: '10:00', end: '22:00' },
    thursday: { enabled: true, start: '10:00', end: '22:00' },
    friday: { enabled: true, start: '10:00', end: '02:00' },
    saturday: { enabled: true, start: '14:00', end: '02:00' },
    sunday: { enabled: false, start: '', end: '' },
  });

  const dayLabels = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'bookings', label: 'Agendamentos', icon: Calendar },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'reviews', label: 'Avaliações', icon: Star },
    { id: 'availability', label: 'Disponibilidade', icon: Clock },
    { id: 'pricing', label: 'Preços', icon: DollarSign },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Status Toggle */}
      <Card hover={false}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl text-luxury-light mb-1">
              Status do Perfil
            </h3>
            <p className="text-sm text-gray-400">
              {isAvailable ? 'Você está disponível para novos agendamentos' : 'Perfil pausado'}
            </p>
          </div>
          <button
            onClick={() => handleToggleAvailability(!isAvailable)}
            className={`relative w-16 h-8 rounded-full transition-colors ${
              isAvailable ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
                isAvailable ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card hover={false}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Receita Mensal</div>
              <div className="text-2xl font-light text-gold-500">
                R$ {stats.monthlyRevenue.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-crimson-600 to-crimson-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Total de Sessões</div>
              <div className="text-2xl font-light text-luxury-light">{stats.totalBookings}</div>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Avaliação</div>
              <div className="text-2xl font-light text-luxury-light">
                {stats.satisfaction} ⭐
              </div>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Mensagens Pendentes</div>
              <div className="text-2xl font-light text-luxury-light">
                {stats.pendingMessages}
              </div>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Total de Reviews</div>
              <div className="text-2xl font-light text-luxury-light">{stats.totalReviews}</div>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Próximas Sessões</div>
              <div className="text-2xl font-light text-luxury-light">
                {stats.upcomingBookings}
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <Card hover={false}>
        <h3 className="font-display text-2xl text-gold-500 mb-6">Editar Perfil</h3>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Carregando...</div>
        ) : (
          <div className="space-y-6">
            {/* Avatar */}
            <div>
              <label className="block mb-3 text-luxury-light font-body text-sm font-medium">
                Foto de Perfil
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-dark border-2 border-gold-500 flex items-center justify-center text-4xl overflow-hidden">
                  {tenant?.avatar ? (
                    <img src={tenant.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('avatar-upload').click()}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Enviando...' : 'Alterar Foto'}
                  </Button>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, GIF (max 10MB)</p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Ex: Massagista profissional"
                  className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
                  Localização
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Jardins, São Paulo - SP"
                  className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })
                  }
                  placeholder="(11) 98765-4321"
                  maxLength={15}
                  className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
                Sobre Você
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Descreva sua experiência e serviços..."
                className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all resize-none"
              />
            </div>

            {/* Physical Info */}
            <div>
              <h4 className="font-display text-xl text-gold-500 mb-4">Informações Físicas</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
                    Idade
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
                    Altura
                  </label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: formatHeight(e.target.value) })}
                    placeholder="1.65m"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
                    Peso
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Ex: 55kg"
                    className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
                    Etnia
                  </label>
                  <input
                    type="text"
                    value={formData.ethnicity}
                    onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                    placeholder="Ex: Latina"
                    className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
                    Cor dos Olhos
                  </label>
                  <input
                    type="text"
                    value={formData.eyeColor}
                    onChange={(e) => setFormData({ ...formData, eyeColor: e.target.value })}
                    placeholder="Ex: Castanhos"
                    className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
                    Cor do Cabelo
                  </label>
                  <input
                    type="text"
                    value={formData.hairColor}
                    onChange={(e) => setFormData({ ...formData, hairColor: e.target.value })}
                    placeholder="Ex: Castanho escuro"
                    className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-display text-xl text-gold-500 mb-4">Comodidades</h4>
              <div className="space-y-3 mb-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-black/30 border border-crimson-600/30"
                  >
                    <span className="text-luxury-light">{amenity}</span>
                    <button
                      onClick={() => removeAmenity(index)}
                      className="text-crimson-500 hover:text-crimson-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                  placeholder="Ex: 🏠 Local discreto"
                  className="flex-1 px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                />
                <Button variant="ghost" onClick={addAmenity} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </Button>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full md:w-auto"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-gold-500">Próximos Agendamentos</h3>
          <Badge variant="vip">{upcomingBookings.length} sessões</Badge>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Nenhum agendamento encontrado
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.$id}
                className="p-4 rounded-lg bg-black/30 border border-crimson-600/20 hover:border-gold-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-display text-lg text-luxury-light mb-1">
                      {booking.client_name || 'Cliente'}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.time}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={booking.status === 'confirmed' ? 'available' : 'default'}
                  >
                    {booking.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-crimson-600/20">
                  <div className="text-xl font-light text-gold-500">
                    R$ {((booking.totalPrice || 0) / 100).toFixed(2)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="text-sm">
                      Detalhes
                    </Button>
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          variant="primary"
                          className="text-sm"
                          onClick={() => handleConfirmBooking(booking.$id)}
                        >
                          Confirmar
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-sm text-crimson-500"
                          onClick={() => handleRejectBooking(booking.$id)}
                        >
                          Recusar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-gold-500">Mensagens Recentes</h3>
          <Badge variant="vip">{stats.pendingMessages} não lidas</Badge>
        </div>

        {recentMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Nenhuma mensagem ainda</div>
        ) : (
          <>
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => navigate('/chat')}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    msg.unread
                      ? 'bg-crimson-600/10 border-crimson-600/30 hover:border-gold-500/50'
                      : 'bg-black/30 border-crimson-600/20 hover:border-gold-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-dark border border-gold-500/50 flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div>
                        <h4 className="font-display text-base text-luxury-light">
                          {msg.client}
                        </h4>
                        <p className="text-xs text-gray-400">{msg.time}</p>
                      </div>
                    </div>
                    {msg.unread && <div className="w-2 h-2 rounded-full bg-crimson-500" />}
                  </div>
                  <p className="text-sm text-gray-300 ml-13">{msg.message}</p>
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              className="w-full mt-4"
              onClick={() => navigate('/chat')}
            >
              Ver Todas as Mensagens
            </Button>
          </>
        )}
      </Card>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-gold-500">Avaliações</h3>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-gold-500 fill-current" />
            <span className="text-2xl font-light text-luxury-light">
              {stats.satisfaction.toFixed(1)}
            </span>
            <span className="text-gray-400">({stats.totalReviews} reviews)</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Nenhuma avaliação ainda</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.$id}
                className="p-4 rounded-lg bg-black/30 border border-crimson-600/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-display text-base text-luxury-light mb-1">
                      {review.client_name || 'Cliente Anônimo'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex text-gold-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const renderAvailability = () => (
    <div className="space-y-6">
      <Card hover={false}>
        <h3 className="font-display text-2xl text-gold-500 mb-6">
          Gerenciar Disponibilidade
        </h3>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Carregando...</div>
        ) : (
          <>
            <div className="space-y-4">
              {Object.entries(availability).map(([day, schedule]) => (
                <div
                  key={day}
                  className="p-4 rounded-lg bg-black/30 border border-crimson-600/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={(e) =>
                          updateAvailability(day, 'enabled', e.target.checked)
                        }
                        className="w-5 h-5 rounded border-crimson-600/30 bg-luxury-black/30 text-gold-500 focus:ring-gold-500/20"
                      />
                      <span className="font-display text-lg text-luxury-light">
                        {dayLabels[day]}
                      </span>
                    </div>
                  </div>

                  {schedule.enabled && (
                    <div className="grid grid-cols-2 gap-3 ml-8">
                      <div>
                        <label className="block mb-1 text-xs text-gray-400">Início</label>
                        <input
                          type="time"
                          value={schedule.start}
                          onChange={(e) =>
                            updateAvailability(day, 'start', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light text-sm focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-gray-400">Fim</label>
                        <input
                          type="time"
                          value={schedule.end}
                          onChange={(e) =>
                            updateAvailability(day, 'end', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light text-sm focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              className="w-full md:w-auto mt-6"
              onClick={handleSaveAvailability}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Disponibilidade'}
            </Button>
          </>
        )}
      </Card>
    </div>
  );

  const renderPricing = () => {
    const periodLabels = {
      morning: { label: 'Manhã', time: '06:00 - 12:00', icon: '🌅' },
      afternoon: { label: 'Tarde', time: '12:00 - 18:00', icon: '☀️' },
      evening: { label: 'Noite', time: '18:00 - 00:00', icon: '🌙' },
      lateNight: { label: 'Madrugada', time: '00:00 - 06:00', icon: '🌃' },
    };

    return (
      <div className="space-y-6">
        {/* Preço Base */}
        <Card hover={false}>
          <h3 className="font-display text-2xl text-gold-500 mb-6">Preço Base</h3>
          <div className="max-w-md">
            <label className="block mb-2 text-luxury-light font-body text-sm font-medium">
              Valor Base da Sessão (R$)
            </label>
            <input
              type="number"
              value={pricing.basePrice}
              onChange={(e) => setPricing({ ...pricing, basePrice: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light text-2xl font-bold focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
            />
            <p className="text-xs text-gray-400 mt-2">
              Este é o valor padrão da sessão. Você pode adicionar valores extras por período e dia da semana abaixo.
            </p>
          </div>
        </Card>

        {/* Preços por Período do Dia */}
        <Card hover={false}>
          <h3 className="font-display text-2xl text-gold-500 mb-4">Acréscimos por Período</h3>
          <p className="text-sm text-gray-400 mb-6">
            Configure valores adicionais para cada período do dia
          </p>

          <div className="space-y-4">
            {Object.entries(pricing.periods).map(([period, config]) => (
              <div
                key={period}
                className="p-4 rounded-lg bg-black/30 border border-crimson-600/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => updatePricingPeriod(period, 'enabled', e.target.checked)}
                      className="w-5 h-5 rounded border-crimson-600/30 bg-luxury-black/30 text-gold-500 focus:ring-gold-500/20"
                    />
                    <div>
                      <span className="font-display text-lg text-luxury-light flex items-center gap-2">
                        <span>{periodLabels[period].icon}</span>
                        {periodLabels[period].label}
                      </span>
                      <span className="text-xs text-gray-400">{periodLabels[period].time}</span>
                    </div>
                  </div>
                  {config.enabled && (
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Preço final</div>
                      <div className="text-xl font-bold text-gold-500">
                        R$ {pricing.basePrice + config.modifier}
                      </div>
                    </div>
                  )}
                </div>

                {config.enabled && (
                  <div className="ml-8">
                    <label className="block mb-1 text-xs text-gray-400">
                      Acréscimo (R$)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="10"
                        value={config.modifier}
                        onChange={(e) => updatePricingPeriod(period, 'modifier', e.target.value)}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={config.modifier}
                        onChange={(e) => updatePricingPeriod(period, 'modifier', e.target.value)}
                        className="w-24 px-3 py-2 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Preços por Dia da Semana */}
        <Card hover={false}>
          <h3 className="font-display text-2xl text-gold-500 mb-4">Acréscimos por Dia da Semana</h3>
          <p className="text-sm text-gray-400 mb-6">
            Configure valores adicionais para cada dia da semana
          </p>

          <div className="space-y-4">
            {Object.entries(pricing.weekdays).map(([day, config]) => (
              <div
                key={day}
                className="p-4 rounded-lg bg-black/30 border border-crimson-600/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => updatePricingWeekday(day, 'enabled', e.target.checked)}
                      className="w-5 h-5 rounded border-crimson-600/30 bg-luxury-black/30 text-gold-500 focus:ring-gold-500/20"
                    />
                    <span className="font-display text-lg text-luxury-light">
                      {dayLabels[day]}
                    </span>
                  </div>
                  {config.enabled && (
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Preço base + dia</div>
                      <div className="text-xl font-bold text-gold-500">
                        R$ {pricing.basePrice + config.modifier}
                      </div>
                    </div>
                  )}
                </div>

                {config.enabled && (
                  <div className="ml-8">
                    <label className="block mb-1 text-xs text-gray-400">
                      Acréscimo (R$)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="10"
                        value={config.modifier}
                        onChange={(e) => updatePricingWeekday(day, 'modifier', e.target.value)}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={config.modifier}
                        onChange={(e) => updatePricingWeekday(day, 'modifier', e.target.value)}
                        className="w-24 px-3 py-2 rounded-lg bg-luxury-black/30 border border-crimson-600/30 text-luxury-light text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Simulador de Preços */}
        <Card hover={false}>
          <h3 className="font-display text-2xl text-gold-500 mb-4">
            💡 Simulador de Preços
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Veja como ficam os preços finais considerando período + dia da semana
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-crimson-600/20">
                  <th className="text-left py-3 px-2 text-gray-400 font-normal">Dia / Período</th>
                  {Object.entries(periodLabels).map(([period, { label, icon }]) => (
                    <th key={period} className="text-center py-3 px-2 text-gray-400 font-normal">
                      <div>{icon}</div>
                      <div className="text-xs">{label}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(pricing.weekdays).map((day) => (
                  <tr key={day} className="border-b border-crimson-600/10">
                    <td className="py-3 px-2 text-luxury-light font-display">
                      {dayLabels[day]}
                    </td>
                    {Object.keys(pricing.periods).map((period) => (
                      <td key={period} className="text-center py-3 px-2">
                        <div className="text-gold-500 font-semibold">
                          R$ {calculatePrice(period, day)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Button
          variant="primary"
          className="w-full md:w-auto"
          onClick={handleSavePricing}
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar Configurações de Preço'}
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-luxury-black pb-20 md:pb-8">
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-[1400px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-light text-luxury-light tracking-wide mb-2">
            Painel do Provedor
          </h1>
          <p className="text-gray-400">Gerencie seu perfil, agendamentos e mensagens</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-body text-sm transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black shadow-gold'
                      : 'bg-black/30 border border-crimson-600/30 text-luxury-light hover:border-gold-500/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'reviews' && renderReviews()}
          {activeTab === 'availability' && renderAvailability()}
          {activeTab === 'pricing' && renderPricing()}
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => confirmDialog.onCancel()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-luxury-darker border border-crimson-600/30 rounded-lg p-6 max-w-md w-full shadow-luxury"
            >
              <h3 className="font-display text-xl text-luxury-light mb-4">Confirmar Ação</h3>
              <p className="text-gray-300 mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={confirmDialog.onCancel}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmDialog.onConfirm}
                  className="bg-crimson-600 hover:bg-crimson-700"
                >
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
