import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuoteActions } from '../../store/quote.actions';
import { selectQuoteNumber, selectQuoteDate } from '../../store/quote.selectors';
import { DeviceDataService, Device } from '../../../../../shared/services/device-data/device-data.service';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quote-form.component.html',
})
export class QuoteFormComponent implements OnInit {
  private store      = inject(Store);
  private fb         = inject(FormBuilder);
  private deviceSvc  = inject(DeviceDataService);

  quoteNumber$ = this.store.select(selectQuoteNumber);
  quoteDate$   = this.store.select(selectQuoteDate);

  // ── Formulario cliente ────────────────────────────────────────────────
  clientForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name:  [''],
    phone: [''],
  });

  // ── Filtros de dispositivos ───────────────────────────────────────────
  filterForm = this.fb.group({
    query: [''],
    type:  [''],
  });

  deviceTypes   = this.deviceSvc.getDeviceTypes();
  searchResults = signal<Device[]>([]);
  isSearching   = signal(false);
  hasSearched   = signal(false);

  ngOnInit(): void {
    // Sync cliente → store
    this.clientForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(v => {
        this.store.dispatch(QuoteActions.updateClient({
          client: { name: v.name ?? '', email: v.email ?? '', company: v.phone ?? '' },
        }));
      });

    // Búsqueda reactiva al escribir o cambiar el tipo
    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.triggerSearch());
  }

  triggerSearch(): void {
    const { query, type } = this.filterForm.value;

    if (!query?.trim() && !type) {
      this.searchResults.set([]);
      this.hasSearched.set(false);
      return;
    }

    this.isSearching.set(true);
    this.hasSearched.set(true);

    this.deviceSvc.search(query?.trim() ?? '', type || undefined).subscribe(res => {
      this.searchResults.set(res.data);
      this.isSearching.set(false);
    });
  }

  clearSearch(): void {
    this.filterForm.patchValue({ query: '', type: '' });
    this.searchResults.set([]);
    this.hasSearched.set(false);
  }

  addDeviceAsItem(device: Device): void {
    const parts = [
      device.brand,
      device.model,
      device.ram   ? `${device.ram} RAM`   : '',
      device.storage ? device.storage       : '',
      device.year  ? `(${device.year})`     : '',
    ].filter(Boolean);

    this.store.dispatch(QuoteActions.addItem({
      item: { description: parts.join(' · '), quantity: 1, unitPrice: 0 },
    }));
  }

  hasClientError(field: string, error: string): boolean {
    const c = this.clientForm.get(field);
    return !!(c?.hasError(error) && c?.touched);
  }
}
