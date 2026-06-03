import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { QuoteClient, QuoteItem } from '../../../domain/models/quote/quote.model';

export const QuoteActions = createActionGroup({
  source: 'Quote',
  events: {
    // Cliente
    'Update Client': props<{ client: QuoteClient }>(),

    // Ítems
    'Add Item':    props<{ item: Omit<QuoteItem, 'id' | 'subtotal'> }>(),
    'Update Item': props<{ id: string; changes: Partial<Omit<QuoteItem, 'id' | 'subtotal'>> }>(),
    'Remove Item': props<{ id: string }>(),

    // Configuración de la cotización
    'Update Notes':    props<{ notes: string }>(),
    'Update Tax Rate': props<{ taxRate: number }>(),
    'Update Currency': props<{ currency: 'USD' | 'EUR' | 'VES' }>(),
    'Update Valid Until': props<{ validUntil: string }>(),

    // PDF
    'Generate Pdf':         emptyProps(),
    'Generate Pdf Success': emptyProps(),
    'Generate Pdf Failure': props<{ error: string }>(),

    // Reset
    'Reset Quote': emptyProps(),
  },
});
