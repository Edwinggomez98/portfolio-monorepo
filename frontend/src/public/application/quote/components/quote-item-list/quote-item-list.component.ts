import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { QuoteActions } from '../../store/quote.actions';
import {
  selectQuoteItems,
  selectIsViewingHistory,
  selectViewingSavedQuoteLabel,
} from '../../store/quote.selectors';
import { QuoteItem } from '../../../../domain/models/quote/quote.model';

@Component({
  selector: 'app-quote-item-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quote-item-list.component.html',
})
export class QuoteItemListComponent {
  private store = inject(Store);
  private fb    = inject(FormBuilder);

  items$             = this.store.select(selectQuoteItems);
  isViewingHistory$  = this.store.select(selectIsViewingHistory);
  viewingLabel$      = this.store.select(selectViewingSavedQuoteLabel);

  exitHistoryView(): void {
    this.editingId = null;
    this.store.dispatch(QuoteActions.clearHistoryView());
  }

  editingId: string | null = null;

  editForm = this.fb.group({
    description: ['', Validators.required],
    quantity:    [1, [Validators.required, Validators.min(1)]],
    unitPrice:   [0, [Validators.required, Validators.min(0)]],
  });

  startEdit(item: QuoteItem): void {
    this.editingId = item.id;
    this.editForm.patchValue({ description: item.description, quantity: item.quantity, unitPrice: item.unitPrice });
  }

  saveEdit(id: string): void {
    if (this.editForm.invalid) return;
    const v = this.editForm.value;
    this.store.dispatch(QuoteActions.updateItem({
      id,
      changes: { description: v.description!, quantity: v.quantity!, unitPrice: v.unitPrice! },
    }));
    this.editingId = null;
  }

  cancelEdit(): void { this.editingId = null; }

  removeItem(id: string): void {
    this.store.dispatch(QuoteActions.removeItem({ id }));
  }

  trackById(_: number, item: QuoteItem): string { return item.id; }
}
