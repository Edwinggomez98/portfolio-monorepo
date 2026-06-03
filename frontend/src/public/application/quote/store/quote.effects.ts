import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { QuoteActions } from './quote.actions';
import { selectQuote } from './quote.selectors';
import { PdfService } from '../../../../shared/services/pdf/pdf.service';

@Injectable()
export class QuoteEffects {
  private actions$ = inject(Actions);
  private store    = inject(Store);
  private pdf      = inject(PdfService);

  generatePdf$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.generatePdf),
      withLatestFrom(this.store.select(selectQuote)),
      switchMap(([, quote]) =>
        from(this.pdf.generateQuotePdf(quote)).pipe(
          map(()  => QuoteActions.generatePdfSuccess()),
          catchError(err => of(QuoteActions.generatePdfFailure({ error: String(err) })))
        )
      )
    )
  );
}
