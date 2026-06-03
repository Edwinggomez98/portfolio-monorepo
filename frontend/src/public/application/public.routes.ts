import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing-page.component').then(
        (m) => m.LandingPageComponent
      ),
  },
  {
    path: 'cotizador',
    loadComponent: () =>
      import('./quote/quote-page.component').then(
        (m) => m.QuotePageComponent
      ),
  },
];
