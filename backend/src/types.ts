// Can make into a union type to support multiple currencies
export type Currency = 'USD';

export interface Denomination {
  name: string;
  pluralName: string;
  value: number;
}

export interface ChangeResponse {
  response: string[];
}

export interface Payment {
  owed: number;
  paid: number;
}
