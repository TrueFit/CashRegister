import { Component } from '@angular/core';
import { Observable, zip, of, timer } from 'rxjs';

import { CashRegisterService } from './services/cash-register.service';
import { ChangeResponse } from './shared/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly title = 'CashRegister';
  resultsObservable: Observable<any>;
  loading: boolean;
  error: boolean;
  errorMessage: string;
  results: { owed: string, paid: string, change: string }[];

  constructor(private cashRegisterService: CashRegisterService) {
    this.resetState();
  }

  /**
   * Handle an uploaded cash-register file.
   * @param file - The plaintext file containing the amounts paid and the
   * amounts owed.
   */
  submitFile(file: File) {
    this.resetState();

    if (file.type != 'text/plain') {
      this.error = true;
      this.errorMessage = 'You must upload a plaintext file.';
      return;
    }

    this.loading = true;

    this.cashRegisterService.submitFile(file).subscribe(results => {
      if (results.payments == null) {
        this.error = true;
      }
      else {
        this.displayResults(results);
      }
      this.loading = false;
    }, error => {
      this.error   = true;
      this.errorMessage = error.error;
      this.loading = false;
    });
  }

  private resetState(): void {
    this.loading  = false;
    this.error    = false;
    this.errorMessage = undefined;
    this.results  = undefined;
  }

  private displayResults(results: ChangeResponse): void {
    const displayResults = [];
    for (let i = 0; i < results.payments.length; i++) {
      const [ owed, paid ] = results.payments[i].split(',');
      displayResults.push({
        owed,
        paid,
        change: results.response[i].split(',').join(', ')
      });
    }
    this.results = displayResults;
  }

}
