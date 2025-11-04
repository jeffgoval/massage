import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const TENANTS_COLLECTION_ID = 'tenants';

console.log('💰 Adicionando campo de preços à collection tenants...\n');

async function addPricingField() {
  try {
    // Check if field already exists
    try {
      await databases.getAttribute(DATABASE_ID, TENANTS_COLLECTION_ID, 'pricing');
      console.log('⚠️  Campo "pricing" já existe na collection tenants');
      return;
    } catch (error) {
      if (error.code !== 404) {
        throw error;
      }
    }

    // Create pricing field
    console.log('📝 Criando campo "pricing" (string para armazenar JSON)...');
    await databases.createStringAttribute(
      DATABASE_ID,
      TENANTS_COLLECTION_ID,
      'pricing',
      10000, // Tamanho máximo (JSON pode ser grande)
      false, // not required
      null, // no default value
      false // not array
    );

    console.log('✅ Campo "pricing" criado com sucesso!');
    console.log('\n💡 O campo armazenará uma estrutura JSON com:');
    console.log('   - basePrice: Preço base da sessão');
    console.log('   - periods: Acréscimos por período (manhã, tarde, noite, madrugada)');
    console.log('   - weekdays: Acréscimos por dia da semana');
    console.log('\n🎉 Agora os profissionais podem configurar preços dinâmicos!');

    // Wait for attribute to be available
    console.log('\n⏳ Aguardando atributo ficar disponível...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('✨ Concluído! Acesse o Dashboard do Provedor > Aba "Preços"');
  } catch (error) {
    console.error('❌ Erro ao adicionar campo:', error.message);
  }
}

addPricingField();
