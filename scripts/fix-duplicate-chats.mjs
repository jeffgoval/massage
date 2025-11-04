import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

console.log('🔍 Verificando e corrigindo chats duplicados...\n');

async function fixDuplicateChats() {
  try {
    // 1. Listar todos os chats
    console.log('📋 Listando todos os chats...');
    const allChats = await databases.listDocuments(DATABASE_ID, 'chats', []);
    console.log(`Total de chats: ${allChats.total}`);

    // 2. Encontrar duplicatas
    const chatMap = new Map();
    const duplicates = [];

    allChats.documents.forEach(chat => {
      const key = `${chat.client_id}_${chat.tenant_id}`;

      if (chatMap.has(key)) {
        // É uma duplicata
        duplicates.push(chat);
      } else {
        // Primeiro chat com essa combinação
        chatMap.set(key, chat);
      }
    });

    console.log(`\n🔍 Duplicatas encontradas: ${duplicates.length}`);

    // 3. Remover duplicatas (mantém o mais antigo)
    if (duplicates.length > 0) {
      console.log('\n🗑️  Removendo chats duplicados...');

      for (const duplicate of duplicates) {
        console.log(`  Removendo chat ${duplicate.$id} (client: ${duplicate.client_id}, tenant: ${duplicate.tenant_id})`);
        await databases.deleteDocument(DATABASE_ID, 'chats', duplicate.$id);
      }

      console.log(`✅ ${duplicates.length} chats duplicados removidos!`);
    } else {
      console.log('✅ Nenhuma duplicata encontrada!');
    }

    // 4. Criar índice único para prevenir futuras duplicatas
    console.log('\n📑 Criando índice único para prevenir duplicatas...');

    try {
      // Verificar se o índice já existe
      const collection = await databases.getCollection(DATABASE_ID, 'chats');
      const hasUniqueIndex = collection.indexes.some(
        index => index.key === 'client_tenant_unique' || index.type === 'unique'
      );

      if (hasUniqueIndex) {
        console.log('⚠️  Índice único já existe');
      } else {
        await databases.createIndex(
          DATABASE_ID,
          'chats',
          'client_tenant_unique',
          'unique',
          ['client_id', 'tenant_id'],
          ['ASC', 'ASC']
        );
        console.log('✅ Índice único criado com sucesso!');
      }
    } catch (indexError) {
      if (indexError.code === 409) {
        console.log('⚠️  Índice único já existe');
      } else {
        console.error('❌ Erro ao criar índice:', indexError.message);
      }
    }

    console.log('\n✨ Processo concluído!');
    console.log('💡 Agora não será mais possível criar chats duplicados.');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  }
}

fixDuplicateChats();
