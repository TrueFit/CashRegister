import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, fromEvent, of } from 'rxjs';
import { first, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { API_BASE_URL } from '../shared/tokens';
import { ChangeResponse } from '../shared/types';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {

  private readonly http: HttpClient;
  private readonly baseUrl: string;

  constructor(private _http: HttpClient, @Inject(API_BASE_URL) _baseUrl: string) {
    this.http = _http;
    this.baseUrl = _baseUrl;
  }

  submitFile(file: File): Observable<ChangeResponse> {
    const reader = new FileReader();
    const reader$ = fromEvent(reader, 'load');
    reader.readAsText(file);
    return reader$.pipe(
      map((loadEvent: Event) => (loadEvent.target as FileReader).result),
      switchMap((fileText: string) =>
        this.http.post<ChangeResponse>(
          `${this.baseUrl}/calculate-change`,
          fileText,
          { responseType: 'json' },
        ).pipe(
          map(response => ({
            response: response.response,
            payments: CashRegisterService.splitFile(fileText),
          }))
        )
      ),
      first(),
    );
  }

  private static splitFile(input: string): string[] {
    return input.trim().split('\n').map(line => line.trim());
  }

}
