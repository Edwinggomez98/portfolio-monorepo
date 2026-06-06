/**
 * Genera environment.ts (dev) o environment.prod.ts (prod) desde frontend/.env
 * o variables de entorno (Vercel / CI).
 *
 * Dev:  node scripts/set-env.js --dev
 * Prod: node scripts/set-env.js
 */
const fs = require('fs');
const path = require('path');

const isDev = process.argv.includes('--dev');
const rootDir = path.join(__dirname, '..');
const envFilePath = path.join(rootDir, '.env');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const vars = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

function resolveVar(name, fileVars, fallback) {
  return process.env[name] || fileVars[name] || fallback;
}

const fileVars = loadEnvFile(envFilePath);

const apiUrl = resolveVar(
  'API_URL',
  fileVars,
  isDev ? 'http://localhost:3000/api' : undefined,
);
const apiKey = resolveVar('API_KEY', fileVars, isDev ? undefined : undefined);

if (!apiUrl) {
  console.error('ERROR: API_URL no está definida.');
  console.error('Copia frontend/.env.example → frontend/.env y configura API_URL.');
  process.exit(1);
}

if (!apiKey) {
  console.error('ERROR: API_KEY no está definida.');
  console.error('Copia frontend/.env.example → frontend/.env (mismo valor que backend/.env).');
  process.exit(1);
}

const normalized = apiUrl.replace(/\/$/, '');
const escapedKey = apiKey.replace(/'/g, "\\'");
const outFile = isDev ? 'environment.ts' : 'environment.prod.ts';
const outPath = path.join(rootDir, 'src/environments', outFile);

const content = `// Generado por scripts/set-env.js — no editar ni commitear
export const environment = {
  production: ${isDev ? 'false' : 'true'},
  apiUrl: '${normalized}',
  apiKey: '${escapedKey}',
};
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log(`${outFile} → apiUrl: ${normalized}`);
