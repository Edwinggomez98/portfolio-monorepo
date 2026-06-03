import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { QuoteActions } from '../../store/quote.actions';
import { selectQuoteNumber, selectQuoteDate } from '../../store/quote.selectors';
import { MobileApiService, MobileDevice } from '../../../../../shared/services/mobile-api/mobile-api.service';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quote-form.component.html',
})
export class QuoteFormComponent implements OnInit {
  private store        = inject(Store);
  private fb           = inject(FormBuilder);
  private mobileApi    = inject(MobileApiService);

  quoteNumber$ = this.store.select(selectQuoteNumber);
  quoteDate$   = this.store.select(selectQuoteDate);

  // ── Formulario cliente (simplificado) ────────────────────────────────────
  clientForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name:  [''],
    phone: [''],
  });

  // ── Filtros MobileAPI ────────────────────────────────────────────────────
  filterForm = this.fb.group({
    query:    [''],
    type:     [''],
  });

  deviceTypes = this.mobileApi.getDeviceTypes();

  searchResults = signal<MobileDevice[]>([]);
  isSearching   = signal(false);
  hasSearched   = signal(false);

  private searchTrigger$ = new Subject<void>();

  ngOnInit(): void {
    // Sync cliente → store
    this.clientForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(v => {
        this.store.dispatch(QuoteActions.updateClient({
          client: { name: v.name ?? '', email: v.email ?? '', company: v.phone ?? '' },
        }));
      });

    // Búsqueda reactiva cuando cambia el query o el type
    this.filterForm.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(() => this.triggerSearch());
  }

  triggerSearch(): void {
    const { query, type } = this.filterForm.value;
    if (!query?.trim()) {
      this.searchResults.set([]);
      this.hasSearched.set(false);
      return;
    }
    this.searchTrigger$.next();
    this.isSearching.set(true);
    this.hasSearched.set(true);

    this.mobileApi.search(query.trim(), type || undefined).subscribe(res => {
      this.searchResults.set(res.data ?? []);
      this.isSearching.set(false);
    });
  }

  clearSearch(): void {
    this.filterForm.patchValue({ query: '', type: '' });
    this.searchResults.set([]);
    this.hasSearched.set(false);
  }

  addDeviceAsItem(device: MobileDevice): void {
    const description = [device.brand_name, device.name, device.hardware, device.storage]
      .filter(Boolean).join(' · ');
    this.store.dispatch(QuoteActions.addItem({
      item: { description, quantity: 1, unitPrice: 0 },
    }));
  }

  hasClientError(field: string, error: string): boolean {
    const c = this.clientForm.get(field);
    return !!(c?.hasError(error) && c?.touched);
  }
}
