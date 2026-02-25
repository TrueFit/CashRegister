/** Mirrors the C# ChangeResponse DTO. */
export interface ChangeResponse {
  owed: number;
  paid: number;
  change: number;
  formatted: string;
  isRandom: boolean;
  breakdown: Record<string, number>;
}

/** Mirrors the C# ConfigResponse DTO. */
export interface ConfigResponse {
  randomDivisor: number;
  currencyCode: string;
}
