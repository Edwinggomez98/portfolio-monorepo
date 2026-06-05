import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, withLatestFrom, map, catchError, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { QuoteActions } from './quote.actions';
import { selectQuote } from './quote.selectors';
import { PdfService } from '../../../../shared/services/pdf/pdf.service';
import { SavedQuotesService, SavedQuote } from '../../../../shared/services/saved-quotes/saved-quotes.service';
import { SavedQuoteSummary } from '../../../domain/models/quote/quote.model';

function toSummary(q: SavedQuote): SavedQuoteSummary {
  return {
    id:          q.id,
    quoteNumber: q.quoteNumber,
    itemCount:   q.itemCount,
    total:       Number(q.total),
    currency:    q.currency,
    createdAt:   q.createdAt,
  };
}

@Injectable()
export class QuoteEffects {
  private actions$    = inject(Actions);
  private store       = inject(Store);
  private pdf         = inject(PdfService);
  private savedQuotes = inject(SavedQuotesService);

  generatePdf$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.generatePdf),
      withLatestFrom(this.store.select(selectQuote)),
      switchMap(([, quote]) =>
        from(this.pdf.generateQuotePdf(quote)).pipe(
          switchMap(() => this.savedQuotes.createFromQuote(quote)),
          map(() => QuoteActions.generatePdfSuccess()),
          catchError(err => of(QuoteActions.generatePdfFailure({ error: String(err) }))),
        ),
      ),
    ),
  );

  loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.loadHistory),
      switchMap(() =>
        this.savedQuotes.findAll().pipe(
          map(list => QuoteActions.loadHistorySuccess({ history: list.map(toSummary) })),
          catchError(err => of(QuoteActions.loadHistoryFailure({ error: String(err) }))),
        ),
      ),
    ),
  );

  viewSavedQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.viewSavedQuote),
      switchMap(({ id }) =>
        this.savedQuotes.findOne(id).pipe(
          map(saved => QuoteActions.viewSavedQuoteSuccess({ saved })),
          catchError(err => of(QuoteActions.viewSavedQuoteFailure({ error: String(err) }))),
        ),
      ),
    ),
  );

  scrollToItemsOnView$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(QuoteActions.viewSavedQuoteSuccess),
        tap(() => {
          setTimeout(() => {
            document.getElementById('quote-items-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }),
      ),
    { dispatch: false },
  );
}
