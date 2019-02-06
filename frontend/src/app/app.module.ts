import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { CashRegisterService } from './services/cash-register.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
  ],
  providers: [ CashRegisterService ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }
