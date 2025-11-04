import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

console.log('📝 Adicionando campos ao tenant...\n');

async function addAttribute(collectionId, key, type, size, required, defaultValue) {
  try {
    if (type === 'string') {
      await databases.createStringAttribute(DATABASE_ID, collectionId, key, size, required, defaultValue);
    } else if (type === 'boolean') {
      await databases.createBooleanAttribute(DATABASE_ID, collectionId, key, required, defaultValue);
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
  // Add new fields to tenants collection
  await addAttribute('tenants', 'phone', 'string', 20, false, '');
  await addAttribute('tenants', 'whatsapp', 'string', 20, false, '');
  await addAttribute('tenants', 'coverPhoto', 'string', 500, false, '');
  await addAttribute('tenants', 'photos', 'string', 5000, false, ''); // JSON array string
  await addAttribute('tenants', 'amenities', 'string', 2000, false, ''); // JSON array string
  await addAttribute('tenants', 'availability', 'string', 1000, false, ''); // JSON object string

  console.log('\n🎉 Campos adicionados com sucesso!');
  console.log('💡 Agora você pode editar esses campos no dashboard.');
}

main().catch(console.error);
