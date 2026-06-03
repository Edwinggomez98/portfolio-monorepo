import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MobileDevice {
  name:            string;
  brand_name:      string;
  colors?:         string;
  storage?:        string;
  screen_resolution?: string;
  weight?:         string;
  release_date?:   string;
  camera?:         string;
  battery_capacity?: string;
  hardware?:       string;
  [key: string]:   unknown;
}

export interface MobileApiSearchResponse {
  data:   MobileDevice[];
  total:  number;
  page:   number;
  limit:  number;
}

@Injectable({ providedIn: 'root' })
export class MobileApiService {
  private http    = inject(HttpClient);
  private baseUrl = environment.mobileApiUrl;
  private apiKey  = environment.mobileApiKey;

  search(query: string, type?: string): Observable<MobileApiSearchResponse> {
    let params = new HttpParams()
      .set('name', query)
      .set('key',  this.apiKey);

    if (type) params = params.set('type', type);

    return this.http
      .get<MobileApiSearchResponse>(`${this.baseUrl}/devices/search`, { params })
      .pipe(
        tap(response => {
          console.group('%c[MobileAPI] Search response', 'color: #06B6D4; font-weight: bold');
          console.log('Query:',    query);
          console.log('Type:',     type ?? 'all');
          console.log('Total:',    response.total);
          console.log('Results:',  response.data);
          if (response.data?.length) {
            console.log('First device (full):', response.data[0]);
          }
          console.groupEnd();
        }),
        catchError(err => {
          console.error('[MobileAPI] Error:', err);
          return of({ data: [], total: 0, page: 1, limit: 10 });
        })
      );
  }

  getDeviceTypes(): string[] {
    return ['smartphone', 'tablet', 'laptop', 'smartwatch'];
  }
}
