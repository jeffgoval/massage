# 🚀 ROADMAP - Plataforma Premium de Massagens Sensuais
## PWA Mobile-First | React + Vite + Appwrite

---

## 📋 VISÃO GERAL DO PROJETO

### Stack Tecnológica
- **Frontend**: React 18 + Vite
- **Backend**: Appwrite (BaaS)
- **Styling**: Tailwind CSS + Custom Components
- **State Management**: Zustand ou Context API
- **Routing**: React Router v6
- **PWA**: Workbox + Vite PWA Plugin
- **Forms**: React Hook Form + Zod
- **Media**: Cloudinary ou Appwrite Storage
- **Pagamentos**: Stripe ou Mercado Pago (integração futura)

---

## 🎯 FASES DO PROJETO

---

## **FASE 1: SETUP & FUNDAÇÃO** (Semana 1)

### 1.1 Setup do Projeto Base
```bash
# Criar projeto
npm create vite@latest premium-massage-app -- --template react

# Dependências principais
npm install react-router-dom appwrite zustand
npm install react-hook-form zod @hookform/resolvers
npm install tailwindcss postcss autoprefixer
npm install framer-motion lucide-react
npm install vite-plugin-pwa workbox-window

# Dev dependencies
npm install -D @types/node
```

### 1.2 Estrutura de Pastas
```
src/
├── assets/              # Imagens, fontes, ícones
│   ├── fonts/
│   ├── icons/
│   └── images/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Botões, inputs, cards base
│   ├── layout/         # Header, Footer, Navigation
│   ├── profile/        # Componentes de perfil
│   └── common/         # Componentes compartilhados
├── pages/              # Páginas da aplicação
│   ├── Home.jsx
│   ├── Search.jsx
│   ├── Profile.jsx
│   ├── Chat.jsx
│   ├── Booking.jsx
│   └── Auth/
├── services/           # Lógica de negócio
│   ├── appwrite.js     # Configuração Appwrite
│   ├── auth.js         # Autenticação
│   ├── database.js     # Operações DB
│   └── storage.js      # Upload de arquivos
├── store/              # Zustand stores
│   ├── authStore.js
│   ├── profileStore.js
│   └── chatStore.js
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   ├── useProfile.js
│   └── useGeolocation.js
├── utils/              # Funções utilitárias
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
├── styles/             # Estilos globais
│   ├── globals.css
│   └── tailwind.css
└── App.jsx
```

### 1.3 Configuração do Design System

**tailwind.config.js**
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cores Premium
        crimson: {
          50: '#ffe5e5',
          100: '#ffcccc',
          500: '#dc143c',
          600: '#8b0000',
          700: '#6b0000',
          900: '#4a0e0e',
        },
        gold: {
          50: '#fff9e6',
          100: '#fef3cc',
          400: '#f4e5b8',
          500: '#d4af37',
          600: '#b8860b',
        },
        luxury: {
          black: '#000000',
          charcoal: '#1a1a1a',
          gray: '#2d2d2d',
          light: '#f4f4f4',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
        'gradient-gold': 'linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)',
        'gradient-dark': 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
      },
      boxShadow: {
        'luxury': '0 8px 32px rgba(0,0,0,0.4)',
        'gold': '0 4px 15px rgba(212, 175, 55, 0.4)',
        'crimson': '0 4px 15px rgba(139, 0, 0, 0.4)',
      },
      borderRadius: {
        'luxury': '16px',
      },
    },
  },
  plugins: [],
}
```

### 1.4 Configuração do Appwrite
```javascript
// src/services/appwrite.js
import { Client, Account, Databases, Storage, Query } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { Query };
export default client;
```

### 1.5 Variáveis de Ambiente
```env
# .env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=seu-project-id
VITE_APPWRITE_DATABASE_ID=seu-database-id
VITE_APPWRITE_PROFILES_COLLECTION_ID=profiles-id
VITE_APPWRITE_BOOKINGS_COLLECTION_ID=bookings-id
VITE_APPWRITE_REVIEWS_COLLECTION_ID=reviews-id
VITE_APPWRITE_CHATS_COLLECTION_ID=chats-id
VITE_APPWRITE_BUCKET_ID=photos-bucket-id
```

---

## **FASE 2: DESIGN SYSTEM & COMPONENTES BASE** (Semana 1-2)

### 2.1 Componentes UI Base

#### Button Component
```jsx
// src/components/ui/Button.jsx
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-primary text-white shadow-crimson',
  gold: 'bg-gradient-gold text-black shadow-gold',
  outline: 'border-2 border-gold-500 text-gold-500',
  ghost: 'bg-white/5 border border-white/20 text-luxury-light',
};

export const Button = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        px-8 py-4 rounded-full font-display text-base
        transition-all duration-300 tracking-wide
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};
```

#### Input Component
```jsx
// src/components/ui/Input.jsx
export const Input = ({ label, error, ...props }) => {
  return (
    <div className="mb-6">
      {label && (
        <label className="block mb-2 text-luxury-light font-body text-sm">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-lg
          bg-luxury-black/30 border
          ${error ? 'border-crimson-500' : 'border-crimson-600/30'}
          text-luxury-light font-body
          focus:outline-none focus:border-gold-500
          focus:ring-2 focus:ring-gold-500/20
          transition-all duration-300
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-crimson-500">{error}</p>
      )}
    </div>
  );
};
```

#### Card Component
```jsx
// src/components/ui/Card.jsx
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -8 } : {}}
      className={`
        bg-gradient-dark rounded-luxury p-6
        shadow-luxury border border-crimson-600/30
        transition-all duration-300
        ${hover ? 'hover:shadow-crimson hover:border-crimson-600/60' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
```

#### Badge Component
```jsx
// src/components/ui/Badge.jsx
const variants = {
  vip: 'bg-gradient-gold text-black',
  exclusive: 'bg-gradient-primary text-white',
  verified: 'bg-white/10 text-gold-500 border border-gold-500',
  available: 'bg-green-500/20 text-green-400 border border-green-500',
};

export const Badge = ({ variant, children, icon }) => {
  return (
    <span className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full
      text-xs font-semibold ${variants[variant]}
    `}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};
```

### 2.2 Profile Card Component (PRINCIPAL)
```jsx
// src/components/profile/ProfileCard.jsx
import { Star, MapPin, Clock, Heart } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export const ProfileCard = ({ profile }) => {
  return (
    <Card hover>
      {/* Header com Gradient */}
      <div className="h-32 bg-gradient-primary rounded-t-luxury -m-6 mb-0 relative">
        {/* Avatar */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="absolute -bottom-12 left-6"
        >
          <div className="w-24 h-24 rounded-full border-4 border-gold-500 
                        bg-gradient-dark shadow-gold overflow-hidden">
            <img 
              src={profile.avatar} 
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 p-2 rounded-full 
                         bg-black/30 backdrop-blur-sm hover:bg-black/50">
          <Heart className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Body */}
      <div className="pt-16 px-6 pb-6">
        {/* Nome e Badge */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-2xl font-display font-light text-luxury-light 
                       tracking-wide">
            {profile.name}
          </h3>
          {profile.vip && (
            <Badge variant="vip" icon="⭐">VIP</Badge>
          )}
        </div>

        {/* Tagline */}
        <p className="text-gold-500 italic font-display mb-4">
          "{profile.tagline}"
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-gold-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-400">
            {profile.rating} · {profile.reviews} avaliações
          </span>
        </div>

        {/* Gallery Preview */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {profile.photos.slice(0, 3).map((photo, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden">
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="aspect-square rounded-lg bg-luxury-charcoal 
                        flex items-center justify-center text-gold-500 
                        cursor-pointer hover:bg-luxury-gray">
            +{profile.photos.length - 3}
          </div>
        </div>

        {/* Info Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-crimson-600/20 
                         text-luxury-light text-xs border border-crimson-600/30">
            {profile.age} anos
          </span>
          <span className="px-3 py-1 rounded-full bg-crimson-600/20 
                         text-luxury-light text-xs border border-crimson-600/30">
            {profile.height} · {profile.weight}
          </span>
          <span className="px-3 py-1 rounded-full bg-crimson-600/20 
                         text-luxury-light text-xs border border-crimson-600/30">
            {profile.ethnicity}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-black/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-light text-gold-500">100%</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">
              Satisfação
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-gold-500">2h</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">
              Tempo médio
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-gold-500">VIP</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">
              Categoria
            </div>
          </div>
        </div>

        {/* Preço */}
        <div className="text-center mb-4 p-4 bg-gold-500/5 rounded-lg 
                      border border-gold-500/20">
          <div className="text-3xl font-light text-gold-500">
            R$ {profile.price}
          </div>
          <div className="text-sm text-gray-400">por hora</div>
        </div>

        {/* Badges de Status */}
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.featured && (
            <Badge variant="exclusive" icon="🔥">Mais Procurada</Badge>
          )}
          {profile.available && (
            <Badge variant="available" icon="✓">Disponível Agora</Badge>
          )}
          {profile.verified && (
            <Badge variant="verified" icon="📸">Fotos Verificadas</Badge>
          )}
        </div>

        {/* Action Button */}
        <Button variant="primary" className="w-full">
          Agendar Sessão Privada
        </Button>
      </div>
    </Card>
  );
};
```

---

## **FASE 3: ESTRUTURA DO APPWRITE** (Semana 2)

### 3.1 Collections no Appwrite

#### Collection: profiles
```json
{
  "name": "profiles",
  "attributes": [
    { "key": "userId", "type": "string", "required": true },
    { "key": "name", "type": "string", "required": true },
    { "key": "tagline", "type": "string" },
    { "key": "bio", "type": "string", "size": 2000 },
    { "key": "age", "type": "integer" },
    { "key": "height", "type": "string" },
    { "key": "weight", "type": "string" },
    { "key": "ethnicity", "type": "string" },
    { "key": "bodyType", "type": "string" },
    { "key": "location", "type": "string" },
    { "key": "price", "type": "integer" },
    { "key": "rating", "type": "double", "default": 0 },
    { "key": "reviewCount", "type": "integer", "default": 0 },
    { "key": "isVip", "type": "boolean", "default": false },
    { "key": "isVerified", "type": "boolean", "default": false },
    { "key": "isAvailable", "type": "boolean", "default": true },
    { "key": "photos", "type": "string", "array": true },
    { "key": "specialties", "type": "string", "array": true },
    { "key": "amenities", "type": "string", "array": true },
    { "key": "availability", "type": "string" },
    { "key": "responseTime", "type": "string" }
  ],
  "indexes": [
    { "key": "userId", "type": "unique" },
    { "key": "location", "type": "fulltext" },
    { "key": "isVip", "type": "key" },
    { "key": "rating", "type": "key", "order": "DESC" }
  ]
}
```

#### Collection: bookings
```json
{
  "name": "bookings",
  "attributes": [
    { "key": "clientId", "type": "string", "required": true },
    { "key": "profileId", "type": "string", "required": true },
    { "key": "date", "type": "datetime", "required": true },
    { "key": "duration", "type": "integer" },
    { "key": "location", "type": "string" },
    { "key": "specialRequests", "type": "string", "size": 1000 },
    { "key": "status", "type": "string", "default": "pending" },
    { "key": "price", "type": "integer" },
    { "key": "paymentStatus", "type": "string" }
  ]
}
```

#### Collection: reviews
```json
{
  "name": "reviews",
  "attributes": [
    { "key": "clientId", "type": "string", "required": true },
    { "key": "profileId", "type": "string", "required": true },
    { "key": "bookingId", "type": "string", "required": true },
    { "key": "rating", "type": "integer", "required": true },
    { "key": "comment", "type": "string", "size": 1000 },
    { "key": "isVerified", "type": "boolean", "default": false }
  ]
}
```

#### Collection: chats
```json
{
  "name": "chats",
  "attributes": [
    { "key": "participants", "type": "string", "array": true },
    { "key": "lastMessage", "type": "string" },
    { "key": "lastMessageTime", "type": "datetime" },
    { "key": "unreadCount", "type": "integer", "default": 0 }
  ]
}
```

#### Collection: messages
```json
{
  "name": "messages",
  "attributes": [
    { "key": "chatId", "type": "string", "required": true },
    { "key": "senderId", "type": "string", "required": true },
    { "key": "content", "type": "string", "size": 2000 },
    { "key": "type", "type": "string", "default": "text" },
    { "key": "isRead", "type": "boolean", "default": false }
  ]
}
```

### 3.2 Storage Buckets
- **profiles-photos**: Fotos de perfil (máx 10MB, jpg/png/webp)
- **gallery-photos**: Fotos da galeria (máx 15MB)
- **chat-media**: Fotos enviadas no chat (máx 10MB)

---

## **FASE 4: PÁGINAS PRINCIPAIS** (Semana 2-3)

### 4.1 Home Page
**Features:**
- Hero section com busca rápida
- Filtros principais (localização, categoria VIP)
- Grid de perfis em destaque
- Seções: "Mais Procuradas", "Disponíveis Agora", "Recém Cadastradas"
- Infinite scroll

### 4.2 Search/Filter Page
**Features:**
- Filtros avançados (sidebar/drawer)
- Múltiplos filtros: idade, biotipo, etnia, preço, especialidade
- Ordenação: rating, preço, novidade
- Mapa com localização (opcional)
- Resultados em grid/list view

### 4.3 Profile Detail Page
**Features:**
- Hero com galeria de fotos (lightbox)
- Informações completas
- Reviews e ratings
- Botão de agendamento fixo
- Botão de chat
- Seção "Perfis Similares"

### 4.4 Chat Page
**Features:**
- Lista de conversas
- Interface de mensagens em tempo real
- Indicador de "digitando..."
- Envio de fotos
- Status de leitura

### 4.5 Booking Page
**Features:**
- Seleção de data e hora
- Duração da sessão
- Local (próprio/hotel)
- Pedidos especiais
- Resumo do valor
- Confirmação

### 4.6 Profile Management (Provider)
**Features:**
- Dashboard com estatísticas
- Editar perfil e fotos
- Gerenciar disponibilidade
- Ver agendamentos
- Responder mensagens
- Ver reviews

---

## **FASE 5: AUTENTICAÇÃO & USUÁRIOS** (Semana 3)

### 5.1 Auth Flow
```jsx
// src/services/auth.js
import { account } from './appwrite';

export const authService = {
  // Criar conta
  async register(email, password, name) {
    return await account.create('unique()', email, password, name);
  },

  // Login
  async login(email, password) {
    return await account.createEmailSession(email, password);
  },

  // Logout
  async logout() {
    return await account.deleteSession('current');
  },

  // Get current user
  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },

  // Verificação de email
  async sendVerification() {
    return await account.createVerification(
      `${window.location.origin}/verify`
    );
  }
};
```

### 5.2 User Types
- **Cliente**: Busca e agenda serviços
- **Profissional**: Oferece serviços
- **Admin**: Moderação (fase futura)

---

## **FASE 6: FUNCIONALIDADES AVANÇADAS** (Semana 4)

### 6.1 Real-time Chat
```jsx
// Usando Appwrite Realtime
import { client } from './appwrite';

client.subscribe('databases.[DB_ID].collections.[MESSAGES_ID].documents', 
  (response) => {
    // Handle new message
  }
);
```

### 6.2 Geolocation
```jsx
// src/hooks/useGeolocation.js
export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }
    );
  }, []);
  
  return location;
};
```

### 6.3 Image Optimization
```jsx
// Usar Appwrite Storage com transformações
const getOptimizedImage = (fileId, width = 400) => {
  return storage.getFilePreview(
    bucketId,
    fileId,
    width,
    0, // height (auto)
    'center',
    80, // quality
    0,
    '000000',
    0,
    0,
    0,
    0,
    'webp'
  );
};
```

### 6.4 PWA Configuration
```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Premium Massage Services',
        short_name: 'PremiumMassage',
        description: 'Experiências exclusivas de massagem sensual',
        theme_color: '#8b0000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
```

---

## **FASE 7: OTIMIZAÇÕES & POLISH** (Semana 4-5)

### 7.1 Performance
- [ ] Lazy loading de imagens
- [ ] Code splitting por rotas
- [ ] Memoização de componentes pesados
- [ ] Virtual scrolling para listas longas
- [ ] Service Worker para cache

### 7.2 SEO (mesmo sendo PWA)
- [ ] Meta tags dinâmicas
- [ ] Open Graph tags
- [ ] Sitemap
- [ ] robots.txt

### 7.3 Analytics
- [ ] Google Analytics 4
- [ ] Hotjar para heatmaps
- [ ] Event tracking customizado

### 7.4 Security
- [ ] Rate limiting (via Appwrite)
- [ ] Input sanitization
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Validação de fotos (moderação)

---

## **FASE 8: TESTES & DEPLOY** (Semana 5)

### 8.1 Testes
```bash
# Instalar dependências de teste
npm install -D vitest @testing-library/react 
npm install -D @testing-library/jest-dom @testing-library/user-event
```

### 8.2 Deploy
**Opções recomendadas:**
1. **Vercel** (recomendado)
   - Deploy automático
   - Edge Functions
   - Preview deployments
   
2. **Netlify**
   - Bom para PWAs
   - Forms nativos
   
3. **Cloudflare Pages**
   - Performance excelente
   - CDN global

---

## 📦 COMPONENTES PRIORITÁRIOS (ORDEM DE DESENVOLVIMENTO)

### Sprint 1 (Semana 1)
1. ✅ Setup projeto + Tailwind
2. ✅ Componentes UI base (Button, Input, Card, Badge)
3. ✅ Layout base (Header, Footer, Navigation)
4. ✅ Configuração Appwrite

### Sprint 2 (Semana 2)
5. ✅ ProfileCard component
6. ✅ Home page com grid de perfis
7. ✅ Search/Filter page
8. ✅ Sistema de autenticação

### Sprint 3 (Semana 3)
9. ✅ Profile detail page
10. ✅ Booking flow
11. ✅ Image gallery/lightbox
12. ✅ Reviews system

### Sprint 4 (Semana 4)
13. ✅ Chat system (real-time)
14. ✅ Profile management (provider)
15. ✅ Notifications
16. ✅ PWA setup

### Sprint 5 (Semana 5)
17. ✅ Polish & animations
18. ✅ Testing
19. ✅ Performance optimization
20. ✅ Deploy

---

## 🎨 ASSETS NECESSÁRIOS

### Fontes
- [ ] Playfair Display (Google Fonts)
- [ ] Inter (Google Fonts)

### Ícones
- [ ] Lucide React (já incluso)
- [ ] Emojis Unicode para badges

### Imagens Placeholder
- [ ] Avatar placeholder
- [ ] Gallery placeholders
- [ ] Hero images
- [ ] Logo/Brand

---

## 🔐 CONSIDERAÇÕES DE PRIVACIDADE & SEGURANÇA

1. **LGPD Compliance**
   - Termo de uso e privacidade
   - Consentimento explícito
   - Direito ao esquecimento

2. **Moderação de Conteúdo**
   - Validação manual de fotos (inicial)
   - Sistema de denúncia
   - Blacklist de usuários

3. **Pagamentos Seguros**
   - Nunca armazenar dados de cartão
   - Usar gateway (Stripe/Mercado Pago)
   - Split payment para comissões

4. **Verificação de Identidade**
   - Upload de documentos (fase futura)
   - Selfie com documento
   - Processo de verificação manual

---

## 📊 MÉTRICAS DE SUCESSO

- **Performance**: Lighthouse score > 90
- **PWA**: PWA score 100
- **Acessibilidade**: A11y score > 90
- **SEO**: SEO score > 85
- **Bundle Size**: < 200KB (gzipped)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **Criar repositório Git**
2. **Setup do projeto Vite + React**
3. **Configurar Tailwind com tema customizado**
4. **Criar componentes UI base**
5. **Setup Appwrite (criar projeto, collections)**
6. **Implementar autenticação básica**
7. **Criar primeira página (Home)**

---

## 📝 NOTAS IMPORTANTES

- **Mobile First**: SEMPRE começar pelo mobile
- **Acessibilidade**: Testar com screen readers
- **Performance**: Medir constantemente com Lighthouse
- **Git**: Commits semânticos e branches por feature
- **Code Review**: Revisar antes de merge
- **Documentation**: Documentar componentes complexos

---

## 🎯 COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview do build
npm run preview

# Lint
npm run lint

# Tests
npm run test

# Type check (se usar TypeScript)
npm run type-check
```

---

**Stack Confirmada:**
✅ React 18 + Vite
✅ Appwrite (BaaS)
✅ Tailwind CSS
✅ Framer Motion
✅ React Router v6
✅ Zustand
✅ React Hook Form + Zod
✅ Lucide React Icons

---

*Roadmap criado para desenvolvimento ágil e profissional* 🚀
*Estimativa total: 4-5 semanas para MVP completo*
