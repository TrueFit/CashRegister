import { ChevronRight, Plus, Settings, Trash2 } from 'lucide-react';
import { MoneyToken } from '../components/MoneyToken';
import type { Denomination } from '../domain/currency';
import type { CurrencyCode, CurrencyOption, NewCurrencyDraft } from '../domain/currencies';
import { formatDenominationValue } from '../domain/currencies';
import type { DenominationAvailability } from '../domain/denominations';

type SettingsPageProps = {
  activeDenominationCount: number;
  baseCurrencyCode: CurrencyCode;
  currencies: CurrencyOption[];
  currencyRateInputs: Record<string, string>;
  denominationAvailability: DenominationAvailability;
  denominations: Denomination[];
  newCurrencyDraft: NewCurrencyDraft | null;
  selectedBaseCurrency: CurrencyOption;
  settingsMessage: string;
  trickNumberInput: string;
  onAddNewCurrency: () => void;
  onBaseCurrencyChange: (currencyCode: CurrencyCode) => void;
  onCancelNewCurrencyDraft: () => void;
  onCurrencyRateInputChange: (currencyCode: CurrencyCode, value: string) => void;
  onEditDenominations: () => void;
  onNewCurrencyDraftChange: (updates: Partial<NewCurrencyDraft>) => void;
  onRemoveCustomCurrency: (currencyCode: CurrencyCode) => void;
  onResetSoftware: () => void;
  onSaveSettings: () => void;
  onSetDenominationAvailable: (denomination: Denomination, isAvailable: boolean) => void;
  onStartNewCurrencyDraft: () => void;
  onTrickNumberInputChange: (value: string) => void;
};

export function SettingsPage({
  activeDenominationCount,
  baseCurrencyCode,
  currencies,
  currencyRateInputs,
  denominationAvailability,
  denominations,
  newCurrencyDraft,
  selectedBaseCurrency,
  settingsMessage,
  trickNumberInput,
  onAddNewCurrency,
  onBaseCurrencyChange,
  onCancelNewCurrencyDraft,
  onCurrencyRateInputChange,
  onEditDenominations,
  onNewCurrencyDraftChange,
  onRemoveCustomCurrency,
  onResetSoftware,
  onSaveSettings,
  onSetDenominationAvailable,
  onStartNewCurrencyDraft,
  onTrickNumberInputChange,
}: SettingsPageProps) {
  const isSuccessMessage = /(saved|restored|reset)/i.test(settingsMessage);

  return (
    <>
      <header className="top-card">
        <div>
          <h1>Settings</h1>
          <p>Control the number that activates the twist rule.</p>
        </div>
      </header>

      <section className="settings-layout" aria-label="Settings">
        <section className="surface-card settings-panel">
          <div className="settings-section">
            <div>
              <h2>Twist Rule</h2>
              <p>
                When the owed amount in cents is divisible by this number, change is returned using
                random denominations.
              </p>
            </div>

            <label className="amount-field settings-field">
              <span>Trick Number</span>
              <div className="input-shell">
                <input
                  aria-label="Trick Number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  type="number"
                  value={trickNumberInput}
                  onChange={(event) => onTrickNumberInputChange(event.target.value)}
                />
              </div>
            </label>

            <div className="settings-divider" />

            <div>
              <h2>Currencies</h2>
              <p>
                Choose the base currency for owed amounts, denominations, and change results. The
                base currency equivalent is always 1.
              </p>
            </div>

            <label className="amount-field settings-field">
              <span>Base Currency</span>
              <div className="input-shell">
                <select
                  aria-label="Base Currency"
                  className="base-currency-select"
                  value={baseCurrencyCode}
                  onChange={(event) => onBaseCurrencyChange(event.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} · {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <div className="currency-settings-list">
              {currencies.map((currency) => (
                <div
                  className={`currency-setting-row${currency.custom ? ' currency-setting-row-custom' : ''}`}
                  key={currency.code}
                >
                  <span>
                    <strong>{currency.label}</strong>
                    <em>{currency.code} · {currency.symbol}</em>
                  </span>
                  <div className="input-shell rate-shell">
                    <input
                      aria-label={`${currency.code} ${selectedBaseCurrency.code} Equivalent`}
                      disabled={currency.code === baseCurrencyCode}
                      inputMode="decimal"
                      min="0.01"
                      step="any"
                      type="number"
                      value={currencyRateInputs[currency.code]}
                      onChange={(event) =>
                        onCurrencyRateInputChange(currency.code, event.target.value)
                      }
                    />
                    <span>{selectedBaseCurrency.code}</span>
                  </div>
                  {currency.custom ? (
                    <button
                      aria-label={`Remove ${currency.label}`}
                      className="view-button compact-view-button danger-button"
                      type="button"
                      onClick={() => onRemoveCustomCurrency(currency.code)}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              ))}

              {newCurrencyDraft ? (
                <div className="new-currency-form">
                  <input
                    aria-label="Currency code"
                    className="new-currency-input"
                    maxLength={4}
                    placeholder="Code (e.g. GBP)"
                    value={newCurrencyDraft.code}
                    onChange={(event) => onNewCurrencyDraftChange({ code: event.target.value })}
                  />
                  <input
                    aria-label="Currency label"
                    className="new-currency-input"
                    placeholder="Label (e.g. Pound)"
                    value={newCurrencyDraft.label}
                    onChange={(event) => onNewCurrencyDraftChange({ label: event.target.value })}
                  />
                  <input
                    aria-label="Currency symbol"
                    className="new-currency-input"
                    maxLength={4}
                    placeholder="Symbol (e.g. £)"
                    value={newCurrencyDraft.symbol}
                    onChange={(event) => onNewCurrencyDraftChange({ symbol: event.target.value })}
                  />
                  <div className="input-shell rate-shell">
                    <input
                      aria-label={`${selectedBaseCurrency.code} equivalent`}
                      inputMode="decimal"
                      min="0.01"
                      step="any"
                      type="number"
                      value={newCurrencyDraft.usdRate}
                      onChange={(event) => onNewCurrencyDraftChange({ usdRate: event.target.value })}
                    />
                    <span>{selectedBaseCurrency.code}</span>
                  </div>
                  <div className="new-currency-actions">
                    <button className="view-button" type="button" onClick={onAddNewCurrency}>
                      Add
                      <Plus size={15} aria-hidden="true" />
                    </button>
                    <button
                      className="view-button danger-button"
                      type="button"
                      onClick={onCancelNewCurrencyDraft}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button className="add-currency-button" type="button" onClick={onStartNewCurrencyDraft}>
                  <Plus size={15} aria-hidden="true" />
                  Add Currency
                </button>
              )}
            </div>

            <div className="settings-divider" />

            <div className="settings-currencies-row">
              <div>
                <h2>Denominations</h2>
                <p>
                  {activeDenominationCount} of {denominations.length} denomination
                  {denominations.length !== 1 ? 's' : ''} enabled for change calculations.
                </p>
              </div>
              <button className="view-button" type="button" onClick={onEditDenominations}>
                Edit Denominations
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="settings-denomination-list" aria-label="Settings denomination availability">
              {denominations.map((denomination) => {
                const isAvailable = denominationAvailability[denomination.cents] ?? true;

                return (
                  <label
                    className={`settings-denomination-toggle${isAvailable ? '' : ' unavailable'}`}
                    key={`${denomination.cents}-${denomination.singular}`}
                  >
                    <span className="settings-denomination-info">
                      <MoneyToken denomination={denomination} />
                      <span>
                        <strong>{denomination.plural}</strong>
                        <em>{formatDenominationValue(denomination.cents, selectedBaseCurrency)}</em>
                      </span>
                    </span>
                    <span className="availability-toggle compact-availability-toggle">
                      <input
                        aria-label={`${denomination.plural} enabled`}
                        checked={isAvailable}
                        type="checkbox"
                        onChange={(event) =>
                          onSetDenominationAvailable(denomination, event.target.checked)
                        }
                      />
                      <span>{isAvailable ? 'Enabled' : 'Disabled'}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            <button className="calculate-button settings-save-button" type="button" onClick={onSaveSettings}>
              <Settings size={20} aria-hidden="true" />
              Save Settings
            </button>

            {settingsMessage ? (
              <p className={`settings-message ${isSuccessMessage ? 'success' : 'error'}`}>
                {settingsMessage}
              </p>
            ) : null}

            <div className="settings-divider" />

            <div className="reset-software-section">
              <div>
                <h2>Reset Software</h2>
                <p>Clear local storage and restore currencies, denominations, settings, and history.</p>
              </div>
              <button
                className="view-button danger-button reset-software-button"
                type="button"
                onClick={onResetSoftware}
              >
                <Trash2 size={16} aria-hidden="true" />
                Reset Software
              </button>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
