import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from './transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly apiUrl = 'http://localhost:3000/transactions/upload';

  constructor(private readonly http: HttpClient) {}

  uploadTransactions(file: File): Observable<Transaction[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<Transaction[]>(this.apiUrl, formData);
  }
}
