/**
 * Genera environment.prod.ts desde la variable API_URL (Vercel / CI).
 * Uso local: API_URL=https://tu-api.onrender.com/api npm run build:prod
 */
const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL;
if (!apiUrl) {
  console.error('ERROR: API_URL no está definida.');
  console.error('En Vercel: Settings → Environment Variables → API_URL=https://tu-servicio.onrender.com/api');
  process.exit(1);
}

const normalized = apiUrl.replace(/\/$/, '');
const mobileApiKey = (process.env.MOBILE_API_KEY || '').replace(/'/g, "\\'");
const outPath = path.join(__dirname, '../src/environments/environment.prod.ts');

const content = `// Generado en build por scripts/set-env.js — no editar ni commitear
export const environment = {
  production: true,
  apiUrl: '${normalized}',
  mobileApiKey: '${mobileApiKey}',
  mobileApiUrl: 'https://api.mobileapi.dev',
};
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log('environment.prod.ts → apiUrl:', normalized);
