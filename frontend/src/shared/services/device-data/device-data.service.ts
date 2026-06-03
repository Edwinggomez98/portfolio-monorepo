import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay, map, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Device {
  id?:      number;
  brand:    string;
  model:    string;
  type:     string;
  year:     string;
  ram:      string;
  storage:  string;
  os:       string;
  chipset:  string;
  price:    string;
  fullName: string;
}

interface BackendResponse {
  data:   Omit<Device, 'fullName'>[];
  total:  number;
  limit:  number;
  offset: number;
}

/** Forma compacta del JSON local (fallback offline) */
interface RawDevice {
  b: string; m: string; t: string; y: string;
  r: string; s: string; o: string; c: string; p: string;
}

const TYPE_MAP: Record<string, string> = {
  s: 'smartphone', t: 'tablet', l: 'laptop', w: 'smartwatch',
};

@Injectable({ providedIn: 'root' })
export class DeviceDataService {
  private http    = inject(HttpClient);
  private apiUrl  = `${environment.apiUrl}/devices`;

  /** Cache del asset local — se usa solo si el backend falla */
  private localDevices$: Observable<Device[]> | null = null;

  search(query: string, type?: string): Observable<{ data: Device[]; total: number; source: 'api' | 'local' }> {
    let params = new HttpParams().set('limit', '50');
    if (query?.trim()) params = params.set('q', query.trim());
    if (type && type !== 'all') params = params.set('type', type);

    return this.http.get<BackendResponse>(this.apiUrl, { params }).pipe(
      map(res => {
        const data = res.data.map(d => ({ ...d, fullName: `${d.brand} ${d.model}`.toLowerCase() }));
        this.logResults('api', query, type, data);
        return { data, total: res.total, source: 'api' as const };
      }),
      catchError(() => this.searchLocal(query, type)),
    );
  }

  getDeviceTypes(): string[] {
    return ['smartphone', 'tablet', 'laptop', 'smartwatch'];
  }

  // ── Fallback local ────────────────────────────────────────────────────────

  private getLocalDevices(): Observable<Device[]> {
    if (!this.localDevices$) {
      this.localDevices$ = this.http.get<RawDevice[]>('/assets/data/devices.json').pipe(
        map(raw => raw.map(d => ({
          brand:    d.b,
          model:    d.m,
          type:     TYPE_MAP[d.t] ?? 'smartphone',
          year:     d.y,
          ram:      d.r,
          storage:  d.s,
          os:       d.o,
          chipset:  d.c,
          price:    d.p,
          fullName: `${d.b} ${d.m}`.toLowerCase(),
        }))),
        shareReplay(1),
      );
    }
    return this.localDevices$;
  }

  private searchLocal(query: string, type?: string): Observable<{ data: Device[]; total: number; source: 'api' | 'local' }> {
    const q = query?.toLowerCase().trim() ?? '';
    return this.getLocalDevices().pipe(
      map(devices => {
        let results = devices;
        if (type && type !== 'all') results = results.filter(d => d.type === type);
        if (q) results = results.filter(d => d.fullName.includes(q));
        const data = results.slice(0, 50);
        this.logResults('local', query, type, data);
        return { data, total: results.length, source: 'local' as const };
      }),
    );
  }

  private logResults(source: string, query: string, type: string | undefined, data: Device[]) {
    console.group(`%c[DeviceDataService] Search (${source})`, 'color: #06B6D4; font-weight: bold');
    console.log('Query:', query || '(none)');
    console.log('Type filter:', type || 'all');
    console.log(`Results: ${data.length}`);
    if (data.length > 0) console.log('First result:', data[0]);
    console.groupEnd();
  }
}
