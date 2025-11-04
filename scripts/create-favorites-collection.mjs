import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

console.log('💾 Criando collection de favoritos...\n');

async function createFavoritesCollection() {
  try {
    // Try to get existing collection
    try {
      const existing = await databases.getCollection(DATABASE_ID, 'favorites');
      console.log('⚠️  Collection "favorites" já existe');
      return;
    } catch (error) {
      if (error.code !== 404) {
        throw error;
      }
    }

    // Create collection
    console.log('📝 Criando collection "favorites"...');
    const collection = await databases.createCollection(
      DATABASE_ID,
      'favorites',
      'Favorites',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false,
      true
    );

    console.log('✅ Collection criada com sucesso!');
    console.log('\n📝 Criando atributos...');

    // Wait a bit for collection to be ready
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // user_id (quem salvou)
    await databases.createStringAttribute(
      DATABASE_ID,
      'favorites',
      'user_id',
      255,
      true
    );
    console.log('  ✅ user_id');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // tenant_id (perfil salvo)
    await databases.createStringAttribute(
      DATABASE_ID,
      'favorites',
      'tenant_id',
      255,
      true
    );
    console.log('  ✅ tenant_id');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create indexes
    console.log('\n📑 Criando índices...');

    await databases.createIndex(
      DATABASE_ID,
      'favorites',
      'user_id_index',
      'key',
      ['user_id'],
      ['ASC']
    );
    console.log('  ✅ Índice user_id criado');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await databases.createIndex(
      DATABASE_ID,
      'favorites',
      'tenant_id_index',
      'key',
      ['tenant_id'],
      ['ASC']
    );
    console.log('  ✅ Índice tenant_id criado');

    // Create compound index for unique constraint
    await databases.createIndex(
      DATABASE_ID,
      'favorites',
      'user_tenant_unique',
      'unique',
      ['user_id', 'tenant_id'],
      ['ASC', 'ASC']
    );
    console.log('  ✅ Índice único user_tenant criado');

    console.log('\n✨ Collection "favorites" criada com sucesso!');
    console.log('\n💡 Estrutura:');
    console.log('   - user_id: ID do usuário que salvou');
    console.log('   - tenant_id: ID do perfil/profissional salvo');
    console.log('\n🎉 Agora os usuários podem salvar perfis favoritos!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  }
}

createFavoritesCollection();
