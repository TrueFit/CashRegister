export interface ServerIsUp {
    status: string;
}
export interface CurrencyOption {
    CurrencyCode: string;
    Name: string;
}

export interface Change {
    denomination: string;
    count: number;
}