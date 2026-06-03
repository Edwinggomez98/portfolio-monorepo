import { createReducer, on } from '@ngrx/store';
import { QuoteState } from '../../../domain/models/quote/quote.model';
import { QuoteActions } from './quote.actions';

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function generateQuoteNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `COT-${y}${m}-${seq}`;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function calcTotals(state: QuoteState): QuoteState {
  const subtotal = state.quote.items.reduce((acc, i) => acc + i.subtotal, 0);
  const tax      = subtotal * (state.quote.taxRate / 100);
  const total    = subtotal + tax;
  return { ...state, quote: { ...state.quote, subtotal, tax, total } };
}

export const initialQuoteState: QuoteState = {
  quote: {
    id:         generateId(),
    number:     generateQuoteNumber(),
    date:       todayISO(),
    validUntil: addDaysISO(30),
    client: { name: '', email: '', company: '' },
    items:      [],
    notes:      '',
    currency:   'USD',
    taxRate:    16,
    subtotal:   0,
    tax:        0,
    total:      0,
  },
  status: 'idle',
  error:  null,
};

export const quoteReducer = createReducer(
  initialQuoteState,

  on(QuoteActions.updateClient, (state, { client }) =>
    ({ ...state, quote: { ...state.quote, client } })
  ),

  on(QuoteActions.addItem, (state, { item }) => {
    const subtotal = item.quantity * item.unitPrice;
    const newItem  = { ...item, id: generateId(), subtotal };
    return calcTotals({ ...state, quote: { ...state.quote, items: [...state.quote.items, newItem] } });
  }),

  on(QuoteActions.updateItem, (state, { id, changes }) => {
    const items = state.quote.items.map(i => {
      if (i.id !== id) return i;
      const updated   = { ...i, ...changes };
      updated.subtotal = updated.quantity * updated.unitPrice;
      return updated;
    });
    return calcTotals({ ...state, quote: { ...state.quote, items } });
  }),

  on(QuoteActions.removeItem, (state, { id }) =>
    calcTotals({ ...state, quote: { ...state.quote, items: state.quote.items.filter(i => i.id !== id) } })
  ),

  on(QuoteActions.updateNotes, (state, { notes }) =>
    ({ ...state, quote: { ...state.quote, notes } })
  ),

  on(QuoteActions.updateTaxRate, (state, { taxRate }) =>
    calcTotals({ ...state, quote: { ...state.quote, taxRate } })
  ),

  on(QuoteActions.updateCurrency, (state, { currency }) =>
    ({ ...state, quote: { ...state.quote, currency } })
  ),

  on(QuoteActions.updateValidUntil, (state, { validUntil }) =>
    ({ ...state, quote: { ...state.quote, validUntil } })
  ),

  on(QuoteActions.generatePdf, state =>
    ({ ...state, status: 'generating-pdf' as const, error: null })
  ),

  on(QuoteActions.generatePdfSuccess, state =>
    ({ ...state, status: 'idle' as const })
  ),

  on(QuoteActions.generatePdfFailure, (state, { error }) =>
    ({ ...state, status: 'error' as const, error })
  ),

  on(QuoteActions.resetQuote, () => ({
    ...initialQuoteState,
    quote: {
      ...initialQuoteState.quote,
      id:         generateId(),
      number:     generateQuoteNumber(),
      date:       todayISO(),
      validUntil: addDaysISO(30),
    },
  })),
);
