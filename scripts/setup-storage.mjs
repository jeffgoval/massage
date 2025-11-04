import { Client, Storage, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const storage = new Storage(client);

console.log('📦 Configurando Storage no Appwrite...\n');

async function setupStorage() {
  try {
    // Create profiles bucket
    const bucket = await storage.createBucket(
      'profiles', // bucketId
      'Profile Images', // name
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false, // fileSecurity
      true, // enabled
      10 * 1024 * 1024, // maximumFileSize (10MB)
      ['png', 'jpeg', 'jpg', 'webp', 'gif'], // allowedFileExtensions (use extensions, not MIME types)
      'none', // compression
      false, // encryption
      false // antivirus
    );

    console.log('✅ Bucket "profiles" criado com sucesso!');
    console.log(`   - ID: ${bucket.$id}`);
    console.log(`   - Tamanho máximo: 10MB`);
    console.log(`   - Formatos aceitos: PNG, JPEG, JPG, WEBP, GIF`);
    console.log('\n💡 Adicione ao seu .env:');
    console.log(`VITE_APPWRITE_PROFILES_BUCKET_ID=${bucket.$id}`);
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  Bucket "profiles" já existe!');
      console.log('\n💡 Adicione ao seu .env:');
      console.log('VITE_APPWRITE_PROFILES_BUCKET_ID=profiles');
    } else {
      console.error('❌ Erro ao criar bucket:', error.message);
    }
  }
}

setupStorage();
