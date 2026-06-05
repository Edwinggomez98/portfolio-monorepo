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

  search(query: string, brand?: string, type?: string): Observable<{ data: Device[]; total: number; source: 'api' | 'local' }> {
    let params = new HttpParams().set('limit', '200');
    if (query?.trim())          params = params.set('q',     query.trim());
    if (brand && brand !== 'all') params = params.set('brand', brand);
    if (type  && type  !== 'all') params = params.set('type',  type);

    return this.http.get<BackendResponse>(this.apiUrl, { params }).pipe(
      map(res => {
        const data = res.data.map(d => ({ ...d, fullName: `${d.brand} ${d.model}`.toLowerCase() }));
        return { data, total: res.total, source: 'api' as const };
      }),
      catchError(() => this.searchLocal(query, brand, type)),
    );
  }

  getBrands(type?: string): Observable<string[]> {
    let params = new HttpParams();
    if (type && type !== 'all') params = params.set('type', type);
    return this.http.get<string[]>(`${this.apiUrl}/brands`, { params }).pipe(
      catchError(() => this.getLocalBrands(type)),
    );
  }

  getTypes(brand?: string): Observable<string[]> {
    let params = new HttpParams();
    if (brand && brand !== 'all') params = params.set('brand', brand);
    return this.http.get<string[]>(`${this.apiUrl}/types`, { params }).pipe(
      catchError(() => this.getLocalTypes(brand)),
    );
  }

  private getLocalBrands(type?: string): Observable<string[]> {
    return this.getLocalDevices().pipe(
      map(devices => {
        const filtered = type && type !== 'all' ? devices.filter(d => d.type === type) : devices;
        return [...new Set(filtered.map(d => d.brand))].filter(Boolean).sort();
      }),
    );
  }

  private getLocalTypes(brand?: string): Observable<string[]> {
    return this.getLocalDevices().pipe(
      map(devices => {
        const filtered = brand && brand !== 'all'
          ? devices.filter(d => d.brand.toLowerCase() === brand.toLowerCase())
          : devices;
        return [...new Set(filtered.map(d => d.type))].filter(Boolean).sort();
      }),
    );
  }

  syncFromExternalApi(): Observable<{ inserted: number; skipped: number; source: string }> {
    return this.http.post<{ inserted: number; skipped: number; source: string }>(
      `${this.apiUrl}/sync`,
      {},
    );
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

  private searchLocal(query: string, brand?: string, type?: string): Observable<{ data: Device[]; total: number; source: 'api' | 'local' }> {
    const q = query?.toLowerCase().trim() ?? '';
    return this.getLocalDevices().pipe(
      map(devices => {
        let results = devices;
        if (brand && brand !== 'all') results = results.filter(d => d.brand.toLowerCase() === brand.toLowerCase());
        if (type  && type  !== 'all') results = results.filter(d => d.type === type);
        if (q) results = results.filter(d => d.fullName.includes(q));
        return { data: results.slice(0, 200), total: results.length, source: 'local' as const };
      }),
    );
  }
}
