export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface QuoteClient {
  name: string;
  email: string;
  company: string;
}

export interface Quote {
  id: string;
  number: string;
  date: string;
  validUntil: string;
  client: QuoteClient;
  items: QuoteItem[];
  notes: string;
  currency: 'USD' | 'EUR' | 'VES';
  taxRate: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface SavedQuoteSummary {
  id: string;
  quoteNumber: string;
  itemCount: number;
  total: number;
  currency: string;
  createdAt: string;
}

export interface QuoteState {
  quote: Quote;
  status: 'idle' | 'saving' | 'generating-pdf' | 'loading-history' | 'error';
  error: string | null;
  history: SavedQuoteSummary[];
  viewingSavedQuoteId: string | null;
  viewingSavedQuoteLabel: string | null;
}
