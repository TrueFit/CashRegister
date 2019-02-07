import { API_BASE_URL } from '../shared/tokens';
import { HttpClient /*, HttpHeaders, HttpResponse, HttpResponseBase */ } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

  // TODO: Return type should be Observable of response interface
  submitFile(file: File): Observable<any> {
    const reader = new FileReader();
    const reader$ = fromEvent(reader, 'load');
    reader.readAsText(file);
    return reader$.pipe(
      map((loadEvent: Event) => (loadEvent.target as FileReader).result),
      switchMap((fileText: string) =>
        this.http.post(
          `${this.baseUrl}/calculate-change`,
          fileText,
          { responseType: 'text' }, // TODO
        )
      )
    );
  }

}
