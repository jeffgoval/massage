# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Premium Massage App - A PWA (Progressive Web App) for booking sensual massage services. Built with React + Vite, using Appwrite as Backend-as-a-Service, with a luxury-themed design system using Tailwind CSS.

## Commands

### Development
```bash
npm run dev              # Start dev server (Vite)
npm run build            # Build for production
npm run preview          # Preview production build
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors automatically
npm run format           # Format code with Prettier
npm run format:check     # Check formatting without changes
```

### Testing
```bash
npm run test             # Run tests with Vitest
npm run env:check        # Validate environment variables
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + Vite
- **Backend**: Appwrite (BaaS) - handles authentication, database, storage, and real-time
- **Styling**: Tailwind CSS with custom luxury theme
- **State Management**: Zustand (src/store/)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa with Workbox

### Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Input, Badge)
│   ├── layout/          # Layout components (Header, Footer, BottomNav)
│   ├── profile/         # Profile-specific components (ProfileCard)
│   └── common/          # Common components (RequireAuth)
├── pages/               # Page components mapped to routes
│   ├── Auth/            # Login, Register
│   ├── Provider/        # Provider Dashboard
│   └── [page].jsx       # Home, Search, Profile, Chat, Booking
├── services/            # Appwrite service layer
│   ├── appwrite.js      # Appwrite client configuration
│   ├── auth.js          # Authentication service
│   ├── database.js      # Database operations
│   └── storage.js       # File storage operations
├── store/               # Zustand state stores
│   ├── authStore.js     # User authentication state
│   └── chatStore.js     # Chat state management
└── App.jsx              # Main app with router configuration
```

### Key Patterns

#### 1. Appwrite Service Layer
All Appwrite interactions go through service files in `src/services/`:
- `appwrite.js` - Client configuration (exports account, databases, storage, Query)
- `auth.js` - Authentication methods (login, register, logout, getCurrentUser)
- `database.js` - CRUD operations for collections
- `storage.js` - File upload/download operations

#### 2. State Management with Zustand
Global state is managed with Zustand stores:
- `authStore.js` - User session and authentication state
- `chatStore.js` - Chat and messaging state
- Stores expose async actions that call services directly

#### 3. Environment Variables
Required variables (defined but not tracked in .env):
- `VITE_APPWRITE_ENDPOINT` - Appwrite API endpoint
- `VITE_APPWRITE_PROJECT_ID` - Appwrite project ID
- `VITE_APPWRITE_DATABASE_ID` - Database ID
- `VITE_APPWRITE_PROFILES_COLLECTION_ID` - Profiles collection
- `VITE_APPWRITE_BOOKINGS_COLLECTION_ID` - Bookings collection
- `VITE_APPWRITE_REVIEWS_COLLECTION_ID` - Reviews collection
- `VITE_APPWRITE_CHATS_COLLECTION_ID` - Chats collection
- `VITE_APPWRITE_BUCKET_ID` - Storage bucket for photos

Access via: `import.meta.env.VITE_*`

#### 4. Routing Structure
Main routes (defined in src/App.jsx):
- `/` - Home page with featured profiles
- `/search` - Search/filter page with advanced filters
- `/profile/:id` - Profile detail page
- `/chat` - Chat interface
- `/booking/:id` - Booking flow
- `/provider` - Provider dashboard
- `/login`, `/register` - Authentication pages

#### 5. Design System (Tailwind)
Custom luxury theme defined in `tailwind.config.js`:
- **Colors**: crimson (primary), gold (accent), luxury (grayscale)
- **Fonts**: Playfair Display (display), Inter (body)
- **Custom utilities**: gradient-primary, gradient-gold, gradient-dark
- **Shadows**: luxury, gold, crimson
- **Border radius**: luxury (16px)

See `DESIGN-SYSTEM-SPECS.md` for complete design specifications.

### Appwrite Collections Schema (Multi-Tenant Architecture)

**Important:** This app uses a **multi-tenant architecture** where each professional is an independent tenant.

1. **users** - User metadata with role information (userId, email, name, role, isActive, createdAt)
2. **tenants** - Professionals as independent tenants (tenant_id, name, slug, location, settings, etc.)
3. **packages** - Services/packages per tenant (tenant_id, name, price, duration, isActive)
4. **bookings** - Booking requests with tenant isolation (client_id, tenant_id, package_id, date, status)
5. **reviews** - Reviews per tenant (client_id, tenant_id, booking_id, rating)
6. **chats** - Chat conversations per tenant (client_id, tenant_id)
7. **messages** - Messages with tenant isolation (chat_id, tenant_id)

**Key Concept:**
- **tenant_id = userId** of the professional
- Every professional is a tenant with isolated data
- All collections related to a professional MUST have `tenant_id` for data isolation
- All queries MUST filter by `tenant_id` to prevent data leakage

See `MULTI-TENANT-ARCHITECTURE.md` for complete documentation.

### Component Conventions

#### UI Components (src/components/ui/)
Reusable presentational components:
- Accept variant props for styling (e.g., `variant="primary"`)
- Use Tailwind classes with luxury theme colors
- Often wrapped with Framer Motion for animations
- Examples: Button, Card, Input, Badge

#### Page Components (src/pages/)
Route-level components that:
- Fetch data using services
- Manage local state
- Compose UI components
- Handle user interactions

### Authentication & User Roles

The app implements a complete role-based authentication system with 3 user types:
- **Cliente** - Can search and book services
- **Profissional** - Can offer services and manage profile
- **Admin** - Full moderation access

#### Authentication Flow
1. User registers via `Register.jsx` and selects role (Cliente or Profissional)
2. Registration creates Appwrite account, session, and user metadata document
3. Role stored in both user preferences and database for redundancy
4. Auth store initialized on app load to restore session
5. Protected routes use `RequireAuth` and `RequireRole` components

#### Role-Based Access Control (RBAC)
```javascript
import { useAuth } from '../hooks/useAuth';

const { user, role, can, isProfessional, isAdmin } = useAuth();

// Check permissions
if (can('canBook')) { /* show booking UI */ }
if (can('canManageProfile')) { /* show profile editor */ }

// Check roles
if (isProfessional) { /* show provider dashboard */ }
if (isAdmin) { /* show admin panel */ }
```

See `AUTH-IMPLEMENTATION.md` for complete documentation on authentication and user roles.

### PWA Configuration

PWA setup in `vite.config.js`:
- Auto-updates enabled
- Standalone display mode
- Portrait orientation
- Theme: crimson (#8b0000)
- Background: black (#000000)

## Development Guidelines

### Mobile-First Approach
This is a mobile-first PWA. Always:
- Test on mobile viewports first
- Use responsive Tailwind classes (sm:, md:, lg:)
- Ensure touch targets are at least 44x44px
- Use BottomNav for mobile navigation

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route to `src/App.jsx` Routes
3. Add navigation link to Header/BottomNav if needed
4. Implement data fetching via services

### Adding Appwrite Features
1. Add service method in appropriate service file
2. Call from component or store action
3. Handle loading/error states in UI
4. Use environment variables for IDs

### Styling Guidelines
- Use Tailwind utility classes
- Follow luxury theme colors (crimson, gold, luxury)
- Use font-display for headings, font-body for text
- Apply consistent spacing (multiples of 4px)
- Add hover/active states with transitions
- Use Framer Motion for complex animations

## Common Patterns

### Fetching Data
```javascript
import { databases } from '../services/appwrite';

const data = await databases.listDocuments(
  import.meta.env.VITE_APPWRITE_DATABASE_ID,
  import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID
);
```

### Using Auth Store
```javascript
import { useAuthStore } from '../store/authStore';

const { user, login, logout } = useAuthStore();
```

### Protected Routes
```javascript
<Route
  path="/protected"
  element={
    <RequireAuth>
      <ProtectedPage />
    </RequireAuth>
  }
/>
```

## Key Files to Reference

- `ROADMAP.md` - Complete feature roadmap and technical specs
- `DESIGN-SYSTEM-SPECS.md` - Full design system documentation with examples
- `package.json` - Dependencies and available scripts
- `tailwind.config.js` - Theme configuration
- `vite.config.js` - Build and PWA configuration
