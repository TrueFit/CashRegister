export interface Transaction {
  amountOwed: number;
  amountPaid: number;
  change: number;
  denominations: string;
  strategy: string;
}
