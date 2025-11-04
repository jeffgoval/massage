import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

console.log('📝 Adicionando campos físicos ao tenant...\n');

async function addAttribute(collectionId, key, type, size, required, defaultValue) {
  try {
    if (type === 'string') {
      await databases.createStringAttribute(DATABASE_ID, collectionId, key, size, required, defaultValue);
    } else if (type === 'integer') {
      await databases.createIntegerAttribute(DATABASE_ID, collectionId, key, required, 0, undefined, defaultValue);
    }
    console.log(`✅ ${key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️  ${key} (já existe)`);
    } else {
      console.error(`❌ ${key}:`, error.message);
    }
  }
}

async function main() {
  // Add physical attributes to tenants collection
  await addAttribute('tenants', 'age', 'integer', null, false, 25);
  await addAttribute('tenants', 'height', 'string', 10, false, '');
  await addAttribute('tenants', 'weight', 'string', 10, false, '');
  await addAttribute('tenants', 'ethnicity', 'string', 50, false, '');
  await addAttribute('tenants', 'eyeColor', 'string', 30, false, '');
  await addAttribute('tenants', 'hairColor', 'string', 30, false, '');
  await addAttribute('tenants', 'responseTime', 'string', 20, false, '5min');

  console.log('\n🎉 Campos físicos adicionados com sucesso!');
  console.log('💡 Agora você pode editar esses campos no dashboard.');
}

main().catch(console.error);
