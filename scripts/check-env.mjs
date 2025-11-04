import 'dotenv/config';

const requiredKeys = [
    'VITE_APPWRITE_ENDPOINT',
    'VITE_APPWRITE_PROJECT_ID',
];

const optionalKeys = [
    'VITE_APPWRITE_DATABASE_ID',
    'VITE_APPWRITE_PROFILES_COLLECTION_ID',
    'VITE_APPWRITE_BOOKINGS_COLLECTION_ID',
    'VITE_APPWRITE_REVIEWS_COLLECTION_ID',
    'VITE_APPWRITE_CHATS_COLLECTION_ID',
    'VITE_APPWRITE_MESSAGES_COLLECTION_ID',
    'VITE_APPWRITE_BUCKET_ID',
    'APPWRITE_API_KEY', // Necessário apenas para MCP
];

function mask(value) {
	if (!value) return '<<MISSING>>';
	const v = String(value);
	if (v.length <= 6) return '***';
	return `${v.slice(0, 3)}***${v.slice(-3)}`;
}

const report = [...requiredKeys, ...optionalKeys].map((key) => ({
	key,
	set: Boolean(process.env[key]),
	value: mask(process.env[key])
}));

const missingRequired = report.filter(r => !r.set && requiredKeys.includes(r.key));
const missingOptional = report.filter(r => !r.set && optionalKeys.includes(r.key));

console.log('\nAppwrite .env check');
console.table(report);

if (missingRequired.length) {
    console.error(`\nFaltam variáveis obrigatórias: ${missingRequired.map(m => m.key).join(', ')}`);
    process.exitCode = 1;
} else {
    console.log('\nObrigatórias OK.');
    if (missingOptional.length) {
        console.warn(`Aviso: variáveis opcionais ausentes: ${missingOptional.map(m => m.key).join(', ')}`);
    }
}
