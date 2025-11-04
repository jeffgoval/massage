# Appwrite Setup Guide

This guide walks you through setting up Appwrite for the Premium Massage App with role-based authentication.

## Prerequisites

- Appwrite account (cloud.appwrite.io or self-hosted)
- Project created in Appwrite Console

## Step 1: Create Database

1. Go to **Databases** in Appwrite Console
2. Click **Create Database**
3. Name: `premium-massage-db` (or your preference)
4. Copy the **Database ID** - you'll need it for `.env`

## Step 2: Create Collections

### Collection 1: users (User Metadata)

**Purpose:** Store extended user information including roles

1. Click **Create Collection**
2. Name: `users`
3. Collection ID: `users` (or auto-generate)
4. Click **Create**

#### Attributes

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| userId | String | 255 | Yes | - | No |
| email | Email | 255 | Yes | - | No |
| name | String | 255 | Yes | - | No |
| role | String | 50 | Yes | cliente | No |
| isActive | Boolean | - | No | true | No |
| createdAt | DateTime | - | No | - | No |

#### Indexes

1. **userId_unique**
   - Type: Unique
   - Attributes: `userId`

2. **role_index**
   - Type: Key
   - Attributes: `role`

#### Permissions

Settings > Permissions:

- **Create**: `role:all` (any authenticated user)
- **Read**: `role:all` (any authenticated user)
- **Update**: `role:admin` or document owner
- **Delete**: `role:admin`

### Collection 2: profiles (Professional Profiles)

1. Click **Create Collection**
2. Name: `profiles`
3. Collection ID: `profiles`

#### Attributes

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| userId | String | 255 | Yes | - | No |
| name | String | 255 | Yes | - | No |
| email | Email | 255 | No | - | No |
| tagline | String | 500 | No | - | No |
| bio | String | 2000 | No | - | No |
| age | Integer | - | No | - | No |
| height | String | 50 | No | - | No |
| weight | String | 50 | No | - | No |
| ethnicity | String | 100 | No | - | No |
| bodyType | String | 100 | No | - | No |
| location | String | 255 | No | - | No |
| price | Integer | - | No | - | No |
| rating | Float | - | No | 0 | No |
| reviewCount | Integer | - | No | 0 | No |
| isVip | Boolean | - | No | false | No |
| isVerified | Boolean | - | No | false | No |
| isAvailable | Boolean | - | No | false | No |
| photos | String | 2000 | No | - | Yes |
| specialties | String | 500 | No | - | Yes |
| amenities | String | 500 | No | - | Yes |
| availability | String | 1000 | No | - | No |
| responseTime | String | 100 | No | - | No |

#### Indexes

1. **userId_unique**
   - Type: Unique
   - Attributes: `userId`

2. **location_fulltext**
   - Type: Fulltext
   - Attributes: `location`

3. **rating_desc**
   - Type: Key
   - Attributes: `rating`
   - Order: DESC

4. **isVip_index**
   - Type: Key
   - Attributes: `isVip`

#### Permissions

- **Create**: `role:profissional`, `role:admin`
- **Read**: `role:all`
- **Update**: Document owner or `role:admin`
- **Delete**: Document owner or `role:admin`

### Collection 3: bookings

1. Click **Create Collection**
2. Name: `bookings`
3. Collection ID: `bookings`

#### Attributes

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| clientId | String | 255 | Yes | - |
| profileId | String | 255 | Yes | - |
| date | DateTime | - | Yes | - |
| duration | Integer | - | No | 60 |
| location | String | 500 | No | - |
| specialRequests | String | 1000 | No | - |
| status | String | 50 | No | pending |
| price | Integer | - | No | - |
| paymentStatus | String | 50 | No | pending |

#### Indexes

1. **clientId_index** - Type: Key, Attributes: `clientId`
2. **profileId_index** - Type: Key, Attributes: `profileId`
3. **date_index** - Type: Key, Attributes: `date`

#### Permissions

- **Create**: `role:cliente`, `role:admin`
- **Read**: Client or Professional involved, or `role:admin`
- **Update**: Client or Professional involved, or `role:admin`
- **Delete**: `role:admin`

### Collection 4: reviews

1. Click **Create Collection**
2. Name: `reviews`
3. Collection ID: `reviews`

#### Attributes

| Attribute | Type | Size | Required |
|-----------|------|------|----------|
| clientId | String | 255 | Yes |
| profileId | String | 255 | Yes |
| bookingId | String | 255 | Yes |
| rating | Integer | - | Yes |
| comment | String | 1000 | No |
| isVerified | Boolean | - | No |

#### Indexes

1. **profileId_index** - Type: Key, Attributes: `profileId`
2. **bookingId_unique** - Type: Unique, Attributes: `bookingId`

#### Permissions

- **Create**: `role:cliente`, `role:admin` (after booking completed)
- **Read**: `role:all`
- **Update**: `role:admin` only
- **Delete**: `role:admin` only

### Collections 5 & 6: chats & messages

Create these collections following similar patterns for real-time messaging.

## Step 3: Create Storage Bucket

1. Go to **Storage** in Appwrite Console
2. Click **Create Bucket**
3. Name: `photos`
4. Bucket ID: Copy for `.env`

### Bucket Settings

- **File Size Limit**: 10 MB
- **Allowed File Extensions**: jpg, jpeg, png, webp
- **Encryption**: Enabled
- **Antivirus**: Enabled (if available)

### Bucket Permissions

- **Create**: `role:profissional`, `role:admin`
- **Read**: `role:all`
- **Update**: File owner or `role:admin`
- **Delete**: File owner or `role:admin`

## Step 4: Environment Variables

Create `.env` file in project root:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id

# Database & Collections
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_USERS_COLLECTION_ID=users
VITE_APPWRITE_PROFILES_COLLECTION_ID=profiles
VITE_APPWRITE_BOOKINGS_COLLECTION_ID=bookings
VITE_APPWRITE_REVIEWS_COLLECTION_ID=reviews
VITE_APPWRITE_CHATS_COLLECTION_ID=chats
VITE_APPWRITE_MESSAGES_COLLECTION_ID=messages

# Storage
VITE_APPWRITE_BUCKET_ID=your-bucket-id
```

## Step 5: Configure Authentication

1. Go to **Authentication** in Appwrite Console
2. Enable **Email/Password** authentication
3. Configure email templates (optional)
4. Set session length (default: 1 year)

## Step 6: API Keys (Optional)

For server-side operations (future):

1. Go to **Settings** > **API Keys**
2. Create API key with appropriate scopes
3. Store securely (DO NOT commit to Git)

## Step 7: Test Setup

Run validation script:

```bash
npm run env:check
```

This will verify:
- All environment variables are set
- Connection to Appwrite works
- Collections exist

## Common Issues

### Issue: "Document not found" errors

**Solution:** Ensure collection IDs in `.env` match exactly in Appwrite Console.

### Issue: Permission denied

**Solution:**
1. Check collection permissions include appropriate roles
2. Verify user has correct role in preferences
3. Check that user metadata document exists

### Issue: Cannot upload images

**Solution:**
1. Verify bucket ID is correct
2. Check file size limits
3. Ensure file extension is allowed
4. Check bucket permissions

## Security Best Practices

1. **Never expose API keys** - Use environment variables
2. **Validate permissions** - Double-check collection permissions
3. **Use HTTPS** - Always use secure endpoints
4. **Rate limiting** - Configure in Appwrite settings
5. **Backup data** - Regular database exports
6. **Monitor usage** - Check Appwrite analytics

## Next Steps

1. Create test user accounts for each role
2. Test registration flow
3. Test role-based access control
4. Populate with sample data
5. Test all CRUD operations

## Support

- Appwrite Docs: https://appwrite.io/docs
- Discord Community: https://appwrite.io/discord
- GitHub Issues: https://github.com/appwrite/appwrite
