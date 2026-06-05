/**
 * Plantilla de referencia. El archivo real (environment.prod.ts) se genera en build
 * desde la variable API_URL (Vercel / CI). No commitear environment.prod.ts.
 */
export const environment = {
  production: true,
  apiUrl: '${API_URL}',
  mobileApiKey: '',
  mobileApiUrl: 'https://api.mobileapi.dev',
};
