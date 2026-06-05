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
  private store     = inject(Store);
  private fb        = inject(FormBuilder);
  private deviceSvc = inject(DeviceDataService);

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
    brand: [''],
    type:  [''],
  });

  // Listas de opciones (reactivas en cadena)
  allBrands     = signal<string[]>([]);
  allTypes      = signal<string[]>([]);
  filteredBrands = signal<string[]>([]);
  filteredTypes  = signal<string[]>([]);

  searchResults = signal<Device[]>([]);
  isSearching   = signal(false);
  hasSearched   = signal(false);
  isSyncing     = signal(false);
  syncMessage   = signal<{ text: string; type: 'success' | 'error' } | null>(null);

  ngOnInit(): void {
    // Carga inicial de marcas y tipos completos
    this.deviceSvc.getBrands().subscribe(b => { this.allBrands.set(b); this.filteredBrands.set(b); });
    this.deviceSvc.getTypes().subscribe(t => { this.allTypes.set(t); this.filteredTypes.set(t); });

    // Sync cliente → store
    this.clientForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(v => {
        this.store.dispatch(QuoteActions.updateClient({
          client: { name: v.name ?? '', email: v.email ?? '', company: v.phone ?? '' },
        }));
      });

    // Carga inicial de todos los dispositivos
    this.triggerSearch();

    // Reactivo: cuando cambia brand, actualiza tipos disponibles y relanza búsqueda
    this.filterForm.get('brand')!.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(brand => {
        const currentType = this.filterForm.value.type || '';
        this.deviceSvc.getTypes(brand || undefined).subscribe(types => {
          this.filteredTypes.set(types);
          // Si el tipo seleccionado ya no está disponible, lo limpia
          if (currentType && !types.includes(currentType)) {
            this.filterForm.patchValue({ type: '' }, { emitEvent: false });
          }
        });
        this.triggerSearch();
      });

    // Reactivo: cuando cambia type, actualiza marcas disponibles y relanza búsqueda
    this.filterForm.get('type')!.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(type => {
        const currentBrand = this.filterForm.value.brand || '';
        this.deviceSvc.getBrands(type || undefined).subscribe(brands => {
          this.filteredBrands.set(brands);
          // Si la marca seleccionada ya no está disponible, la limpia
          if (currentBrand && !brands.includes(currentBrand)) {
            this.filterForm.patchValue({ brand: '' }, { emitEvent: false });
          }
        });
        this.triggerSearch();
      });

    // Reactivo: cuando cambia el texto de búsqueda
    this.filterForm.get('query')!.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.triggerSearch());
  }

  triggerSearch(): void {
    const { query, brand, type } = this.filterForm.value;
    this.isSearching.set(true);
    this.hasSearched.set(true);

    this.deviceSvc.search(query?.trim() ?? '', brand || undefined, type || undefined).subscribe(res => {
      this.searchResults.set(res.data);
      this.isSearching.set(false);
    });
  }

  clearSearch(): void {
    this.filterForm.patchValue({ query: '', brand: '', type: '' });
    this.filteredBrands.set(this.allBrands());
    this.filteredTypes.set(this.allTypes());
  }

  addDeviceAsItem(device: Device): void {
    const parts = [
      device.brand,
      device.model,
      device.ram     ? `${device.ram} RAM` : '',
      device.storage ? device.storage      : '',
      device.year    ? `(${device.year})`  : '',
    ].filter(Boolean);

    const unitPrice = device.price
      ? parseFloat(device.price.replace(/[^0-9.]/g, '')) || 0
      : 0;

    this.store.dispatch(QuoteActions.addItem({
      item: { description: parts.join(' · '), quantity: 1, unitPrice },
    }));
  }

  syncDevices(): void {
    if (this.isSyncing()) return;
    this.isSyncing.set(true);
    this.syncMessage.set(null);

    this.deviceSvc.syncFromExternalApi().subscribe({
      next: (res) => {
        this.isSyncing.set(false);
        this.syncMessage.set({
          text: `✓ ${res.inserted} new · ${res.skipped} skipped`,
          type: 'success',
        });
        // Recargar marcas y tipos tras sync
        this.deviceSvc.getBrands().subscribe(b => { this.allBrands.set(b); this.filteredBrands.set(b); });
        this.deviceSvc.getTypes().subscribe(t => { this.allTypes.set(t); this.filteredTypes.set(t); });
        this.triggerSearch();
        setTimeout(() => this.syncMessage.set(null), 4000);
      },
      error: () => {
        this.isSyncing.set(false);
        this.syncMessage.set({ text: 'Sync failed', type: 'error' });
        setTimeout(() => this.syncMessage.set(null), 4000);
      },
    });
  }

  hasClientError(field: string, error: string): boolean {
    const c = this.clientForm.get(field);
    return !!(c?.hasError(error) && c?.touched);
  }
}
