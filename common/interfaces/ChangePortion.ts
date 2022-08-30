import { Denomination } from "./Denomination";

/**
 * Represents a portion of change to be returned to the customer.
 * For example, 2 quarters, or 3 pennies.
 */
export interface ChangePortion {
  denomination: Denomination;
  amount: number;
}
