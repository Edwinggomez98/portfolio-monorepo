import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuoteState } from '../../../domain/models/quote/quote.model';

export const selectQuoteState = createFeatureSelector<QuoteState>('quote');

export const selectQuote       = createSelector(selectQuoteState, s => s.quote);
export const selectQuoteStatus = createSelector(selectQuoteState, s => s.status);
export const selectQuoteError  = createSelector(selectQuoteState, s => s.error);

export const selectQuoteClient     = createSelector(selectQuote, q => q.client);
export const selectQuoteItems      = createSelector(selectQuote, q => q.items);
export const selectQuoteNotes      = createSelector(selectQuote, q => q.notes);
export const selectQuoteCurrency   = createSelector(selectQuote, q => q.currency);
export const selectQuoteTaxRate    = createSelector(selectQuote, q => q.taxRate);
export const selectQuoteSubtotal   = createSelector(selectQuote, q => q.subtotal);
export const selectQuoteTax        = createSelector(selectQuote, q => q.tax);
export const selectQuoteTotal      = createSelector(selectQuote, q => q.total);
export const selectQuoteNumber     = createSelector(selectQuote, q => q.number);
export const selectQuoteDate       = createSelector(selectQuote, q => q.date);
export const selectQuoteValidUntil = createSelector(selectQuote, q => q.validUntil);

export const selectIsGenerating = createSelector(
  selectQuoteStatus, s => s === 'generating-pdf'
);

export const selectHasItems = createSelector(
  selectQuoteItems, items => items.length > 0
);

export const selectQuoteHistory = createSelector(selectQuoteState, s => s.history);

export const selectIsLoadingHistory = createSelector(
  selectQuoteStatus, s => s === 'loading-history',
);

export const selectViewingSavedQuoteId = createSelector(
  selectQuoteState, s => s.viewingSavedQuoteId,
);

export const selectViewingSavedQuoteLabel = createSelector(
  selectQuoteState, s => s.viewingSavedQuoteLabel,
);

export const selectIsViewingHistory = createSelector(
  selectViewingSavedQuoteId, id => !!id,
);
