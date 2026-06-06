import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, '');
}

function parseAllowedOrigins(): string[] {
  const raw = process.env.CORS_ORIGIN || 'http://localhost:4200';
  return raw.split(',').map(normalizeOrigin).filter(Boolean);
}

function isVercelPreview(origin: string): boolean {
  if (process.env.CORS_ALLOW_VERCEL !== 'true') return false;
  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

export function buildCorsOptions(): CorsOptions {
  const allowed = parseAllowedOrigins();
  const isProd = process.env.NODE_ENV === 'production';

  return {
    origin: (origin, callback) => {
      if (!origin) {
        // En producción rechazar peticiones sin Origin (curl, scanners).
        // El health check de Render no envía Origin pero usa @Public() en el guard.
        return callback(null, !isProd);
      }

      const normalized = normalizeOrigin(origin);

      if (allowed.includes(normalized) || isVercelPreview(normalized)) {
        return callback(null, true);
      }

      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-API-Key'],
  };
}
