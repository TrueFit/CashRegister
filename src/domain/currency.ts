export type DenominationVisualKind = 'bill' | 'coin';

export type DenominationVisual = {
  kind: DenominationVisualKind;
  label: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
};

export type Denomination = {
  singular: string;
  plural: string;
  cents: number;
  visual?: Partial<DenominationVisual>;
};

export const US_DENOMINATIONS: Denomination[] = [
  {
    singular: 'hundred-dollar bill',
    plural: 'hundred-dollar bills',
    cents: 10_000,
    visual: {
      kind: 'bill',
      label: '100',
      primaryColor: '#74d7a2',
      secondaryColor: '#2f9b63',
      accentColor: '#bee9cf',
      textColor: '#0c663c',
    },
  },
  {
    singular: 'fifty-dollar bill',
    plural: 'fifty-dollar bills',
    cents: 5_000,
    visual: {
      kind: 'bill',
      label: '50',
      primaryColor: '#4db883',
      secondaryColor: '#1e7a52',
      accentColor: '#a8d9bc',
      textColor: '#0d5437',
    },
  },
  {
    singular: 'twenty-dollar bill',
    plural: 'twenty-dollar bills',
    cents: 2_000,
    visual: {
      kind: 'bill',
      label: '20',
      primaryColor: '#52b87d',
      secondaryColor: '#1f7d54',
      accentColor: '#aaddc6',
      textColor: '#0c5437',
    },
  },
  {
    singular: 'ten-dollar bill',
    plural: 'ten-dollar bills',
    cents: 1_000,
    visual: {
      kind: 'bill',
      label: '10',
      primaryColor: '#7ecfa0',
      secondaryColor: '#2e9e6a',
      accentColor: '#c0e8d4',
      textColor: '#0f6640',
    },
  },
  {
    singular: 'five-dollar bill',
    plural: 'five-dollar bills',
    cents: 500,
    visual: {
      kind: 'bill',
      label: '5',
      primaryColor: '#8dd4a8',
      secondaryColor: '#3aa872',
      accentColor: '#c8e9d6',
      textColor: '#1b6845',
    },
  },
  {
    singular: 'two-dollar bill',
    plural: 'two-dollar bills',
    cents: 200,
    visual: {
      kind: 'bill',
      label: '2',
      primaryColor: '#5abe8c',
      secondaryColor: '#21865e',
      accentColor: '#aadac5',
      textColor: '#0b5038',
    },
  },
  {
    singular: 'dollar bill',
    plural: 'dollar bills',
    cents: 100,
    visual: {
      kind: 'bill',
      label: '1',
      primaryColor: '#66d395',
      secondaryColor: '#2aa869',
      accentColor: '#bee9cf',
      textColor: '#0c663c',
    },
  },
  {
    singular: 'quarter',
    plural: 'quarters',
    cents: 25,
    visual: {
      kind: 'coin',
      label: '25c',
      primaryColor: '#868b95',
      secondaryColor: '#d7dbe1',
      accentColor: '#f7f8fb',
      textColor: '#626976',
    },
  },
  {
    singular: 'dime',
    plural: 'dimes',
    cents: 10,
    visual: {
      kind: 'coin',
      label: '10c',
      primaryColor: '#9299a4',
      secondaryColor: '#e0e3e8',
      accentColor: '#f8f9fb',
      textColor: '#626976',
    },
  },
  {
    singular: 'nickel',
    plural: 'nickels',
    cents: 5,
    visual: {
      kind: 'coin',
      label: '5c',
      primaryColor: '#777d87',
      secondaryColor: '#c8ccd3',
      accentColor: '#eff1f5',
      textColor: '#565d68',
    },
  },
  {
    singular: 'penny',
    plural: 'pennies',
    cents: 1,
    visual: {
      kind: 'coin',
      label: '1c',
      primaryColor: '#9d522f',
      secondaryColor: '#df8d58',
      accentColor: '#ffd3aa',
      textColor: '#7f3e22',
    },
  },
];

export const EURO_DENOMINATIONS: Denomination[] = [
  {
    singular: 'five-hundred-euro bill',
    plural: 'five-hundred-euro bills',
    cents: 50_000,
    visual: {
      kind: 'bill',
      label: '500',
      primaryColor: '#9b6fd3',
      secondaryColor: '#7046a8',
      accentColor: '#dcc9f3',
      textColor: '#4e2f80',
    },
  },
  {
    singular: 'two-hundred-euro bill',
    plural: 'two-hundred-euro bills',
    cents: 20_000,
    visual: {
      kind: 'bill',
      label: '200',
      primaryColor: '#e8d35a',
      secondaryColor: '#b99f24',
      accentColor: '#fff1a3',
      textColor: '#7a6410',
    },
  },
  {
    singular: 'hundred-euro bill',
    plural: 'hundred-euro bills',
    cents: 10_000,
    visual: {
      kind: 'bill',
      label: '100',
      primaryColor: '#68c98a',
      secondaryColor: '#2f965c',
      accentColor: '#bde7cb',
      textColor: '#17613a',
    },
  },
  {
    singular: 'fifty-euro bill',
    plural: 'fifty-euro bills',
    cents: 5_000,
    visual: {
      kind: 'bill',
      label: '50',
      primaryColor: '#e59b57',
      secondaryColor: '#bf6f2f',
      accentColor: '#f6cfaa',
      textColor: '#7a3f15',
    },
  },
  {
    singular: 'twenty-euro bill',
    plural: 'twenty-euro bills',
    cents: 2_000,
    visual: {
      kind: 'bill',
      label: '20',
      primaryColor: '#6aa6db',
      secondaryColor: '#2e75b2',
      accentColor: '#c1dbf2',
      textColor: '#1d4f7f',
    },
  },
  {
    singular: 'ten-euro bill',
    plural: 'ten-euro bills',
    cents: 1_000,
    visual: {
      kind: 'bill',
      label: '10',
      primaryColor: '#d46f85',
      secondaryColor: '#a5425a',
      accentColor: '#f0bac6',
      textColor: '#7a2638',
    },
  },
  {
    singular: 'five-euro bill',
    plural: 'five-euro bills',
    cents: 500,
    visual: {
      kind: 'bill',
      label: '5',
      primaryColor: '#8f98a8',
      secondaryColor: '#5c6676',
      accentColor: '#d7dce3',
      textColor: '#394250',
    },
  },
  {
    singular: 'two-euro coin',
    plural: 'two-euro coins',
    cents: 200,
    visual: {
      kind: 'coin',
      label: '2',
      primaryColor: '#c4a85b',
      secondaryColor: '#d7dbe1',
      accentColor: '#f7f8fb',
      textColor: '#6b5622',
    },
  },
  {
    singular: 'one-euro coin',
    plural: 'one-euro coins',
    cents: 100,
    visual: {
      kind: 'coin',
      label: '1',
      primaryColor: '#d7dbe1',
      secondaryColor: '#c4a85b',
      accentColor: '#f6e3a8',
      textColor: '#5d542d',
    },
  },
  {
    singular: 'fifty-cent coin',
    plural: 'fifty-cent coins',
    cents: 50,
    visual: {
      kind: 'coin',
      label: '50c',
      primaryColor: '#c49a43',
      secondaryColor: '#efcf75',
      accentColor: '#fff0b9',
      textColor: '#735314',
    },
  },
  {
    singular: 'twenty-cent coin',
    plural: 'twenty-cent coins',
    cents: 20,
    visual: {
      kind: 'coin',
      label: '20c',
      primaryColor: '#c08e33',
      secondaryColor: '#e7bf65',
      accentColor: '#f7dda0',
      textColor: '#70490f',
    },
  },
  {
    singular: 'ten-cent coin',
    plural: 'ten-cent coins',
    cents: 10,
    visual: {
      kind: 'coin',
      label: '10c',
      primaryColor: '#b9812d',
      secondaryColor: '#d9ad59',
      accentColor: '#f3d18b',
      textColor: '#68420d',
    },
  },
  {
    singular: 'five-cent coin',
    plural: 'five-cent coins',
    cents: 5,
    visual: {
      kind: 'coin',
      label: '5c',
      primaryColor: '#a95f35',
      secondaryColor: '#d48a59',
      accentColor: '#f4c4a3',
      textColor: '#653018',
    },
  },
  {
    singular: 'two-cent coin',
    plural: 'two-cent coins',
    cents: 2,
    visual: {
      kind: 'coin',
      label: '2c',
      primaryColor: '#a35430',
      secondaryColor: '#cf7d4f',
      accentColor: '#f2ba98',
      textColor: '#653018',
    },
  },
  {
    singular: 'one-cent coin',
    plural: 'one-cent coins',
    cents: 1,
    visual: {
      kind: 'coin',
      label: '1c',
      primaryColor: '#944525',
      secondaryColor: '#c76d45',
      accentColor: '#efad88',
      textColor: '#5d2a15',
    },
  },
];

export function parseMoneyToCents(value: string): number {
  const trimmed = value.trim();
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(trimmed);

  if (!match) {
    throw new Error(`Invalid money amount: "${value}"`);
  }

  const dollars = Number(match[1]);
  const cents = Number((match[2] ?? '').padEnd(2, '0'));
  return dollars * 100 + cents;
}

export function formatChange(counts: Map<number, number>, denominations = US_DENOMINATIONS): string {
  const parts = denominations
    .map((denomination) => {
      const count = counts.get(denomination.cents) ?? 0;
      const label = count === 1 ? denomination.singular : denomination.plural;
      return count > 0 ? `${count} ${label}` : null;
    })
    .filter((part): part is string => part !== null);

  return parts.length > 0 ? parts.join(',') : 'no change';
}
