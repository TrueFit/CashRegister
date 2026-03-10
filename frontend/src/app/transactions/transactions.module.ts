import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionsComponent } from './transactions.component';

@NgModule({
  declarations: [TransactionsComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [TransactionsComponent],
})
export class TransactionsModule {}
