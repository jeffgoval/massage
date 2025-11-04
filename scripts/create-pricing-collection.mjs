import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

console.log('💰 Criando collection de preços dinâmicos...\n');

async function createPricingCollection() {
  try {
    // Try to get existing collection
    try {
      const existing = await databases.getCollection(DATABASE_ID, 'pricing_configs');
      console.log('⚠️  Collection "pricing_configs" já existe');
      return;
    } catch (error) {
      if (error.code !== 404) {
        throw error;
      }
    }

    // Create collection
    console.log('📝 Criando collection "pricing_configs"...');
    const collection = await databases.createCollection(
      DATABASE_ID,
      'pricing_configs',
      'Pricing Configurations',
      [
        Permission.read(Role.any()), // Public read
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

    // tenant_id (relates to tenants collection)
    await databases.createStringAttribute(
      DATABASE_ID,
      'pricing_configs',
      'tenant_id',
      255,
      true // required
    );
    console.log('  ✅ tenant_id');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Base price
    await databases.createIntegerAttribute(
      DATABASE_ID,
      'pricing_configs',
      'basePrice',
      false, // not required so we can have default
      null,
      null,
      300 // default 300
    );
    console.log('  ✅ basePrice');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Periods config (JSON string)
    await databases.createStringAttribute(
      DATABASE_ID,
      'pricing_configs',
      'periods',
      5000,
      false
    );
    console.log('  ✅ periods');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Weekdays config (JSON string)
    await databases.createStringAttribute(
      DATABASE_ID,
      'pricing_configs',
      'weekdays',
      5000,
      false
    );
    console.log('  ✅ weekdays');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create index for tenant_id
    console.log('\n📑 Criando índice para tenant_id...');
    await databases.createIndex(
      DATABASE_ID,
      'pricing_configs',
      'tenant_id_index',
      'key',
      ['tenant_id'],
      ['ASC']
    );
    console.log('  ✅ Índice criado');

    console.log('\n✨ Collection "pricing_configs" criada com sucesso!');
    console.log('\n💡 Estrutura:');
    console.log('   - tenant_id: ID do profissional');
    console.log('   - basePrice: Preço base (integer)');
    console.log('   - periods: Config de períodos (JSON)');
    console.log('   - weekdays: Config de dias da semana (JSON)');
    console.log('\n🎉 Agora os preços dinâmicos estão disponíveis!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  }
}

createPricingCollection();
