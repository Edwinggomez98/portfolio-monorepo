import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing-page.component').then(
        (m) => m.LandingPageComponent
      ),
  },
];
