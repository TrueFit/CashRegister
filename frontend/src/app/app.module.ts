import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TransactionsModule } from './transactions/transactions.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, TransactionsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
