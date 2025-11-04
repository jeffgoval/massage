import { Client, Storage, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const storage = new Storage(client);

console.log('📦 Atualizando configurações do bucket "profiles"...\n');

async function updateBucket() {
  try {
    // Update the profiles bucket with correct file extensions
    const bucket = await storage.updateBucket(
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

    console.log('✅ Bucket "profiles" atualizado com sucesso!');
    console.log(`   - ID: ${bucket.$id}`);
    console.log(`   - Tamanho máximo: 10MB`);
    console.log(`   - Formatos aceitos: PNG, JPEG, JPG, WEBP, GIF`);
    console.log('\n✨ Agora você pode fazer upload de imagens no dashboard!');
  } catch (error) {
    console.error('❌ Erro ao atualizar bucket:', error.message);
    console.log('\n💡 Dica: Verifique se as credenciais no .env estão corretas');
    console.log('   e se você tem permissões de administrador no projeto Appwrite.');
  }
}

updateBucket();
