import { Denomination } from './types';

// In a real application, we should consider storing these in a database so we
// could add or modify denominations without redeploying the application.
export const DENOMINATIONS: { [ccy: string]: Denomination[] } = {
  'USD': [
    { name: 'dollar',  pluralName: 'dollars',  value: 100 },
    { name: 'quarter', pluralName: 'quarters', value:  25 },
    { name: 'dime',    pluralName: 'dimes',    value:  10 },
    { name: 'nickel',  pluralName: 'nickels',  value:   5 },
    { name: 'penny',   pluralName: 'pennies',  value:   1 },
  ],
}

export const PAYMENT_LINE_FORMAT = /^[0-9]+\.[0-9]{2},[0-9]+\.[0-9]{2}$/;
export const PAYMENT_SEPARATOR = ',';
