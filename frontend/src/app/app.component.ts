import { Component } from '@angular/core';
import { Observable, zip, of, timer } from 'rxjs';

import { CashRegisterService } from './services/cash-register.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CashRegister';
  resultsObservable: Observable<any>;

  constructor(private cashRegisterService: CashRegisterService) {}

  /**
   * Handle an uploaded cash-register file.
   * @param file - The plaintext file containing the amounts paid and the
   * amounts owed.
   */
  submitFile(file: File) {
    console.log(file);
    this.resultsObservable = zip(of("dummy"), timer(1000));
  }

}
