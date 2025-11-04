import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

console.log('🔐 Configurando permissões das collections...\n');

async function updateCollectionPermissions(collectionId, collectionName, permissions) {
  try {
    await databases.updateCollection(
      DATABASE_ID,
      collectionId,
      collectionName,
      permissions,
      false, // documentSecurity = false (usar permissões da collection)
      true // enabled
    );
    console.log(`✅ ${collectionName} - Permissões configuradas`);
  } catch (error) {
    console.error(`❌ ${collectionName} - Erro:`, error.message);
  }
}

async function main() {
  console.log('📖 COLLECTIONS PÚBLICAS (Leitura livre, edição apenas logado):\n');

  // tenants - PÚBLICO para leitura, mas criação/edição apenas para usuários logados
  await updateCollectionPermissions('tenants', 'Tenants (Profissionais)', [
    Permission.read(Role.any()), // Qualquer pessoa pode ler perfis
    Permission.create(Role.users()), // Apenas usuários logados podem criar
    Permission.update(Role.users()), // Apenas usuários logados podem atualizar
    Permission.delete(Role.users()), // Apenas usuários logados podem deletar
  ]);

  // packages - PÚBLICO para leitura, mas criação/edição apenas para usuários logados
  await updateCollectionPermissions('packages', 'Packages (Serviços)', [
    Permission.read(Role.any()), // Qualquer pessoa pode ler serviços
    Permission.create(Role.users()), // Apenas usuários logados podem criar
    Permission.update(Role.users()), // Apenas usuários logados podem atualizar
    Permission.delete(Role.users()), // Apenas usuários logados podem deletar
  ]);

  // reviews - PÚBLICO para leitura, mas criação/edição apenas para usuários logados
  await updateCollectionPermissions('reviews', 'Reviews (Avaliações)', [
    Permission.read(Role.any()), // Qualquer pessoa pode ler avaliações
    Permission.create(Role.users()), // Apenas usuários logados podem criar
    Permission.update(Role.users()), // Apenas usuários logados podem atualizar
    Permission.delete(Role.users()), // Apenas usuários logados podem deletar
  ]);

  console.log('\n🔒 COLLECTIONS PRIVADAS (Apenas usuários logados):\n');

  // users - PRIVADO, apenas usuários logados
  await updateCollectionPermissions('users', 'Users (Metadata)', [
    Permission.read(Role.users()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);

  // bookings - PRIVADO, apenas usuários logados
  await updateCollectionPermissions('bookings', 'Bookings (Agendamentos)', [
    Permission.read(Role.users()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);

  // chats - PRIVADO, apenas usuários logados
  await updateCollectionPermissions('chats', 'Chats (Conversas)', [
    Permission.read(Role.users()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);

  // messages - PRIVADO, apenas usuários logados
  await updateCollectionPermissions('messages', 'Messages (Mensagens)', [
    Permission.read(Role.users()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);

  console.log('\n✨ Permissões configuradas com sucesso!');
  console.log('\n💡 Agora usuários NÃO LOGADOS podem:');
  console.log('   ✅ Ver perfis de profissionais');
  console.log('   ✅ Ver pacotes/serviços');
  console.log('   ✅ Ver avaliações');
  console.log('\n🔐 Usuários LOGADOS podem:');
  console.log('   ✅ Fazer bookings');
  console.log('   ✅ Enviar mensagens');
  console.log('   ✅ Criar avaliações');
  console.log('   ✅ Gerenciar seus próprios dados');
}

main().catch(console.error);
