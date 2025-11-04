# 🚀 Quick Setup - Arquitetura Multi-Tenant

## ⚡ Setup Rápido (5 minutos)

### 1. Acesse o Appwrite Console
- URL: https://cloud.appwrite.io
- Vá para seu projeto: `690972f30012735fadb5`
- Entre no database: `690a1fc8001670a852ac`

---

## 📦 Criar Collections

### **Collection 1: tenants** (Profissionais como Tenants)

**Settings:**
- Collection ID: `tenants`
- Name: `tenants`

**Atributos Essenciais:**

```
tenant_id     | String  | 255 | ✅ Required
name          | String  | 255 | ✅ Required
display_name  | String  | 255 | ✅ Required
slug          | String  | 255 | ✅ Required | Unique
bio           | String  | 2000| ❌ Optional
tagline       | String  | 500 | ❌ Optional
location      | String  | 255 | ❌ Optional
isActive      | Boolean | -   | ❌ Optional | Default: true
isVip         | Boolean | -   | ❌ Optional | Default: false
isVerified    | Boolean | -   | ❌ Optional | Default: false
rating        | Float   | -   | ❌ Optional | Default: 0
reviewCount   | Integer | -   | ❌ Optional | Default: 0
totalBookings | Integer | -   | ❌ Optional | Default: 0
avatar        | String  | 500 | ❌ Optional
createdAt     | DateTime| -   | ❌ Optional
updatedAt     | DateTime| -   | ❌ Optional
```

**Indexes:**
1. **tenant_id_unique** - Type: `Unique`, Attributes: `tenant_id`
2. **slug_unique** - Type: `Unique`, Attributes: `slug`
3. **isActive_index** - Type: `Key`, Attributes: `isActive`

**Permissions:**
- Create: `any`
- Read: `any`
- Update: Owner or `admin`
- Delete: `admin`

---

### **Collection 2: packages** (Serviços por Tenant)

**Settings:**
- Collection ID: `packages`
- Name: `packages`

**Atributos Essenciais:**

```
tenant_id    | String  | 255  | ✅ Required | CRÍTICO!
name         | String  | 255  | ✅ Required
description  | String  | 2000 | ❌ Optional
type         | String  | 100  | ❌ Optional
category     | String  | 100  | ❌ Optional
price        | Integer | -    | ✅ Required | Em centavos
duration     | Integer | -    | ✅ Required | Em minutos
isActive     | Boolean | -    | ❌ Optional | Default: true
isPopular    | Boolean | -    | ❌ Optional | Default: false
createdAt    | DateTime| -    | ❌ Optional
updatedAt    | DateTime| -    | ❌ Optional
```

**Indexes:**
1. **tenant_id_index** - Type: `Key`, Attributes: `tenant_id` (OBRIGATÓRIO!)
2. **isActive_index** - Type: `Key`, Attributes: `isActive`
3. **tenant_active** - Type: `Key`, Attributes: `tenant_id, isActive`

**Permissions:**
- Create: `any` (owner will be validated in code)
- Read: `any`
- Update: Owner (tenant) or `admin`
- Delete: Owner or `admin`

---

### **Collection 3: users** (Metadata)

Já criamos antes, mas confirme que tem:

```
userId    | String  | 255 | ✅ Required | Unique
email     | Email   | 255 | ✅ Required
name      | String  | 255 | ✅ Required
role      | String  | 50  | ✅ Required | Default: cliente
isActive  | Boolean | -   | ❌ Optional | Default: true
createdAt | DateTime| -   | ❌ Optional
```

---

### **Collection 4-7: Atualizar Collections Existentes**

Se você já criou `bookings`, `reviews`, `chats`, `messages`, adicione:

#### Em **bookings**:
```
tenant_id | String | 255 | ✅ Required
```
Index: `tenant_id` (Type: Key)

#### Em **reviews**:
```
tenant_id | String | 255 | ✅ Required
```
Index: `tenant_id` (Type: Key)

#### Em **chats**:
```
tenant_id | String | 255 | ✅ Required
```
Index: `tenant_id` (Type: Key)

#### Em **messages**:
```
tenant_id | String | 255 | ✅ Required
```
Index: `tenant_id` (Type: Key)

---

## 🔄 Reiniciar Servidor

Depois de criar as collections:

```bash
# Pare o servidor (Ctrl+C se rodando)
# Reinicie:
npm run dev
```

---

## ✅ Testar

1. Acesse: http://localhost:5175
2. Clique em "Criar Conta"
3. Escolha **Profissional**
4. Preencha os dados
5. Clique em "Criar Conta"

**O que vai acontecer:**
- ✅ Cria usuário no Appwrite Auth
- ✅ Cria documento em `users`
- ✅ Cria documento em `tenants` (profissional como tenant)
- ✅ Cria pacote padrão em `packages` (Massagem Relaxante - R$200)

---

## 🐛 Troubleshooting

### Erro: "Missing required parameter: collectionId"
- Verifique se todas as variáveis estão no `.env`
- Reinicie o servidor após editar `.env`

### Erro: "Document with the requested ID already exists"
- Você já tem um tenant com esse ID
- Delete o tenant antigo no Appwrite Console
- Ou use outro email

### Erro: "Attribute not found"
- Você não criou todos os atributos
- Volte no Appwrite Console e adicione os atributos faltando

---

## 📚 Próximos Passos

Depois que tudo estiver funcionando:

1. **Listar Profissionais** - Ver todos os tenants na Home
2. **Página do Profissional** - Ver detalhes e pacotes do tenant
3. **Sistema de Agendamento** - Cliente agenda com tenant específico
4. **Dashboard do Profissional** - Gerenciar pacotes, bookings, etc

---

## 💡 Conceitos Importantes

- **tenant_id = userId do profissional**
- **Clientes NÃO são tenants** - apenas agendam com tenants
- **Isolamento rigoroso** - Todas as queries filtram por tenant_id
- **Cada profissional** tem seus próprios pacotes/serviços
- **Escalável** - Fácil adicionar novos profissionais

---

**Dúvidas?** Veja `MULTI-TENANT-ARCHITECTURE.md` para documentação completa.
