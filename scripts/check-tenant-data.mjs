import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_APIKEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

console.log('🔍 Verificando dados do tenant...\n');

async function checkTenant() {
  try {
    const tenantId = '690a450f0023a9eb118a';
    const tenant = await databases.getDocument(DATABASE_ID, 'tenants', tenantId);

    console.log('📋 Dados do Tenant:');
    console.log('=====================================');
    console.log('ID:', tenant.$id);
    console.log('Nome:', tenant.name || tenant.display_name);
    console.log('Idade:', tenant.age);
    console.log('Altura:', tenant.height);
    console.log('Peso:', tenant.weight);
    console.log('Etnia:', tenant.ethnicity);
    console.log('Cor dos Olhos:', tenant.eyeColor);
    console.log('Cor do Cabelo:', tenant.hairColor);
    console.log('WhatsApp:', tenant.whatsapp);
    console.log('Localização:', tenant.location);
    console.log('Bio:', tenant.bio);
    console.log('Tagline:', tenant.tagline);
    console.log('isActive:', tenant.isActive);
    console.log('isVerified:', tenant.isVerified);
    console.log('isVip:', tenant.isVip);
    console.log('rating:', tenant.rating);
    console.log('reviewCount:', tenant.reviewCount);
    console.log('\n📸 Fotos:', tenant.photos ? 'Configuradas' : 'Não configuradas');
    console.log('🏠 Amenities:', tenant.amenities ? 'Configuradas' : 'Não configuradas');
    console.log('⏰ Availability:', tenant.availability ? 'Configurado' : 'Não configurado');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkTenant();
