import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./public/infrastructure/public.routes').then((m) => m.PUBLIC_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./private/infrastructure/private.routes').then((m) => m.PRIVATE_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
