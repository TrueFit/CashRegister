import { ChangeResponse, Currency, Payment } from './types';
import { DENOMINATIONS, PAYMENT_LINE_FORMAT, PAYMENT_SEPARATOR } from './constants';
// @ts-ignore
import { isDivisibleBy } from './util';

/**
 * Calculate the change required for a number of payments.
 *
 * @param input A string consisting of payments, one per line, each line having
 * the amount owed and the amount paid, separated by PAYMENT_SEPARATOR.
 * @param currency The currency whose denominations are used. Defaults to
 * 'USD'.
 * @throws TypeError if the input string does not match the expected format.
 * @returns A string containing lines for each payment. For each line,
 * if the difference is divisible by three, returns a random amount
 * of change totaling to the difference between the amount paid and the amount
 * owed. Otherwise, returns the minimum amount of change totaling such.
 * The change is returned as a string of the amounts in each denomination,
 * separated by PAYMENT_SEPARATOR.
 */
export function getChangeResponse(
  input: string,
  currency: Currency = 'USD'
): ChangeResponse {
  const payments = parseInput(input);
  return { response: payments.map(payment => calculateChange(payment, currency)) };
}

/**
 * Calculate the change for a single payment.
 */
function calculateChange(payment: Payment, currency: Currency): string {
  const overpay = payment.paid - payment.owed;
  const change: string[] = [];
  if (overpay < 0) {
    return '0';
  }
  // else if (isDivisibleBy(payment.owed, 3)) {
  //   // TODO: Get random change
  // }
  else {
    let remaining = overpay;
    for (const denom of DENOMINATIONS[currency]) {
      let denomCount = 0;
      while (remaining > 0 && denom.value <= remaining) {
        denomCount++;
        remaining -= denom.value;
      }
      if (denomCount !== 0) {
        change.push(`${denomCount} ${denomCount === 1 ? denom.name : denom.pluralName }`);
      }
    }
  }
  return change.join(PAYMENT_SEPARATOR);
}

/**
 * Parse a plaintext file consisting of lines, each containing the amount owed,
 * then a comma separator, then the amount paid. Amounts should be specified as
 * at least one digit (0 through 9), a dot, and then two digits.
 */
function parseInput(input: string): Payment[] {
  const lines = input.trim().split(/\n/).map(line => line.trim());
  const payments = [];
  for (let i = 0; i < lines.length; i++) {
    if (!PAYMENT_LINE_FORMAT.test(lines[i])) {
      throw new TypeError(`Error: line ${i + 1} in input is malformed`);
    }
    // Floats are perilous when used for currency, but JavaScript is pretty
    // limited in alternatives. We store currencies as integers. We assume that
    // the smallest denomination is 1/100th of the base denomination.
    const [ owed, paid ] = lines[i].split(PAYMENT_SEPARATOR).map(
      x => Math.floor(100 * parseFloat(x))
    );
    payments.push({ owed, paid });
  }
  return payments;
}
