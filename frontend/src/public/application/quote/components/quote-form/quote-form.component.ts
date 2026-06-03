import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuoteActions } from '../../store/quote.actions';
import {
  selectQuoteClient,
  selectQuoteCurrency,
  selectQuoteTaxRate,
  selectQuoteValidUntil,
  selectQuoteNumber,
  selectQuoteDate,
} from '../../store/quote.selectors';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quote-form.component.html',
})
export class QuoteFormComponent implements OnInit {
  private store = inject(Store);
  private fb    = inject(FormBuilder);

  quoteNumber$ = this.store.select(selectQuoteNumber);
  quoteDate$   = this.store.select(selectQuoteDate);

  form = this.fb.group({
    clientName:    ['', Validators.required],
    clientEmail:   ['', Validators.email],
    clientCompany: [''],
    validUntil:    [''],
    currency:      ['USD'],
    taxRate:       [16, [Validators.min(0), Validators.max(100)]],
  });

  ngOnInit(): void {
    this.store.select(selectQuoteClient).subscribe(c => {
      this.form.patchValue({ clientName: c.name, clientEmail: c.email, clientCompany: c.company }, { emitEvent: false });
    });
    this.store.select(selectQuoteValidUntil).subscribe(v => this.form.patchValue({ validUntil: v }, { emitEvent: false }));
    this.store.select(selectQuoteCurrency).subscribe(c  => this.form.patchValue({ currency: c },   { emitEvent: false }));
    this.store.select(selectQuoteTaxRate).subscribe(t   => this.form.patchValue({ taxRate: t },    { emitEvent: false }));

    this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(v => {
      this.store.dispatch(QuoteActions.updateClient({
        client: { name: v.clientName ?? '', email: v.clientEmail ?? '', company: v.clientCompany ?? '' },
      }));
      if (v.validUntil) this.store.dispatch(QuoteActions.updateValidUntil({ validUntil: v.validUntil }));
      if (v.currency)   this.store.dispatch(QuoteActions.updateCurrency({ currency: v.currency as 'USD' | 'EUR' | 'VES' }));
      if (v.taxRate != null) this.store.dispatch(QuoteActions.updateTaxRate({ taxRate: v.taxRate }));
    });
  }
}
