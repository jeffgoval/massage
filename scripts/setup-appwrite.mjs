import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

console.log('🚀 Iniciando setup do Appwrite...');
console.log('📦 Database ID:', DATABASE_ID);

// ============================================
// HELPER FUNCTIONS
// ============================================

async function createCollectionIfNotExists(collectionId, name) {
  try {
    const collection = await databases.getCollection(DATABASE_ID, collectionId);
    console.log(`✅ Collection "${name}" já existe (${collectionId})`);
    return collection;
  } catch (error) {
    if (error.code === 404) {
      console.log(`📝 Criando collection "${name}"...`);
      const collection = await databases.createCollection(
        DATABASE_ID,
        collectionId,
        name,
        [],
        false,
        true
      );
      console.log(`✅ Collection "${name}" criada com sucesso!`);
      return collection;
    }
    throw error;
  }
}

async function createAttributeIfNotExists(collectionId, key, type, size, required, defaultValue, array = false) {
  try {
    await databases.getAttribute(DATABASE_ID, collectionId, key);
    console.log(`  ↳ Atributo "${key}" já existe`);
  } catch (error) {
    if (error.code === 404) {
      console.log(`  ↳ Criando atributo "${key}" (${type})...`);

      switch (type) {
        case 'string':
          await databases.createStringAttribute(DATABASE_ID, collectionId, key, size, required, defaultValue, array);
          break;
        case 'email':
          await databases.createEmailAttribute(DATABASE_ID, collectionId, key, required, defaultValue);
          break;
        case 'integer':
          await databases.createIntegerAttribute(DATABASE_ID, collectionId, key, required, null, null, defaultValue);
          break;
        case 'float':
          await databases.createFloatAttribute(DATABASE_ID, collectionId, key, required, null, null, defaultValue);
          break;
        case 'boolean':
          await databases.createBooleanAttribute(DATABASE_ID, collectionId, key, required, defaultValue);
          break;
        case 'datetime':
          await databases.createDatetimeAttribute(DATABASE_ID, collectionId, key, required, defaultValue);
          break;
        default:
          throw new Error(`Tipo desconhecido: ${type}`);
      }

      // Wait for attribute to be ready
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      throw error;
    }
  }
}

async function createIndexIfNotExists(collectionId, key, type, attributes, orders = []) {
  try {
    await databases.getIndex(DATABASE_ID, collectionId, key);
    console.log(`  ↳ Index "${key}" já existe`);
  } catch (error) {
    if (error.code === 404) {
      console.log(`  ↳ Criando index "${key}"...`);
      await databases.createIndex(DATABASE_ID, collectionId, key, type, attributes, orders);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      throw error;
    }
  }
}

// ============================================
// COLLECTION 1: USERS
// ============================================

async function setupUsersCollection() {
  console.log('\n📋 Collection: users');
  await createCollectionIfNotExists('users', 'users');

  await createAttributeIfNotExists('users', 'userId', 'string', 255, true);
  await createAttributeIfNotExists('users', 'email', 'email', 255, true);
  await createAttributeIfNotExists('users', 'name', 'string', 255, true);
  await createAttributeIfNotExists('users', 'role', 'string', 50, false, 'cliente');
  await createAttributeIfNotExists('users', 'isActive', 'boolean', null, false, true);
  await createAttributeIfNotExists('users', 'createdAt', 'datetime', null, false);

  await createIndexIfNotExists('users', 'userId_unique', 'unique', ['userId']);
  await createIndexIfNotExists('users', 'role_index', 'key', ['role']);
}

// ============================================
// COLLECTION 2: TENANTS
// ============================================

async function setupTenantsCollection() {
  console.log('\n📋 Collection: tenants');
  await createCollectionIfNotExists('tenants', 'tenants');

  await createAttributeIfNotExists('tenants', 'tenant_id', 'string', 255, true);
  await createAttributeIfNotExists('tenants', 'name', 'string', 255, true);
  await createAttributeIfNotExists('tenants', 'display_name', 'string', 255, true);
  await createAttributeIfNotExists('tenants', 'slug', 'string', 255, true);
  await createAttributeIfNotExists('tenants', 'bio', 'string', 2000, false);
  await createAttributeIfNotExists('tenants', 'tagline', 'string', 500, false);
  await createAttributeIfNotExists('tenants', 'location', 'string', 255, false);
  await createAttributeIfNotExists('tenants', 'isActive', 'boolean', null, false, true);
  await createAttributeIfNotExists('tenants', 'isVip', 'boolean', null, false, false);
  await createAttributeIfNotExists('tenants', 'isVerified', 'boolean', null, false, false);
  await createAttributeIfNotExists('tenants', 'rating', 'float', null, false, 0);
  await createAttributeIfNotExists('tenants', 'reviewCount', 'integer', null, false, 0);
  await createAttributeIfNotExists('tenants', 'totalBookings', 'integer', null, false, 0);
  await createAttributeIfNotExists('tenants', 'avatar', 'string', 500, false);
  await createAttributeIfNotExists('tenants', 'createdAt', 'datetime', null, false);
  await createAttributeIfNotExists('tenants', 'updatedAt', 'datetime', null, false);

  await createIndexIfNotExists('tenants', 'tenant_id_unique', 'unique', ['tenant_id']);
  await createIndexIfNotExists('tenants', 'slug_unique', 'unique', ['slug']);
  await createIndexIfNotExists('tenants', 'isActive_index', 'key', ['isActive']);
}

// ============================================
// COLLECTION 3: PACKAGES
// ============================================

async function setupPackagesCollection() {
  console.log('\n📋 Collection: packages');
  await createCollectionIfNotExists('packages', 'packages');

  await createAttributeIfNotExists('packages', 'tenant_id', 'string', 255, true);
  await createAttributeIfNotExists('packages', 'name', 'string', 255, true);
  await createAttributeIfNotExists('packages', 'description', 'string', 2000, false);
  await createAttributeIfNotExists('packages', 'type', 'string', 100, false);
  await createAttributeIfNotExists('packages', 'category', 'string', 100, false);
  await createAttributeIfNotExists('packages', 'price', 'integer', null, true);
  await createAttributeIfNotExists('packages', 'duration', 'integer', null, true);
  await createAttributeIfNotExists('packages', 'isActive', 'boolean', null, false, true);
  await createAttributeIfNotExists('packages', 'isPopular', 'boolean', null, false, false);
  await createAttributeIfNotExists('packages', 'createdAt', 'datetime', null, false);
  await createAttributeIfNotExists('packages', 'updatedAt', 'datetime', null, false);

  await createIndexIfNotExists('packages', 'tenant_id_index', 'key', ['tenant_id']);
  await createIndexIfNotExists('packages', 'isActive_index', 'key', ['isActive']);
}

// ============================================
// COLLECTION 4: BOOKINGS
// ============================================

async function setupBookingsCollection() {
  console.log('\n📋 Collection: bookings');
  await createCollectionIfNotExists('bookings', 'bookings');

  await createAttributeIfNotExists('bookings', 'client_id', 'string', 255, true);
  await createAttributeIfNotExists('bookings', 'tenant_id', 'string', 255, true);
  await createAttributeIfNotExists('bookings', 'package_id', 'string', 255, true);
  await createAttributeIfNotExists('bookings', 'date', 'datetime', null, true);
  await createAttributeIfNotExists('bookings', 'duration', 'integer', null, false, 60);
  await createAttributeIfNotExists('bookings', 'location', 'string', 500, false);
  await createAttributeIfNotExists('bookings', 'specialRequests', 'string', 1000, false);
  await createAttributeIfNotExists('bookings', 'status', 'string', 50, false, 'pending');
  await createAttributeIfNotExists('bookings', 'price', 'integer', null, false);
  await createAttributeIfNotExists('bookings', 'paymentStatus', 'string', 50, false, 'pending');
  await createAttributeIfNotExists('bookings', 'createdAt', 'datetime', null, false);

  await createIndexIfNotExists('bookings', 'tenant_id_index', 'key', ['tenant_id']);
  await createIndexIfNotExists('bookings', 'client_id_index', 'key', ['client_id']);
  await createIndexIfNotExists('bookings', 'status_index', 'key', ['status']);
}

// ============================================
// COLLECTION 5: REVIEWS
// ============================================

async function setupReviewsCollection() {
  console.log('\n📋 Collection: reviews');
  await createCollectionIfNotExists('reviews', 'reviews');

  await createAttributeIfNotExists('reviews', 'client_id', 'string', 255, true);
  await createAttributeIfNotExists('reviews', 'tenant_id', 'string', 255, true);
  await createAttributeIfNotExists('reviews', 'booking_id', 'string', 255, true);
  await createAttributeIfNotExists('reviews', 'rating', 'integer', null, true);
  await createAttributeIfNotExists('reviews', 'comment', 'string', 1000, false);
  await createAttributeIfNotExists('reviews', 'isVerified', 'boolean', null, false, false);
  await createAttributeIfNotExists('reviews', 'createdAt', 'datetime', null, false);

  await createIndexIfNotExists('reviews', 'tenant_id_index', 'key', ['tenant_id']);
  await createIndexIfNotExists('reviews', 'booking_id_unique', 'unique', ['booking_id']);
}

// ============================================
// COLLECTION 6: CHATS
// ============================================

async function setupChatsCollection() {
  console.log('\n📋 Collection: chats');
  await createCollectionIfNotExists('chats', 'chats');

  await createAttributeIfNotExists('chats', 'client_id', 'string', 255, true);
  await createAttributeIfNotExists('chats', 'tenant_id', 'string', 255, true);
  await createAttributeIfNotExists('chats', 'lastMessage', 'string', 500, false);
  await createAttributeIfNotExists('chats', 'lastMessageTime', 'datetime', null, false);
  await createAttributeIfNotExists('chats', 'unreadCount', 'integer', null, false, 0);
  await createAttributeIfNotExists('chats', 'createdAt', 'datetime', null, false);

  await createIndexIfNotExists('chats', 'tenant_id_index', 'key', ['tenant_id']);
  await createIndexIfNotExists('chats', 'client_id_index', 'key', ['client_id']);
}

// ============================================
// COLLECTION 7: MESSAGES
// ============================================

async function setupMessagesCollection() {
  console.log('\n📋 Collection: messages');
  await createCollectionIfNotExists('messages', 'messages');

  await createAttributeIfNotExists('messages', 'chat_id', 'string', 255, true);
  await createAttributeIfNotExists('messages', 'tenant_id', 'string', 255, true);
  await createAttributeIfNotExists('messages', 'sender_id', 'string', 255, true);
  await createAttributeIfNotExists('messages', 'content', 'string', 2000, true);
  await createAttributeIfNotExists('messages', 'type', 'string', 50, false, 'text');
  await createAttributeIfNotExists('messages', 'isRead', 'boolean', null, false, false);
  await createAttributeIfNotExists('messages', 'createdAt', 'datetime', null, false);

  await createIndexIfNotExists('messages', 'chat_id_index', 'key', ['chat_id']);
  await createIndexIfNotExists('messages', 'tenant_id_index', 'key', ['tenant_id']);
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  try {
    await setupUsersCollection();
    await setupTenantsCollection();
    await setupPackagesCollection();
    await setupBookingsCollection();
    await setupReviewsCollection();
    await setupChatsCollection();
    await setupMessagesCollection();

    console.log('\n🎉 SETUP CONCLUÍDO COM SUCESSO!');
    console.log('\n✅ Todas as collections foram criadas!');
    console.log('✅ Todos os atributos foram configurados!');
    console.log('✅ Todos os indexes foram criados!');
    console.log('\n💡 Próximo passo: Reinicie o servidor (npm run dev)');

  } catch (error) {
    console.error('\n❌ Erro durante setup:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

main();
