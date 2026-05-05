import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BadgeDollarSign, Calculator, Clock3, Info, Settings } from 'lucide-react';
import { appRoutes, getPageFromPath, isAppRoute } from './app/routes';
import type { Page } from './app/routes';
import { storageKeys } from './app/storageKeys';
import { ChangeResult, calculateChangeForLine, processRegisterFile } from './domain/changeRules';
import { Denomination, parseMoneyToCents } from './domain/currency';
import {
  CurrencyCode,
  CurrencyOption,
  DEFAULT_BASE_CURRENCY_CODE as defaultBaseCurrencyCode,
  DEFAULT_CURRENCIES as defaultCurrencies,
  EURO_CURRENCY_CODE as euroCurrencyCode,
  NewCurrencyDraft,
  USD_CURRENCY_CODE as usdCurrencyCode,
  buildCurrencyRateInputs,
  convertCurrencyCents,
  formatMoneyInput,
  formatRateInput,
  getCurrencyByCode,
  getDefaultBaseCurrencyCode,
  isCurrencyCode,
  isStoredCustomCurrency,
  parseCurrencyRateInput,
} from './domain/currencies';
import {
  DenominationAvailability,
  DenominationDraft,
  createDefaultDenominationAvailability,
  createDenominationAvailability,
  createDenominationDraft,
  createDenominationDrafts,
  findNextDraftCentValue,
  getDefaultDenominations,
  getDefaultVisual,
  getEuroDenominations,
  normalizeDenomination,
  parseDenominationDrafts,
  parseStoredDenominations,
  sortDenominations,
} from './domain/denominations';
import {
  ProcessedState,
  StoredTransaction,
  getTransactionCurrency,
  isStoredTransaction,
  storeTransaction,
  withChangeTotals,
} from './domain/transactions';
import { AboutPage } from './pages/AboutPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { DenominationsPage } from './pages/DenominationsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

const defaultTrickNumber = 3;

function loadDenominations(): Denomination[] {
  try {
    const rawValue = localStorage.getItem(storageKeys.denominations);
    const parsedValue: unknown = rawValue ? JSON.parse(rawValue) : null;
    return parseStoredDenominations(parsedValue);
  } catch {
    return getDefaultDenominations();
  }
}

function randomIntegerBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseFirstLine(input: string): { owed: string; paid: string } | null {
  const firstLine = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (!firstLine) return null;

  const [owed, paid] = firstLine.split(',');
  return owed && paid ? { owed: owed.trim(), paid: paid.trim() } : null;
}

function loadTransactionHistory(): StoredTransaction[] {
  try {
    const rawHistory = localStorage.getItem(storageKeys.transactionHistory);
    if (!rawHistory) return [];

    const parsedHistory: unknown = JSON.parse(rawHistory);
    return Array.isArray(parsedHistory)
      ? parsedHistory.filter(isStoredTransaction).map(withChangeTotals)
      : [];
  } catch {
    return [];
  }
}

function loadDenominationAvailability(denominations: Denomination[]): DenominationAvailability {
  try {
    const rawValue = localStorage.getItem(storageKeys.denominationAvailability);
    const parsedValue: unknown = rawValue ? JSON.parse(rawValue) : null;
    return createDenominationAvailability(denominations, parsedValue);
  } catch {
    return createDefaultDenominationAvailability(denominations);
  }
}

function loadTrickNumber(): number {
  const rawValue = localStorage.getItem(storageKeys.trickNumber);
  const parsedValue = rawValue ? Number(rawValue) : defaultTrickNumber;

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : defaultTrickNumber;
}

function loadCurrencies(): CurrencyOption[] {
  try {
    const rawValue = localStorage.getItem(storageKeys.currencies);
    const parsedValue: unknown = rawValue ? JSON.parse(rawValue) : null;
    const savedCurrencies = Array.isArray(parsedValue) ? parsedValue : [];

    const base = defaultCurrencies.map((defaultCurrency) => {
      const savedCurrency = savedCurrencies.find(
        (currency) =>
          currency &&
          typeof currency === 'object' &&
          'code' in currency &&
          currency.code === defaultCurrency.code,
      ) as Partial<CurrencyOption> | undefined;
      const savedRate = Number(savedCurrency?.usdRate);
      const usdRate =
        defaultCurrency.editable && Number.isFinite(savedRate) && savedRate > 0
          ? savedRate
          : defaultCurrency.usdRate;

      return { ...defaultCurrency, usdRate };
    });

    const custom = savedCurrencies.filter(isStoredCustomCurrency);

    return [...base, ...custom];
  } catch {
    return defaultCurrencies;
  }
}

function loadBaseCurrencyCode(currencies: CurrencyOption[]): CurrencyCode {
  const storedCode = localStorage.getItem(storageKeys.baseCurrency);

  return storedCode && isCurrencyCode(storedCode, currencies)
    ? storedCode
    : getDefaultBaseCurrencyCode(currencies);
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTrickNumber = loadTrickNumber();
  const initialCurrencies = loadCurrencies();
  const initialBaseCurrencyCode = loadBaseCurrencyCode(initialCurrencies);
  const initialBaseCurrency =
    getCurrencyByCode(initialCurrencies, initialBaseCurrencyCode) ?? defaultCurrencies[0];
  const initialDenominations = loadDenominations();
  const initialDenominationAvailability = loadDenominationAvailability(initialDenominations);
  const skipNextStorageSyncRef = useRef(false);
  const activePage = getPageFromPath(location.pathname);
  const [transactionHistory, setTransactionHistory] = useState<StoredTransaction[]>(() =>
    loadTransactionHistory(),
  );
  const [trickNumber, setTrickNumber] = useState(initialTrickNumber);
  const [trickNumberInput, setTrickNumberInput] = useState(() => String(initialTrickNumber));
  const [currencies, setCurrencies] = useState<CurrencyOption[]>(initialCurrencies);
  const [baseCurrencyCode, setBaseCurrencyCode] = useState<CurrencyCode>(initialBaseCurrencyCode);
  const [newCurrencyDraft, setNewCurrencyDraft] = useState<NewCurrencyDraft | null>(null);
  const [currencyRateInputs, setCurrencyRateInputs] = useState<Record<string, string>>(() =>
    buildCurrencyRateInputs(initialCurrencies, initialBaseCurrency),
  );
  const [amountPaidCurrency, setAmountPaidCurrency] =
    useState<CurrencyCode>(initialBaseCurrencyCode);
  const [denominations, setDenominations] = useState<Denomination[]>(initialDenominations);
  const [denominationDrafts, setDenominationDrafts] = useState<DenominationDraft[]>(() =>
    createDenominationDrafts(initialDenominations),
  );
  const [denominationAvailability, setDenominationAvailability] = useState<DenominationAvailability>(
    initialDenominationAvailability,
  );
  const [settingsMessage, setSettingsMessage] = useState('');
  const [amountOwed, setAmountOwed] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [processed, setProcessed] = useState<ProcessedState>({
    status: 'idle',
    results: transactionHistory.slice(0, 8),
    error: null,
  });

  const currentResult = processed.status === 'error' ? null : processed.results[0] ?? null;
  const output = useMemo(
    () => transactionHistory.map((result) => result.output).join('\n'),
    [transactionHistory],
  );
  const totalProcessed = transactionHistory.length;
  const randomCount = transactionHistory.filter((result) => result.strategy === 'random').length;
  const minimumCount = transactionHistory.filter((result) => result.strategy === 'minimum').length;
  const resultStrategyLabel =
    currentResult?.strategy === 'random' ? 'Random denominations' : 'Normal (minimum change)';
  const selectedBaseCurrency =
    getCurrencyByCode(currencies, baseCurrencyCode) ?? defaultCurrencies[0];
  const selectedPaidCurrency =
    getCurrencyByCode(currencies, amountPaidCurrency) ?? selectedBaseCurrency;
  const displayedResultCurrency = currentResult
    ? getTransactionCurrency(currentResult)
    : selectedBaseCurrency;
  const amountPaidBaseEquivalent = useMemo(() => {
    try {
      const paidCents = parseMoneyToCents(amountPaid);
      return convertCurrencyCents(paidCents, selectedPaidCurrency, selectedBaseCurrency);
    } catch {
      return null;
    }
  }, [amountPaid, selectedBaseCurrency, selectedPaidCurrency]);
  const activeDenominations = useMemo(
    () =>
      sortDenominations(
        denominations.filter((denomination) => denominationAvailability[denomination.cents]),
      ),
    [denominations, denominationAvailability],
  );
  const activeDenominationCount = activeDenominations.length;

  useEffect(() => {
    if (!isAppRoute(location.pathname)) {
      navigate(appRoutes.calculator, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (skipNextStorageSyncRef.current) return;

    localStorage.setItem(storageKeys.transactionHistory, JSON.stringify(transactionHistory));
  }, [transactionHistory]);

  useEffect(() => {
    if (skipNextStorageSyncRef.current) return;

    localStorage.setItem(storageKeys.trickNumber, String(trickNumber));
  }, [trickNumber]);

  useEffect(() => {
    if (skipNextStorageSyncRef.current) return;

    localStorage.setItem(storageKeys.currencies, JSON.stringify(currencies));
  }, [currencies]);

  useEffect(() => {
    if (skipNextStorageSyncRef.current) return;

    localStorage.setItem(storageKeys.baseCurrency, baseCurrencyCode);
  }, [baseCurrencyCode]);

  useEffect(() => {
    if (skipNextStorageSyncRef.current) return;

    localStorage.setItem(storageKeys.denominations, JSON.stringify(denominations));
  }, [denominations]);

  useEffect(() => {
    if (skipNextStorageSyncRef.current) return;

    localStorage.setItem(
      storageKeys.denominationAvailability,
      JSON.stringify(denominationAvailability),
    );
  }, [denominationAvailability]);

  useEffect(() => {
    if (skipNextStorageSyncRef.current) {
      skipNextStorageSyncRef.current = false;
    }
  });

  function setActivePage(page: Page) {
    navigate(appRoutes[page]);
  }

  function saveResults(
    results: ChangeResult[],
    currency: Pick<CurrencyOption, 'code' | 'symbol'> = selectedBaseCurrency,
  ) {
    const storedResults = results.map((result) => storeTransaction(result, currency));

    setTransactionHistory((current) => [...storedResults, ...current]);
    setProcessed({
      status: 'ready',
      results: storedResults,
      error: null,
    });
  }

  function markIdle() {
    setProcessed((current) => ({
      status: 'idle',
      results: current.results,
      error: null,
    }));
  }

  function updateAmountOwed(value: string) {
    setAmountOwed(value);
    markIdle();
  }

  function updateAmountPaid(value: string) {
    setAmountPaid(value);
    markIdle();
  }

  function updateAmountPaidCurrency(nextCurrencyCode: CurrencyCode) {
    if (!isCurrencyCode(nextCurrencyCode, currencies)) return;

    setAmountPaidCurrency(nextCurrencyCode);
    markIdle();
  }

  function updateTrickNumberInput(value: string) {
    setTrickNumberInput(value);
    setSettingsMessage('');
  }

  function updateCurrencyRateInput(currencyCode: CurrencyCode, value: string) {
    setCurrencyRateInputs((current) => ({
      ...current,
      [currencyCode]: value,
    }));
    setSettingsMessage('');
  }

  function updateNewCurrencyDraft(updates: Partial<NewCurrencyDraft>) {
    setNewCurrencyDraft((draft) => (draft ? { ...draft, ...updates } : draft));
  }

  function startNewCurrencyDraft() {
    setNewCurrencyDraft({ code: '', label: '', symbol: '', usdRate: '1.00' });
  }

  function cancelNewCurrencyDraft() {
    setNewCurrencyDraft(null);
    setSettingsMessage('');
  }

  function runRegister() {
    try {
      const paidAmountBase =
        amountPaidCurrency === baseCurrencyCode
          ? amountPaid
          : formatMoneyInput(convertAmountPaidToBaseCents());
      const result = calculateChangeForLine(`${amountOwed},${paidAmountBase}`, 1, {
        denominations: activeDenominations,
        randomDivisor: trickNumber,
      });
      saveResults([result], selectedBaseCurrency);
    } catch (error) {
      setProcessed({
        status: 'error',
        results: transactionHistory.slice(0, 8),
        error: error instanceof Error ? error.message : 'Unexpected processing error',
      });
    }
  }

  async function readFlatFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const contents = await file.text();

    try {
      const results = processRegisterFile(contents, {
        denominations: activeDenominations,
        randomDivisor: trickNumber,
      });
      const firstLine = parseFirstLine(contents);
      if (firstLine) {
        setAmountOwed(firstLine.owed);
        setAmountPaid(firstLine.paid);
        setAmountPaidCurrency(baseCurrencyCode);
      }
      saveResults(results, selectedBaseCurrency);
    } catch (error) {
      setProcessed({
        status: 'error',
        results: transactionHistory.slice(0, 8),
        error: error instanceof Error ? error.message : 'Unexpected processing error',
      });
    } finally {
      event.target.value = '';
    }
  }

  function generateSampleTransaction() {
    const owedCents = randomIntegerBetween(100, 999);
    const minimumPaidDollars = Math.floor(owedCents / 100) + 1;
    const paidCents = randomIntegerBetween(minimumPaidDollars, 10) * 100;
    const nextAmountOwed = formatMoneyInput(owedCents);
    const nextAmountPaid = formatMoneyInput(paidCents);

    setAmountOwed(nextAmountOwed);
    setAmountPaid(nextAmountPaid);
    setAmountPaidCurrency(baseCurrencyCode);

    try {
      const result = calculateChangeForLine(`${nextAmountOwed},${nextAmountPaid}`, 1, {
        denominations: activeDenominations,
        randomDivisor: trickNumber,
      });
      saveResults([result], selectedBaseCurrency);
    } catch (error) {
      setProcessed({
        status: 'error',
        results: transactionHistory.slice(0, 8),
        error: error instanceof Error ? error.message : 'Unexpected processing error',
      });
    }
  }

  function rerollRandomTransaction(transactionId: string) {
    const original = transactionHistory.find((transaction) => transaction.id === transactionId);
    if (!original || original.strategy !== 'random') return;

    const nextResult = calculateChangeForLine(
      `${formatMoneyInput(original.amountOwedCents)},${formatMoneyInput(original.amountPaidCents)}`,
      original.lineNumber,
      { denominations: activeDenominations, randomDivisor: trickNumber },
    );
    const replacement: StoredTransaction = {
      ...nextResult,
      id: original.id,
      createdAt: original.createdAt,
      currencyCode: original.currencyCode ?? defaultBaseCurrencyCode,
      currencySymbol: original.currencySymbol ?? defaultCurrencies[0].symbol,
    };

    setTransactionHistory((current) =>
      current.map((transaction) => (transaction.id === transactionId ? replacement : transaction)),
    );

    setProcessed((current) => {
      if (current.status === 'error') return current;

      return {
        status: 'ready',
        results: current.results.map((result) => (result.id === transactionId ? replacement : result)),
        error: null,
      };
    });
  }

  function clearHistory() {
    setTransactionHistory([]);
    setProcessed({
      status: 'idle',
      results: [],
      error: null,
    });
  }

  function viewTransactionDetails(transaction: StoredTransaction) {
    setAmountOwed(formatMoneyInput(transaction.amountOwedCents));
    setAmountPaid(formatMoneyInput(transaction.amountPaidCents));
    setAmountPaidCurrency(
      transaction.currencyCode && isCurrencyCode(transaction.currencyCode, currencies)
        ? transaction.currencyCode
        : baseCurrencyCode,
    );
    setProcessed({
      status: 'ready',
      results: [transaction],
      error: null,
    });
    setActivePage('calculator');
  }

  function saveSettings() {
    const nextTrickNumber = Number(trickNumberInput);

    if (!Number.isInteger(nextTrickNumber) || nextTrickNumber <= 0) {
      setSettingsMessage('Enter a whole number greater than 0.');
      return;
    }

    try {
      const nextBaseCurrencyCode = isCurrencyCode(baseCurrencyCode, currencies)
        ? baseCurrencyCode
        : getDefaultBaseCurrencyCode(currencies);
      const nextBaseUsdRate =
        nextBaseCurrencyCode === usdCurrencyCode
          ? 1
          : 1 / parseCurrencyRateInput(currencyRateInputs[usdCurrencyCode]);
      const nextCurrencies = currencies.map((currency) => {
        if (currency.code === usdCurrencyCode) {
          return { ...currency, usdRate: 1 };
        }

        if (currency.code === nextBaseCurrencyCode) {
          return { ...currency, usdRate: nextBaseUsdRate };
        }

        return {
          ...currency,
          usdRate: parseCurrencyRateInput(currencyRateInputs[currency.code]) * nextBaseUsdRate,
        };
      });
      const nextBaseCurrency =
        getCurrencyByCode(nextCurrencies, nextBaseCurrencyCode) ?? defaultCurrencies[0];
      const nextDenominations = parseDenominationDrafts(denominationDrafts, nextBaseCurrency);

      setTrickNumber(nextTrickNumber);
      setTrickNumberInput(String(nextTrickNumber));
      setCurrencies(nextCurrencies);
      setBaseCurrencyCode(nextBaseCurrencyCode);
      setCurrencyRateInputs(buildCurrencyRateInputs(nextCurrencies, nextBaseCurrency));
      setDenominations(nextDenominations);
      setDenominationDrafts(createDenominationDrafts(nextDenominations));
      setDenominationAvailability((current) =>
        nextDenominations.reduce(
          (availability, denomination) => ({
            ...availability,
            [denomination.cents]: current[denomination.cents] ?? true,
          }),
          {} as DenominationAvailability,
        ),
      );
      setSettingsMessage('Settings saved.');
    } catch (error) {
      setSettingsMessage(error instanceof Error ? error.message : 'Unable to save settings.');
    }
  }

  function convertAmountPaidToBaseCents(): number {
    const paidCents = parseMoneyToCents(amountPaid);
    return convertCurrencyCents(paidCents, selectedPaidCurrency, selectedBaseCurrency);
  }

  function changeBaseCurrency(nextBaseCurrencyCode: CurrencyCode) {
    const nextBaseCurrency = getCurrencyByCode(currencies, nextBaseCurrencyCode);
    if (!nextBaseCurrency) return;

    setBaseCurrencyCode(nextBaseCurrencyCode);
    setCurrencyRateInputs(buildCurrencyRateInputs(currencies, nextBaseCurrency));
    setAmountPaidCurrency((current) =>
      current === baseCurrencyCode ? nextBaseCurrencyCode : current,
    );
    setSettingsMessage('');
    markIdle();
  }

  function setDenominationAvailable(denomination: Denomination, isAvailable: boolean) {
    setDenominationAvailability((current) => ({
      ...current,
      [denomination.cents]: isAvailable,
    }));
    setSettingsMessage('');
  }

  function updateDenominationDraft(index: number, updates: Partial<DenominationDraft>) {
    setDenominationDrafts((current) =>
      current.map((draft, draftIndex) =>
        draftIndex === index
          ? {
              ...draft,
              ...updates,
            }
          : draft,
      ),
    );
    setSettingsMessage('');
  }

  function addDenominationDraft() {
    setDenominationDrafts((current) => {
      const cents = findNextDraftCentValue(current);
      const visualKind = cents >= 100 ? 'bill' : 'coin';
      const draft = createDenominationDraft(
        normalizeDenomination({
          singular: visualKind === 'bill' ? 'custom bill' : 'custom coin',
          plural: visualKind === 'bill' ? 'custom bills' : 'custom coins',
          cents,
          visual: getDefaultVisual(cents, visualKind),
        }),
      );

      return [...current, draft];
    });
    setSettingsMessage('');
  }

  function addNewCurrency() {
    if (!newCurrencyDraft) return;

    const code = newCurrencyDraft.code.trim().toUpperCase();
    const label = newCurrencyDraft.label.trim();
    const symbol = newCurrencyDraft.symbol.trim();
    const baseRate = Number(newCurrencyDraft.usdRate);

    if (!code || !/^[A-Z]{1,4}$/.test(code)) {
      setSettingsMessage('Enter a valid currency code (1–4 letters).');
      return;
    }
    if (!label) {
      setSettingsMessage('Enter a currency label.');
      return;
    }
    if (!symbol) {
      setSettingsMessage('Enter a currency symbol.');
      return;
    }
    if (!Number.isFinite(baseRate) || baseRate <= 0) {
      setSettingsMessage('Enter a currency equivalent greater than 0.');
      return;
    }
    if (currencies.some((currency) => currency.code === code)) {
      setSettingsMessage(`Currency code ${code} already exists.`);
      return;
    }

    const newCurrency: CurrencyOption = {
      code,
      label,
      symbol,
      usdRate: baseRate * selectedBaseCurrency.usdRate,
      editable: true,
      custom: true,
    };
    setCurrencies((current) => [...current, newCurrency]);
    setCurrencyRateInputs((current) => ({ ...current, [code]: formatRateInput(baseRate) }));
    setNewCurrencyDraft(null);
    setSettingsMessage('');
  }

  function removeCustomCurrency(code: string) {
    const nextCurrencies = currencies.filter((currency) => currency.code !== code);
    const nextBaseCurrencyCode =
      baseCurrencyCode === code ? getDefaultBaseCurrencyCode(nextCurrencies) : baseCurrencyCode;
    const nextBaseCurrency =
      getCurrencyByCode(nextCurrencies, nextBaseCurrencyCode) ?? defaultCurrencies[0];

    setCurrencies(nextCurrencies);
    setBaseCurrencyCode(nextBaseCurrencyCode);
    setCurrencyRateInputs(buildCurrencyRateInputs(nextCurrencies, nextBaseCurrency));
    if (amountPaidCurrency === code) {
      setAmountPaidCurrency(nextBaseCurrencyCode);
    }
    setSettingsMessage('');
  }

  function resetSoftware() {
    const nextCurrencies = defaultCurrencies;
    const nextBaseCurrencyCode = defaultBaseCurrencyCode;
    const nextBaseCurrency =
      getCurrencyByCode(nextCurrencies, nextBaseCurrencyCode) ?? defaultCurrencies[0];
    const nextDenominations = getDefaultDenominations();

    skipNextStorageSyncRef.current = true;
    localStorage.clear();
    setTransactionHistory([]);
    setTrickNumber(defaultTrickNumber);
    setTrickNumberInput(String(defaultTrickNumber));
    setCurrencies(nextCurrencies);
    setBaseCurrencyCode(nextBaseCurrencyCode);
    setNewCurrencyDraft(null);
    setCurrencyRateInputs(buildCurrencyRateInputs(nextCurrencies, nextBaseCurrency));
    setAmountPaidCurrency(nextBaseCurrencyCode);
    setDenominations(nextDenominations);
    setDenominationDrafts(createDenominationDrafts(nextDenominations));
    setDenominationAvailability(createDefaultDenominationAvailability(nextDenominations));
    setAmountOwed('');
    setAmountPaid('');
    setProcessed({
      status: 'idle',
      results: [],
      error: null,
    });
    setSettingsMessage('Software reset.');
  }

  function removeDenominationDraft(index: number) {
    setDenominationDrafts((current) => current.filter((_, draftIndex) => draftIndex !== index));
    setSettingsMessage('');
  }

  function applyDenominationPreset(
    nextDenominations: Denomination[],
    nextBaseCurrencyCode: CurrencyCode,
    message: string,
  ) {
    const nextBaseCurrency = getCurrencyByCode(currencies, nextBaseCurrencyCode);
    if (!nextBaseCurrency) return;

    setBaseCurrencyCode(nextBaseCurrencyCode);
    setCurrencyRateInputs(buildCurrencyRateInputs(currencies, nextBaseCurrency));
    setAmountPaidCurrency((current) =>
      current === baseCurrencyCode ? nextBaseCurrencyCode : current,
    );
    setDenominations(nextDenominations);
    setDenominationDrafts(createDenominationDrafts(nextDenominations));
    setDenominationAvailability(createDefaultDenominationAvailability(nextDenominations));
    setSettingsMessage(message);
    markIdle();
  }

  function resetDenominationsToDefault() {
    applyDenominationPreset(getDefaultDenominations(), usdCurrencyCode, 'US denominations restored.');
  }

  function resetDenominationsToEuro() {
    applyDenominationPreset(getEuroDenominations(), euroCurrencyCode, 'Euro denominations restored.');
  }

  function saveDenominations() {
    saveSettings();
    setActivePage('settings');
  }

  function downloadOutput() {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'cash-register-output.txt';
    link.click();
    URL.revokeObjectURL(href);
  }

  function renderActivePage() {
    if (activePage === 'history') {
      return (
        <HistoryPage
          minimumCount={minimumCount}
          output={output}
          randomCount={randomCount}
          totalProcessed={totalProcessed}
          transactionHistory={transactionHistory}
          onClearHistory={clearHistory}
          onDownloadOutput={downloadOutput}
          onRerollRandomTransaction={rerollRandomTransaction}
          onViewTransactionDetails={viewTransactionDetails}
        />
      );
    }

    if (activePage === 'settings') {
      return (
        <SettingsPage
          activeDenominationCount={activeDenominationCount}
          baseCurrencyCode={baseCurrencyCode}
          currencies={currencies}
          currencyRateInputs={currencyRateInputs}
          denominationAvailability={denominationAvailability}
          denominations={denominations}
          newCurrencyDraft={newCurrencyDraft}
          selectedBaseCurrency={selectedBaseCurrency}
          settingsMessage={settingsMessage}
          trickNumberInput={trickNumberInput}
          onAddNewCurrency={addNewCurrency}
          onBaseCurrencyChange={changeBaseCurrency}
          onCancelNewCurrencyDraft={cancelNewCurrencyDraft}
          onCurrencyRateInputChange={updateCurrencyRateInput}
          onEditDenominations={() => setActivePage('denominations')}
          onNewCurrencyDraftChange={updateNewCurrencyDraft}
          onRemoveCustomCurrency={removeCustomCurrency}
          onResetSoftware={resetSoftware}
          onSaveSettings={saveSettings}
          onSetDenominationAvailable={setDenominationAvailable}
          onStartNewCurrencyDraft={startNewCurrencyDraft}
          onTrickNumberInputChange={updateTrickNumberInput}
        />
      );
    }

    if (activePage === 'denominations') {
      return (
        <DenominationsPage
          denominationAvailability={denominationAvailability}
          denominationDrafts={denominationDrafts}
          settingsMessage={settingsMessage}
          onAddDenominationDraft={addDenominationDraft}
          onRemoveDenominationDraft={removeDenominationDraft}
          onResetDenominationsToDefault={resetDenominationsToDefault}
          onResetDenominationsToEuro={resetDenominationsToEuro}
          onSaveDenominations={saveDenominations}
          onSetDenominationAvailable={setDenominationAvailable}
          onUpdateDenominationDraft={updateDenominationDraft}
        />
      );
    }

    if (activePage === 'about') {
      return <AboutPage />;
    }

    return (
      <CalculatorPage
        amountOwed={amountOwed}
        amountPaid={amountPaid}
        amountPaidBaseEquivalent={amountPaidBaseEquivalent}
        amountPaidCurrency={amountPaidCurrency}
        baseCurrencyCode={baseCurrencyCode}
        currencies={currencies}
        currentResult={currentResult}
        displayedResultCurrency={displayedResultCurrency}
        minimumCount={minimumCount}
        output={output}
        processed={processed}
        randomCount={randomCount}
        resultStrategyLabel={resultStrategyLabel}
        selectedBaseCurrency={selectedBaseCurrency}
        selectedPaidCurrency={selectedPaidCurrency}
        totalProcessed={totalProcessed}
        transactionHistory={transactionHistory}
        trickNumber={trickNumber}
        onAmountOwedChange={updateAmountOwed}
        onAmountPaidChange={updateAmountPaid}
        onAmountPaidCurrencyChange={updateAmountPaidCurrency}
        onCalculate={runRegister}
        onDownloadOutput={downloadOutput}
        onGenerateSampleTransaction={generateSampleTransaction}
        onLoadFlatFile={readFlatFile}
        onRerollRandomTransaction={rerollRandomTransaction}
        onViewAllHistory={() => setActivePage('history')}
        onViewTransactionDetails={viewTransactionDetails}
      />
    );
  }

  return (
    <div className="app-frame">
      <aside className="sidebar" aria-label="Application navigation">
        <div className="sidebar-brand">
          <div className="brand-icon" aria-hidden="true">
            <BadgeDollarSign size={28} />
          </div>
          <div>
            <span>Cash</span>
            <span>Register</span>
          </div>
        </div>

        <nav className="side-nav" aria-label="Primary">
          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end
            to={appRoutes.calculator}
          >
            <Calculator size={22} aria-hidden="true" />
            Calculator
          </NavLink>
          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            to={appRoutes.history}
          >
            <Clock3 size={22} aria-hidden="true" />
            History
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav-item ${isActive || activePage === 'denominations' ? 'active' : ''}`
            }
            to={appRoutes.settings}
          >
            <Settings size={22} aria-hidden="true" />
            Settings
          </NavLink>
          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            to={appRoutes.about}
          >
            <Info size={22} aria-hidden="true" />
            About
          </NavLink>
        </nav>
      </aside>

      <main className="main-stage">{renderActivePage()}</main>
    </div>
  );
}
