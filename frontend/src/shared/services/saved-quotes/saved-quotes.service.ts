import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Quote } from '../../../public/domain/models/quote/quote.model';

export interface SavedQuoteItemSnapshot {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SavedQuote {
  id: string;
  quoteNumber: string;
  itemCount: number;
  subtotal: number;
  taxRate: number;
  total: number;
  currency: string;
  notes: string | null;
  validUntil: string | null;
  itemsSnapshot: SavedQuoteItemSnapshot[];
  createdAt: string;
}

export interface CreateSavedQuotePayload {
  quoteNumber: string;
  subtotal: number;
  taxRate: number;
  total: number;
  currency: string;
  notes?: string;
  validUntil?: string;
  itemsSnapshot: SavedQuoteItemSnapshot[];
}

@Injectable({ providedIn: 'root' })
export class SavedQuotesService {
  private http   = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/saved-quotes`;

  createFromQuote(quote: Quote): Observable<SavedQuote> {
    const payload: CreateSavedQuotePayload = {
      quoteNumber: quote.number,
      subtotal:    quote.subtotal,
      taxRate:     quote.taxRate,
      total:       quote.total,
      currency:    quote.currency,
      notes:       quote.notes || undefined,
      validUntil:  quote.validUntil || undefined,
      itemsSnapshot: quote.items.map(i => ({
        description: i.description,
        quantity:    i.quantity,
        unitPrice:   i.unitPrice,
        total:       i.subtotal,
      })),
    };
    return this.http.post<SavedQuote>(this.apiUrl, payload);
  }

  findAll(): Observable<SavedQuote[]> {
    return this.http.get<SavedQuote[]>(this.apiUrl);
  }

  findOne(id: string): Observable<SavedQuote> {
    return this.http.get<SavedQuote>(`${this.apiUrl}/${id}`);
  }
}
