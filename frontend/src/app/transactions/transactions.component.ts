import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.model';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent {
  uploadForm: FormGroup;
  results: Transaction[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedFileName = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly transactionService: TransactionService,
  ) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadForm.patchValue({ file });
      this.selectedFileName = file.name;
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  onSubmit(): void {
    if (this.uploadForm.invalid) {
      this.errorMessage = 'Please select a CSV file to upload.';
      return;
    }

    const file: File = this.uploadForm.get('file')!.value;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      this.errorMessage = 'Please upload a valid CSV file.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.results = [];

    this.transactionService.uploadTransactions(file).subscribe({
      next: (transactions: Transaction[]) => {
        this.results = transactions;
        this.isLoading = false;
        this.successMessage = `Successfully processed ${transactions.length} transaction(s).`;
      },
      error: (err: { error?: { message?: string }; message?: string }) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message ||
          err?.message ||
          'An error occurred while processing the file.';
      },
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  reset(): void {
    this.uploadForm.reset();
    this.results = [];
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedFileName = '';
    this.isLoading = false;
  }
}
