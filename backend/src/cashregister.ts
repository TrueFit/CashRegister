import { ChangeResponse, Currency, Denomination, Payment } from './types';
import { DENOMINATIONS, PAYMENT_LINE_FORMAT, PAYMENT_SEPARATOR } from './constants';
import { getRandomElement, isDivisibleBy } from './util';

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
  if (overpay < 0) {
    return '0';
  }
  let change = isDivisibleBy(payment.owed / 100, 3)
    ? calculateChangeRandomly(overpay, currency)
    : calculateChangeNormally(overpay, currency);
  return change.join(PAYMENT_SEPARATOR);
}

/**
 * Calculate the minimum amount of change needed.
 */
function calculateChangeNormally(overpay: number, currency: Currency): string[] {
  const change: string[] = [];
  for (const denom of DENOMINATIONS[currency]) {
    let denomCount = 0;
    while (overpay > 0 && denom.value <= overpay) {
      denomCount++;
      overpay -= denom.value;
    }
    if (denomCount !== 0) {
      change.push(formatDenomination(denomCount, denom));
    }
  }
  return change;
}

/**
 * Calculate change using random denominations.
 */
function calculateChangeRandomly(overpay: number, currency: Currency): string[] {
  const change: string[] = [];
  const denomCounts = {};
  while (overpay > 0) {
    const denom = getRandomElement(DENOMINATIONS[currency]);
    if (denom.value <= overpay) {
      overpay -= denom.value;
      if (!(denom.name in denomCounts)) {
        denomCounts[denom.name] = 0;
      }
      denomCounts[denom.name]++;
    }
  }
  for (const denomName of Object.keys(denomCounts)) {
    const denom = DENOMINATIONS[currency].find(e => e.name === denomName);
    if (denom == null) {
      throw new Error('An error that should never happen happened');
    }
    change.push(formatDenomination(denomCounts[denomName], denom));
  }
  return change;
}

function formatDenomination(count: number, denom: Denomination): string {
  return `${count} ${count === 1 ? denom.name : denom.pluralName }`
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
      throw new TypeError(`Line ${i + 1} in input is malformed`);
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
