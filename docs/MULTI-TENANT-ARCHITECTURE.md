# 🏢 Multi-Tenant Architecture

## Visão Geral

Cada **profissional é um tenant independente** com isolamento rigoroso de dados, permitindo:
- Pacotes de serviços personalizados por profissional
- Configurações específicas por tenant
- Escalabilidade e separação de dados
- Billing/cobrança independente por tenant

## Hierarquia de Dados

```
┌─────────────────────────────────────────┐
│           PLATAFORMA                    │
│  (Nível Global - Admin)                 │
└─────────────────────────────────────────┘
              │
              ├─── Cliente (User Role: cliente)
              │    └─── Pode agendar com qualquer tenant
              │
              └─── Profissional (User Role: profissional)
                   │
                   ├─── É um TENANT (tenant_id = userId)
                   │
                   ├─── Tem seu próprio PROFILE (tenant)
                   │
                   ├─── Tem seus próprios PACKAGES
                   │    ├─── Massagem Relaxante - R$200/h
                   │    ├─── Massagem Terapêutica - R$250/h
                   │    └─── Pacote VIP 3h - R$500
                   │
                   ├─── Tem seus próprios BOOKINGS
                   │    └─── (cliente_id, tenant_id, package_id)
                   │
                   └─── Tem suas próprias REVIEWS
                        └─── (cliente_id, tenant_id, booking_id)
```

## Conceito: Tenant = Profissional

### Tenant ID
- **tenant_id** = **userId** do profissional
- Cada profissional é um tenant independente
- Clientes não são tenants, apenas usuários da plataforma

### Isolamento de Dados

**Regra Crítica**: Toda query deve filtrar por `tenant_id` quando aplicável

```javascript
// ❌ ERRADO - Pode vazar dados entre tenants
const bookings = await databases.listDocuments(DB_ID, 'bookings');

// ✅ CORRETO - Sempre filtrar por tenant_id
const bookings = await databases.listDocuments(DB_ID, 'bookings', [
  Query.equal('tenant_id', currentTenantId)
]);
```

## Schema das Collections

### 1. **tenants** (Profissionais como Tenants)

```javascript
{
  tenant_id: string,        // = userId do profissional (único)
  name: string,             // Nome comercial do profissional
  display_name: string,     // Nome de exibição
  slug: string,             // URL amigável: /profissional/maria-silva

  // Informações do Profissional
  bio: string,
  tagline: string,
  specialties: string[],
  certifications: string[],

  // Localização
  location: {
    city: string,
    state: string,
    address: string,
    coordinates: { lat, lng }
  },

  // Características
  age: number,
  height: string,
  weight: string,
  ethnicity: string,

  // Status e Configurações
  isActive: boolean,        // Tenant está ativo?
  isVip: boolean,          // Plano VIP
  isVerified: boolean,     // Verificado pela plataforma

  // Estatísticas
  rating: number,
  reviewCount: number,
  totalBookings: number,

  // Mídia
  avatar: string,          // Foto principal
  photos: string[],        // Galeria

  // Configurações de Negócio
  settings: {
    autoAcceptBookings: boolean,
    requireDeposit: boolean,
    depositPercentage: number,
    cancellationPolicy: string,
    advanceBookingDays: number,
    maxBookingsPerDay: number
  },

  // Billing (futuro)
  billing: {
    plan: string,           // free, basic, premium
    commissionRate: number, // % para plataforma
    stripeAccountId: string
  },

  // Metadata
  createdAt: datetime,
  updatedAt: datetime
}
```

**Indexes:**
- `tenant_id` (unique)
- `slug` (unique)
- `isActive`, `isVip`, `rating`

---

### 2. **packages** (Serviços/Pacotes por Tenant)

```javascript
{
  package_id: string,       // ID único do pacote
  tenant_id: string,        // Profissional dono do pacote (OBRIGATÓRIO)

  // Informações do Pacote
  name: string,             // "Massagem Relaxante"
  description: string,      // Descrição detalhada
  type: string,             // "massage", "therapy", "combo"
  category: string,         // "relaxante", "terapeutica", "sensual"

  // Preço e Duração
  price: number,            // Preço em centavos (ex: 20000 = R$200)
  duration: number,         // Duração em minutos

  // Configurações
  isActive: boolean,        // Disponível para agendamento?
  isPopular: boolean,       // Destacar como popular
  maxClientsPerSession: number, // Para sessões em grupo

  // Inclusões
  includes: string[],       // ["Óleo aromático", "Toalhas quentes"]

  // Disponibilidade
  availability: {
    daysOfWeek: number[],   // [0,1,2,3,4,5,6] (domingo=0)
    timeSlots: string[],    // ["09:00", "10:00", "14:00"]
  },

  // Metadata
  createdAt: datetime,
  updatedAt: datetime
}
```

**Indexes:**
- `tenant_id` (key) - **CRÍTICO para isolamento**
- `isActive`
- Compound: `(tenant_id, isActive)`

---

### 3. **bookings** (Agendamentos com Tenant)

```javascript
{
  booking_id: string,

  // Relacionamentos (SEMPRE COM TENANT_ID)
  client_id: string,        // Cliente que agendou
  tenant_id: string,        // Profissional (tenant)
  package_id: string,       // Pacote contratado

  // Data e Hora
  date: datetime,
  duration: number,         // Minutos
  startTime: string,        // "14:00"
  endTime: string,          // "16:00"

  // Localização
  location: {
    type: string,           // "client_place", "professional_place", "hotel"
    address: string,
    notes: string
  },

  // Pagamento
  price: number,            // Preço total em centavos
  deposit: number,          // Depósito pago
  paymentStatus: string,    // "pending", "paid", "refunded"
  paymentMethod: string,

  // Status do Agendamento
  status: string,           // "pending", "confirmed", "completed", "cancelled"

  // Pedidos especiais
  specialRequests: string,

  // Cancelamento
  cancellation: {
    cancelledAt: datetime,
    cancelledBy: string,    // "client" ou "professional"
    reason: string,
    refundAmount: number
  },

  // Metadata
  createdAt: datetime,
  updatedAt: datetime
}
```

**Indexes:**
- `tenant_id` (key) - **CRÍTICO**
- `client_id` (key)
- `status`
- `date`
- Compound: `(tenant_id, status, date)`
- Compound: `(client_id, status)`

**Permissions:**
- Read: Client OR Tenant OR Admin
- Update: Tenant OR Admin
- Delete: Admin only

---

### 4. **reviews** (Avaliações com Tenant)

```javascript
{
  review_id: string,

  // Relacionamentos
  client_id: string,
  tenant_id: string,        // Profissional avaliado (OBRIGATÓRIO)
  booking_id: string,       // Agendamento relacionado

  // Avaliação
  rating: number,           // 1-5
  comment: string,

  // Aspectos específicos
  ratings: {
    service: number,        // 1-5
    punctuality: number,
    cleanliness: number,
    communication: number
  },

  // Status
  isVerified: boolean,      // Cliente verificado
  isVisible: boolean,       // Mostrar publicamente

  // Resposta do Profissional
  response: {
    text: string,
    respondedAt: datetime
  },

  // Metadata
  createdAt: datetime
}
```

**Indexes:**
- `tenant_id` (key) - **CRÍTICO**
- `booking_id` (unique)
- Compound: `(tenant_id, isVisible)`

---

### 5. **chats** (Conversas isoladas por Tenant)

```javascript
{
  chat_id: string,

  // Participantes
  client_id: string,
  tenant_id: string,        // Profissional (OBRIGATÓRIO)

  // Última mensagem
  lastMessage: string,
  lastMessageTime: datetime,

  // Status
  unreadCount_client: number,
  unreadCount_tenant: number,

  // Metadata
  createdAt: datetime
}
```

**Indexes:**
- Compound: `(tenant_id, client_id)` (unique)
- `tenant_id`
- `client_id`

---

### 6. **messages** (Mensagens isoladas por Tenant)

```javascript
{
  message_id: string,
  chat_id: string,
  tenant_id: string,        // Para isolamento (OBRIGATÓRIO)

  // Remetente
  sender_id: string,        // client_id ou tenant_id
  sender_type: string,      // "client" ou "tenant"

  // Conteúdo
  content: string,
  type: string,             // "text", "image", "booking_request"

  // Status
  isRead: boolean,

  // Metadata
  createdAt: datetime
}
```

**Indexes:**
- `chat_id`
- `tenant_id` - **CRÍTICO para isolamento**

---

## Helpers para Isolamento de Dados

### getTenantId()
```javascript
/**
 * Retorna o tenant_id do usuário atual
 * - Se profissional: retorna seu próprio userId
 * - Se cliente: retorna null (não é tenant)
 * - Se admin: pode acessar qualquer tenant
 */
export const getTenantId = (user, role) => {
  if (role === 'profissional') return user.$id;
  if (role === 'admin') return null; // Admin pode ver todos
  return null; // Cliente não tem tenant
};
```

### withTenantFilter()
```javascript
/**
 * Adiciona filtro de tenant_id automaticamente
 */
export const withTenantFilter = (tenantId, otherQueries = []) => {
  if (!tenantId) throw new Error('tenant_id required');
  return [Query.equal('tenant_id', tenantId), ...otherQueries];
};
```

### ensureTenantOwnership()
```javascript
/**
 * Valida se o tenant tem permissão para acessar/modificar recurso
 */
export const ensureTenantOwnership = (resource, currentTenantId) => {
  if (resource.tenant_id !== currentTenantId) {
    throw new Error('Unauthorized: Access denied to this tenant resource');
  }
  return true;
};
```

---

## Fluxo de Criação de Profissional

```javascript
async function registerProfessional(email, password, name) {
  // 1. Criar usuário no Appwrite Auth
  const user = await account.create(ID.unique(), email, password, name);

  // 2. Criar sessão
  await account.createEmailPasswordSession(email, password);

  // 3. Definir role
  await account.updatePrefs({ role: 'profissional' });

  // 4. Criar metadata do usuário
  await db.createUserMetadata({
    userId: user.$id,
    role: 'profissional',
    // ...
  });

  // 5. Criar TENANT (profissional)
  const tenant = await db.createTenant({
    tenant_id: user.$id,        // tenant_id = userId
    name: name,
    display_name: name,
    slug: slugify(name),
    isActive: true,
    isVerified: false,
    isVip: false,
    rating: 0,
    reviewCount: 0,
    // ...
  });

  // 6. Criar pacotes iniciais (opcional)
  await db.createPackage({
    tenant_id: user.$id,
    name: 'Massagem Básica',
    price: 20000, // R$200
    duration: 60,
    isActive: true
  });

  return { user, tenant };
}
```

---

## Fluxo de Agendamento (Cliente → Tenant)

```javascript
async function createBooking(clientId, tenantId, packageId, date, time) {
  // 1. Validar que o pacote pertence ao tenant
  const package = await db.getPackage(packageId);
  ensureTenantOwnership(package, tenantId);

  // 2. Criar booking com tenant_id
  const booking = await db.createBooking({
    client_id: clientId,
    tenant_id: tenantId,      // SEMPRE INCLUIR
    package_id: packageId,
    date: date,
    startTime: time,
    price: package.price,
    status: 'pending',
    // ...
  });

  // 3. Notificar tenant
  await notifyTenant(tenantId, `Novo agendamento de ${clientName}`);

  return booking;
}
```

---

## Queries Seguras

### ❌ ERRADO (pode vazar dados)
```javascript
// Buscar todos os bookings - PERIGOSO!
const bookings = await databases.listDocuments(DB_ID, 'bookings');
```

### ✅ CORRETO (isolado por tenant)
```javascript
// Buscar bookings do tenant atual
const bookings = await databases.listDocuments(DB_ID, 'bookings', [
  Query.equal('tenant_id', currentTenantId)
]);

// Buscar bookings do cliente (pode ver de vários tenants)
const bookings = await databases.listDocuments(DB_ID, 'bookings', [
  Query.equal('client_id', currentClientId)
]);
```

---

## Permissões no Appwrite

### Collection: packages
- **Create**: Role `profissional` AND tenant_id = user.$id
- **Read**: `any` (público)
- **Update**: tenant_id = user.$id
- **Delete**: tenant_id = user.$id

### Collection: bookings
- **Create**: Role `cliente`
- **Read**: client_id = user.$id OR tenant_id = user.$id
- **Update**: tenant_id = user.$id (profissional pode atualizar)
- **Delete**: Role `admin`

---

## Benefícios desta Arquitetura

1. **Isolamento Total**: Cada profissional tem seus dados separados
2. **Escalabilidade**: Fácil adicionar novos profissionais sem conflitos
3. **Flexibilidade**: Cada tenant pode ter configurações únicas
4. **Segurança**: Impossível acessar dados de outro tenant
5. **Billing Independente**: Cada tenant pode ter seu próprio plano
6. **Multi-tenant SaaS**: Base para crescer como plataforma

---

## Próximos Passos

1. ✅ Criar collection `tenants`
2. ✅ Criar collection `packages`
3. ✅ Adicionar `tenant_id` em todas as collections
4. ✅ Implementar helpers de isolamento
5. ✅ Atualizar todas as queries com filtros de tenant
6. ✅ Configurar permissões baseadas em tenant
7. ✅ Testar isolamento de dados rigorosamente

---

**Regra de Ouro**: Se a collection armazena dados relacionados a um profissional, **DEVE ter tenant_id**.
