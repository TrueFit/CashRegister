export type CurrencyCode = string;

export type CurrencyOption = {
  code: CurrencyCode;
  label: string;
  symbol: string;
  usdRate: number;
  editable: boolean;
  custom?: boolean;
};

export type NewCurrencyDraft = {
  code: string;
  label: string;
  symbol: string;
  usdRate: string;
};

export const USD_CURRENCY_CODE = 'USD';
export const EURO_CURRENCY_CODE = 'EUR';
export const DEFAULT_BASE_CURRENCY_CODE = USD_CURRENCY_CODE;

export const DEFAULT_CURRENCIES: CurrencyOption[] = [
  { code: USD_CURRENCY_CODE, label: 'Dollar', symbol: '$', usdRate: 1, editable: false },
  { code: EURO_CURRENCY_CODE, label: 'Euro', symbol: '€', usdRate: 1.08, editable: true },
];

export function formatMoney(
  cents: number,
  currency: Pick<CurrencyOption, 'symbol'> = DEFAULT_CURRENCIES[0],
): string {
  return `${currency.symbol}${(cents / 100).toFixed(2)}`;
}

export function formatDenominationValue(
  cents: number,
  currency: Pick<CurrencyOption, 'symbol'> = DEFAULT_CURRENCIES[0],
): string {
  return cents >= 100 ? formatMoney(cents, currency) : `${cents}c`;
}

export function formatMoneyInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatRateInput(rate: number): string {
  if (Number.isInteger(rate)) {
    return rate.toFixed(2);
  }

  return rate.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
}

export function isCurrencyCode(value: string, allCurrencies: CurrencyOption[]): boolean {
  return allCurrencies.some((currency) => currency.code === value);
}

export function isStoredCustomCurrency(value: unknown): value is CurrencyOption {
  if (!value || typeof value !== 'object') return false;

  const currency = value as Partial<CurrencyOption>;
  return (
    typeof currency.code === 'string' &&
    typeof currency.label === 'string' &&
    typeof currency.symbol === 'string' &&
    typeof currency.usdRate === 'number' &&
    currency.usdRate > 0 &&
    currency.custom === true &&
    !DEFAULT_CURRENCIES.some((defaultCurrency) => defaultCurrency.code === currency.code)
  );
}

export function getCurrencyByCode(
  currencies: CurrencyOption[],
  code: CurrencyCode,
): CurrencyOption | null {
  return currencies.find((currency) => currency.code === code) ?? null;
}

export function getDefaultBaseCurrencyCode(currencies: CurrencyOption[]): CurrencyCode {
  return (
    getCurrencyByCode(currencies, DEFAULT_BASE_CURRENCY_CODE)?.code ??
    currencies[0]?.code ??
    DEFAULT_BASE_CURRENCY_CODE
  );
}

export function getCurrencyRateInBase(
  currency: CurrencyOption,
  baseCurrency: CurrencyOption,
): number {
  return currency.usdRate / baseCurrency.usdRate;
}

export function buildCurrencyRateInputs(
  currencies: CurrencyOption[],
  baseCurrency: CurrencyOption,
): Record<CurrencyCode, string> {
  return currencies.reduce(
    (inputs, currency) => ({
      ...inputs,
      [currency.code]:
        currency.code === baseCurrency.code
          ? formatRateInput(1)
          : formatRateInput(getCurrencyRateInBase(currency, baseCurrency)),
    }),
    {} as Record<CurrencyCode, string>,
  );
}

export function parseCurrencyRateInput(value: string | undefined): number {
  const rate = Number(value);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error('Enter currency equivalents greater than 0.');
  }

  return rate;
}

export function convertCurrencyCents(
  cents: number,
  fromCurrency: CurrencyOption,
  toCurrency: CurrencyOption,
): number {
  return Math.round(cents * getCurrencyRateInBase(fromCurrency, toCurrency));
}
