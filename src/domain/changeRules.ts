import { Denomination, US_DENOMINATIONS, formatChange, parseMoneyToCents } from './currency';

export type RandomSource = () => number;

export type ChangeRuleContext = {
  amountOwedCents: number;
  amountPaidCents: number;
  changeCents: number;
  denominations: Denomination[];
  random: RandomSource;
  randomDivisor: number;
};

export type ChangeRule = {
  name: string;
  applies: (context: ChangeRuleContext) => boolean;
  makeChange: (context: ChangeRuleContext) => Map<number, number>;
};

export type RegisterOptions = {
  denominations?: Denomination[];
  random?: RandomSource;
  randomDivisor?: number;
  rules?: ChangeRule[];
};

export type ChangeResult = {
  lineNumber: number;
  amountOwedCents: number;
  amountPaidCents: number;
  changeCents: number;
  returnedChangeCents: number;
  changeShortfallCents: number;
  output: string;
  strategy: string;
  breakdown: ChangeBreakdownItem[];
};

export type ChangeBreakdownItem = Denomination & {
  count: number;
  totalCents: number;
};

export const minimumChangeRule: ChangeRule = {
  name: 'minimum',
  applies: () => true,
  makeChange: ({ changeCents, denominations }) => {
    let remaining = changeCents;
    const counts = new Map<number, number>();

    for (const denomination of denominations) {
      const count = Math.floor(remaining / denomination.cents);
      if (count > 0) {
        counts.set(denomination.cents, count);
        remaining -= count * denomination.cents;
      }
    }

    return counts;
  },
};

export const randomWhenOwedAmountDivisibleRule: ChangeRule = {
  name: 'random',
  applies: ({ amountOwedCents, randomDivisor }) => amountOwedCents % randomDivisor === 0,
  makeChange: ({ changeCents, denominations, random }) => {
    let remaining = changeCents;
    const counts = new Map<number, number>();

    while (remaining > 0) {
      const eligible = denominations.filter((denomination) => denomination.cents <= remaining);
      if (eligible.length === 0) break;

      const index = Math.floor(random() * eligible.length);
      const selected = eligible[Math.min(index, eligible.length - 1)];
      counts.set(selected.cents, (counts.get(selected.cents) ?? 0) + 1);
      remaining -= selected.cents;
    }

    return counts;
  },
};

export const defaultRules: ChangeRule[] = [
  randomWhenOwedAmountDivisibleRule,
  minimumChangeRule,
];

export function calculateChangeForLine(
  rawLine: string,
  lineNumber: number,
  options: RegisterOptions = {},
): ChangeResult {
  const [rawAmountOwed, rawAmountPaid, ...extraColumns] = rawLine.split(',');

  if (!rawAmountOwed || !rawAmountPaid || extraColumns.length > 0) {
    throw new Error(`Line ${lineNumber}: expected "amount owed,amount paid"`);
  }

  const amountOwedCents = parseMoneyToCents(rawAmountOwed);
  const amountPaidCents = parseMoneyToCents(rawAmountPaid);
  const changeCents = amountPaidCents - amountOwedCents;

  if (changeCents < 0) {
    throw new Error(`Line ${lineNumber}: amount paid is less than amount owed`);
  }

  const denominations = options.denominations ?? US_DENOMINATIONS;
  const context: ChangeRuleContext = {
    amountOwedCents,
    amountPaidCents,
    changeCents,
    denominations,
    random: options.random ?? Math.random,
    randomDivisor: options.randomDivisor ?? 3,
  };
  const rules = options.rules ?? defaultRules;
  const rule = rules.find((candidate) => candidate.applies(context)) ?? minimumChangeRule;
  const counts = rule.makeChange(context);
  const returnedChangeCents = Array.from(counts.entries()).reduce(
    (total, [cents, count]) => total + cents * count,
    0,
  );
  const changeShortfallCents = changeCents - returnedChangeCents;

  return {
    lineNumber,
    amountOwedCents,
    amountPaidCents,
    changeCents,
    returnedChangeCents,
    changeShortfallCents,
    output: formatChange(counts, denominations),
    strategy: rule.name,
    breakdown: denominations
      .map((denomination) => {
        const count = counts.get(denomination.cents) ?? 0;

        return {
          ...denomination,
          count,
          totalCents: count * denomination.cents,
        };
      })
      .filter((item) => item.count > 0),
  };
}

export function processRegisterFile(input: string, options: RegisterOptions = {}): ChangeResult[] {
  return input
    .split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), lineNumber: index + 1 }))
    .filter(({ line }) => line.length > 0)
    .map(({ line, lineNumber }) => calculateChangeForLine(line, lineNumber, options));
}
