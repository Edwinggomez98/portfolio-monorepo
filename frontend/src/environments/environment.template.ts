/**
 * Plantilla de referencia. Los archivos reales se generan automáticamente:
 *   - environment.ts      → npm start (lee frontend/.env)
 *   - environment.prod.ts → npm run build:prod (lee API_URL + API_KEY de Vercel/CI)
 * No commitear environment.ts ni environment.prod.ts.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiKey: '<API_KEY desde frontend/.env>',
};
