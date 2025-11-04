import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

console.log('🔍 Verificando collection pricing_configs...\n');

async function verifyPricing() {
  try {
    // Check if collection exists
    const collection = await databases.getCollection(DATABASE_ID, 'pricing_configs');
    console.log('✅ Collection existe:', collection.name);
    console.log('📝 ID:', collection.$id);
    console.log('🔒 Permissions:', collection.$permissions);

    // List all pricing configs
    console.log('\n📊 Listando configurações de preço...');
    const configs = await databases.listDocuments(DATABASE_ID, 'pricing_configs');
    console.log(`\n📦 Total de configurações: ${configs.total}`);

    if (configs.total > 0) {
      console.log('\n💰 Configurações encontradas:');
      configs.documents.forEach((doc, index) => {
        console.log(`\n${index + 1}. Tenant ID: ${doc.tenant_id}`);
        console.log(`   Base Price: R$ ${doc.basePrice || 300}`);
        console.log(`   Periods: ${doc.periods ? 'Configurado' : 'Não configurado'}`);
        console.log(`   Weekdays: ${doc.weekdays ? 'Configurado' : 'Não configurado'}`);

        if (doc.periods) {
          try {
            const periods = JSON.parse(doc.periods);
            console.log(`   Períodos:`, periods);
          } catch (e) {
            console.log(`   ⚠️ Erro ao parsear períodos`);
          }
        }

        if (doc.weekdays) {
          try {
            const weekdays = JSON.parse(doc.weekdays);
            console.log(`   Dias da semana:`, weekdays);
          } catch (e) {
            console.log(`   ⚠️ Erro ao parsear dias`);
          }
        }
      });
    } else {
      console.log('\n⚠️ Nenhuma configuração de preço encontrada!');
      console.log('💡 Dica: Configure os preços no Dashboard do profissional.');
    }

  } catch (error) {
    if (error.code === 404) {
      console.error('❌ Collection "pricing_configs" não encontrada!');
      console.log('\n💡 Execute: node scripts/create-pricing-collection.mjs');
    } else {
      console.error('❌ Erro:', error.message);
    }
  }
}

verifyPricing();
