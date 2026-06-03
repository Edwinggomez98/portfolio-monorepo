import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';

/** Forma compacta en el JSON (claves de 1 letra para reducir tamaño) */
interface RawDevice {
  b: string;  // brand
  m: string;  // model
  t: string;  // type inicial: 's' | 't' | 'l' | 'w'
  y: string;  // year
  r: string;  // ram
  s: string;  // storage
  o: string;  // os
  c: string;  // chipset
  p: string;  // price
}

const TYPE_MAP: Record<string, string> = {
  s: 'smartphone',
  t: 'tablet',
  l: 'laptop',
  w: 'smartwatch',
};

export interface Device {
  brand:    string;
  model:    string;
  type:     string;
  year:     string;
  ram:      string;
  storage:  string;
  os:       string;
  chipset:  string;
  price:    string;
  /** Nombre completo para búsqueda */
  fullName: string;
}

@Injectable({ providedIn: 'root' })
export class DeviceDataService {
  private http = inject(HttpClient);

  /** Observable cacheado — el JSON se carga UNA sola vez */
  private devices$: Observable<Device[]> = this.http
    .get<RawDevice[]>('/assets/data/devices.json')
    .pipe(
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

  getAll(): Observable<Device[]> {
    return this.devices$;
  }

  search(query: string, type?: string): Observable<Device[]> {
    const q = query.toLowerCase().trim();
    return this.devices$.pipe(
      map(devices => {
        let results = devices;

        if (type && type !== 'all') {
          results = results.filter(d => d.type === type);
        }

        if (q) {
          results = results.filter(d =>
            d.fullName.includes(q) ||
            d.brand.toLowerCase().includes(q) ||
            d.model.toLowerCase().includes(q)
          );
        }

        // consola para demo técnica
        console.group('%c[DeviceData] Search (local)', 'color: #06B6D4; font-weight: bold');
        console.log('Query:', query || '(none)');
        console.log('Type filter:', type || 'all');
        console.log(`Results: ${results.length} de ${devices.length} dispositivos`);
        if (results.length > 0) console.log('First result:', results[0]);
        console.groupEnd();

        return results.slice(0, 50); // máximo 50 resultados
      })
    );
  }

  getDeviceTypes(): string[] {
    return ['smartphone', 'tablet', 'laptop', 'smartwatch'];
  }
}
