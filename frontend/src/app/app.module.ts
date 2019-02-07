import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { API_BASE_URL } from './shared/tokens';
import { AppComponent } from './app.component';
import { CashRegisterService } from './services/cash-register.service';


export function getBaseApiUrl() {
  return `${location.protocol}//${location.host}/api`;
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [
    CashRegisterService,
    [{ provide: API_BASE_URL, useFactory: getBaseApiUrl }],
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }
