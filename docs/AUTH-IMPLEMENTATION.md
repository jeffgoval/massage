# Authentication & User Roles Implementation

## Overview

This application implements a complete authentication system with **3 user types** based on Appwrite's authentication and database services:

1. **Cliente (Client)** - Can search and book massage services
2. **Profissional (Professional)** - Can offer services and manage their profile
3. **Admin** - Full moderation and administrative access

## Architecture

### User Role Storage

User roles are stored in two places for redundancy and performance:

1. **Appwrite User Preferences** (`prefs.role`) - Fast access during authentication
2. **Custom Users Collection** - Extended metadata and queryable role information

### Key Components

```
src/
├── utils/
│   └── constants.js          # Role definitions and permissions
├── services/
│   ├── auth.js               # Authentication service with role support
│   └── database.js           # Database operations including user metadata
├── store/
│   └── authStore.js          # Zustand store for auth state
├── hooks/
│   └── useAuth.js            # Custom hook for RBAC
└── components/
    └── common/
        ├── RequireAuth.jsx   # Authentication protection
        └── RequireRole.jsx   # Role-based protection
```

## User Roles & Permissions

### Role Definitions (src/utils/constants.js)

```javascript
export const USER_ROLES = {
  CLIENTE: 'cliente',
  PROFISSIONAL: 'profissional',
  ADMIN: 'admin',
};

export const ROLE_PERMISSIONS = {
  cliente: {
    canBook: true,
    canReview: true,
    canChat: true,
    canManageProfile: false,
    canModerate: false,
  },
  profissional: {
    canBook: false,
    canReview: false,
    canChat: true,
    canManageProfile: true,
    canModerate: false,
    canManageBookings: true,
    canManageAvailability: true,
  },
  admin: {
    // Full access to everything
  },
};
```

## Authentication Flow

### 1. Registration with Role Selection

```javascript
// In Register.jsx
import { useAuthStore } from '../../store/authStore.js';

const { register } = useAuthStore();

// User selects role in UI (Cliente or Profissional)
await register(email, password, name, selectedRole);
```

**What happens during registration:**
1. Create Appwrite account
2. Create email session (auto-login)
3. Update user preferences with role
4. Create user metadata document in database
5. If professional, create empty profile document
6. Update Zustand store with user data and role

### 2. Login

```javascript
import { useAuthStore } from '../../store/authStore.js';

const { login } = useAuthStore();

await login(email, password);
```

**What happens during login:**
1. Create email session with Appwrite
2. Fetch user account data
3. Get role from user preferences
4. Fetch user metadata from database
5. Update Zustand store

### 3. App Initialization

```javascript
// In App.jsx
import { useAuthStore } from './store/authStore.js';

const init = useAuthStore((state) => state.init);

useEffect(() => {
  init(); // Restore session on app load
}, [init]);
```

## Role-Based Access Control (RBAC)

### Using the useAuth Hook

```javascript
import { useAuth } from '../hooks/useAuth.js';

function MyComponent() {
  const { user, role, isAuthenticated, isProfessional, can } = useAuth();

  if (!isAuthenticated) return <LoginPrompt />;

  return (
    <div>
      <h1>Welcome {user.name}!</h1>
      <p>Role: {role}</p>

      {/* Permission-based rendering */}
      {can('canBook') && <BookButton />}
      {can('canManageProfile') && <EditProfileButton />}

      {/* Role-based rendering */}
      {isProfessional && <ProviderDashboard />}
    </div>
  );
}
```

### Permission Checks

```javascript
const { can, canAny, canAll } = useAuth();

// Single permission
if (can('canBook')) {
  // Show booking UI
}

// Any of multiple permissions
if (canAny('canBook', 'canManageBookings')) {
  // Show bookings list
}

// All permissions required
if (canAll('canModerate', 'isAdmin')) {
  // Show admin panel
}
```

### Route Protection

#### Require Authentication

```javascript
import RequireAuth from './components/common/RequireAuth.jsx';

<Route
  path="/chat"
  element={
    <RequireAuth>
      <Chat />
    </RequireAuth>
  }
/>
```

#### Require Specific Roles

```javascript
import RequireRole from './components/common/RequireRole.jsx';
import { USER_ROLES } from './utils/constants.js';

<Route
  path="/provider"
  element={
    <RequireAuth>
      <RequireRole roles={[USER_ROLES.PROFISSIONAL, USER_ROLES.ADMIN]}>
        <ProviderDashboard />
      </RequireRole>
    </RequireAuth>
  }
/>
```

## Appwrite Setup Required

### 1. Environment Variables

Add to `.env`:

```env
VITE_APPWRITE_USERS_COLLECTION_ID=users-collection-id
```

### 2. Create Users Collection

Create a new collection in Appwrite with these attributes:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | Appwrite user ID (indexed, unique) |
| email | string | Yes | User email |
| name | string | Yes | User name |
| role | string | Yes | User role (cliente/profissional/admin) |
| isActive | boolean | No | Account active status |
| createdAt | datetime | No | Registration date |

**Indexes:**
- `userId` - unique index for fast lookups
- `role` - key index for role-based queries

**Permissions:**
- Read: `role:all` (anyone authenticated can read)
- Create: `role:all` (handled by registration flow)
- Update: `role:admin` or document owner
- Delete: `role:admin`

### 3. Update Profiles Collection

Ensure the profiles collection has:
- `userId` attribute (string, required, indexed)
- Proper permissions for professionals to manage their own profiles

## Auth Store Methods

```javascript
const authStore = useAuthStore();

// Check authentication
authStore.isAuthenticated() // boolean

// Check roles
authStore.isAdmin()         // boolean
authStore.isProfessional()  // boolean
authStore.isClient()        // boolean
authStore.hasRole('admin')  // boolean

// User data
authStore.user              // Appwrite user object
authStore.role              // Current user role
authStore.metadata          // User metadata from database

// Auth actions
await authStore.login(email, password)
await authStore.register(email, password, name, role)
await authStore.logout()
await authStore.init()      // Restore session
```

## Security Considerations

### 1. Client-Side Role Validation

⚠️ **Important:** Client-side role checks are for UX only. Always validate permissions server-side (Appwrite Functions) for critical operations.

### 2. Role Updates

Currently, users can only update their own role via `account.updatePrefs()`. For admin role management, implement:
- Server-side Appwrite Function with Admin SDK
- Proper admin authentication
- Audit logging

### 3. Sensitive Operations

For sensitive operations (payments, profile verification, etc.):
1. Use Appwrite Functions (server-side)
2. Verify user role server-side
3. Use proper permission rules in collections
4. Implement rate limiting

## Example: Conditional UI Rendering

```javascript
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../utils/constants';

function Navigation() {
  const { role, isAuthenticated } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/search">Search</Link>

      {isAuthenticated && (
        <>
          <Link to="/chat">Chat</Link>

          {role === USER_ROLES.PROFISSIONAL && (
            <Link to="/provider">My Dashboard</Link>
          )}

          {role === USER_ROLES.ADMIN && (
            <Link to="/admin">Admin Panel</Link>
          )}
        </>
      )}
    </nav>
  );
}
```

## Testing Different User Types

### Test Accounts

Create test accounts for each role:

```javascript
// Cliente
await register('cliente@test.com', 'password123', 'Test Cliente', USER_ROLES.CLIENTE);

// Profissional
await register('prof@test.com', 'password123', 'Test Professional', USER_ROLES.PROFISSIONAL);

// Admin (via database manual update)
await register('admin@test.com', 'password123', 'Test Admin', USER_ROLES.ADMIN);
```

### Manual Role Update (Development Only)

In Appwrite Console:
1. Go to Authentication > Users
2. Select user
3. Update Preferences: `{"role": "admin"}`
4. Go to Database > users collection
5. Find user document
6. Update `role` field to "admin"

## Future Enhancements

### 1. Email Verification
```javascript
await authService.sendVerification();
```

### 2. Password Reset
Implement using `account.createRecovery()`

### 3. Two-Factor Authentication
Add MFA using Appwrite's MFA features

### 4. Team/Organization Support
Use Appwrite Teams for multi-user organizations

### 5. Activity Logging
Track user actions in a separate collection

## Troubleshooting

### Issue: User role not persisting

**Solution:** Check that:
1. User preferences are being updated: `account.updatePrefs({ role })`
2. User metadata document is created in database
3. Auth store is initialized on app load

### Issue: Unauthorized access to protected routes

**Solution:**
1. Ensure `RequireAuth` and `RequireRole` components wrap protected routes
2. Check that auth store is initialized before routing
3. Verify role permissions in `constants.js`

### Issue: Cannot read user role

**Solution:**
1. Check that `init()` is called in App.jsx
2. Verify user preferences have `role` field
3. Check user metadata exists in database

## Migration Guide

If you have existing users without roles:

1. Create server-side script to add default role
2. Update all existing user preferences
3. Create user metadata documents for existing users
4. Assign default role: `cliente`
