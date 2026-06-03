import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuoteActions } from '../../store/quote.actions';
import {
  selectQuoteSubtotal, selectQuoteTax, selectQuoteTotal,
  selectQuoteTaxRate, selectQuoteCurrency, selectQuoteNotes,
  selectIsGenerating, selectHasItems,
} from '../../store/quote.selectors';

@Component({
  selector: 'app-quote-summary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quote-summary.component.html',
})
export class QuoteSummaryComponent {
  private store = inject(Store);
  private fb    = inject(FormBuilder);

  subtotal$     = this.store.select(selectQuoteSubtotal);
  tax$          = this.store.select(selectQuoteTax);
  total$        = this.store.select(selectQuoteTotal);
  taxRate$      = this.store.select(selectQuoteTaxRate);
  currency$     = this.store.select(selectQuoteCurrency);
  isGenerating$ = this.store.select(selectIsGenerating);
  hasItems$     = this.store.select(selectHasItems);

  notesControl = this.fb.control('');

  constructor() {
    this.store.select(selectQuoteNotes).subscribe(n =>
      this.notesControl.setValue(n, { emitEvent: false })
    );
    this.notesControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(notes =>
      this.store.dispatch(QuoteActions.updateNotes({ notes: notes ?? '' }))
    );
  }

  downloadPdf(): void {
    this.store.dispatch(QuoteActions.generatePdf());
  }

  reset(): void {
    if (confirm('Reset the quote? All data will be lost.')) {
      this.store.dispatch(QuoteActions.resetQuote());
    }
  }
}
