import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { QuoteFormComponent } from './components/quote-form/quote-form.component';
import { QuoteItemListComponent } from './components/quote-item-list/quote-item-list.component';
import { QuoteSummaryComponent } from './components/quote-summary/quote-summary.component';

@Component({
  selector: 'app-quote-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    QuoteFormComponent,
    QuoteItemListComponent,
    QuoteSummaryComponent,
  ],
  template: `
    <app-header />

    <main class="pt-16 min-h-screen bg-gray-50 dark:bg-darkbg transition-colors duration-300">

      <!-- Hero de la página -->
      <div class="bg-white dark:bg-darkbg-card border-b border-gray-100 dark:border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-3">
            <a routerLink="/" class="hover:text-primary dark:hover:text-accent transition-colors">Home</a>
            <span>/</span>
            <span class="text-gray-600 dark:text-gray-300">Quote Generator</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Quote Generator
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-xl">
              Generate professional quotes in seconds and download them as PDF.
              <span class="text-purple-500 font-semibold">NgRx Store</span> demo with Angular 19.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-semibold
                           bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400
                           border border-purple-200 dark:border-purple-800">
                NgRx v21
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold
                           bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400
                           border border-red-200 dark:border-red-800">
                jsPDF v4
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Layout principal -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          <!-- Columna izquierda (2/3): cliente + filtros + tabla ítems -->
          <div class="lg:col-span-2 space-y-6">
            <app-quote-form />
            <app-quote-item-list />
          </div>

          <!-- Sidebar derecho (1/3): resumen sticky -->
          <div class="lg:col-span-1 sticky top-20">
            <app-quote-summary />
          </div>
        </div>
      </div>
    </main>

    <app-footer />
  `,
})
export class QuotePageComponent {}
