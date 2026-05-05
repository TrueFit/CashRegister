import { Plus, RotateCcw, Settings, Trash2 } from 'lucide-react';
import { MoneyToken } from '../components/MoneyToken';
import type { Denomination, DenominationVisualKind } from '../domain/currency';
import type { DenominationAvailability, DenominationDraft } from '../domain/denominations';
import { getDraftDisplayName, parseDraftCents, previewDenominationFromDraft } from '../domain/denominations';

type DenominationsPageProps = {
  denominationAvailability: DenominationAvailability;
  denominationDrafts: DenominationDraft[];
  settingsMessage: string;
  onAddDenominationDraft: () => void;
  onRemoveDenominationDraft: (index: number) => void;
  onResetDenominationsToDefault: () => void;
  onResetDenominationsToEuro: () => void;
  onSaveDenominations: () => void;
  onSetDenominationAvailable: (denomination: Denomination, isAvailable: boolean) => void;
  onUpdateDenominationDraft: (index: number, updates: Partial<DenominationDraft>) => void;
};

export function DenominationsPage({
  denominationAvailability,
  denominationDrafts,
  settingsMessage,
  onAddDenominationDraft,
  onRemoveDenominationDraft,
  onResetDenominationsToDefault,
  onResetDenominationsToEuro,
  onSaveDenominations,
  onSetDenominationAvailable,
  onUpdateDenominationDraft,
}: DenominationsPageProps) {
  const isSuccessMessage = /(saved|restored|reset)/i.test(settingsMessage);

  return (
    <>
      <header className="top-card">
        <div>
          <h1>Edit Denominations</h1>
          <p>US denominations load by default. Use a preset or save edits for new change calculations.</p>
        </div>
      </header>

      <section className="denominations-page-layout" aria-label="Edit Denominations">
        <section className="surface-card settings-panel denominations-panel">
          <div className="settings-section">
            <div className="denominations-toolbar">
              <button className="view-button" type="button" onClick={onAddDenominationDraft}>
                Add
                <Plus size={16} aria-hidden="true" />
              </button>
              <button className="view-button" type="button" onClick={onResetDenominationsToDefault}>
                Reset US Defaults
                <RotateCcw size={16} aria-hidden="true" />
              </button>
              <button className="view-button" type="button" onClick={onResetDenominationsToEuro}>
                Reset Euro Defaults
                <RotateCcw size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="denomination-settings-list">
              {denominationDrafts.map((draft, index) => {
                const cents = parseDraftCents(draft.cents);
                const previewDenomination = previewDenominationFromDraft(draft);
                const displayName = getDraftDisplayName(draft);
                const isAvailable = cents === null ? true : denominationAvailability[cents] ?? true;

                return (
                  <div className="denomination-card" key={index}>
                    <div className="denomination-card-main">
                      <div className="denomination-preview">
                        <MoneyToken denomination={previewDenomination} />
                      </div>

                      <div className="denomination-fields-grid">
                        <label className="setting-mini-field">
                          <span>Singular</span>
                          <input
                            aria-label={`Denomination ${index + 1} singular name`}
                            value={draft.singular}
                            onChange={(event) =>
                              onUpdateDenominationDraft(index, { singular: event.target.value })
                            }
                          />
                        </label>
                        <label className="setting-mini-field">
                          <span>Plural</span>
                          <input
                            aria-label={`Denomination ${index + 1} plural name`}
                            value={draft.plural}
                            onChange={(event) =>
                              onUpdateDenominationDraft(index, { plural: event.target.value })
                            }
                          />
                        </label>
                        <label className="setting-mini-field">
                          <span>Cents</span>
                          <input
                            aria-label={`Denomination ${index + 1} value in cents`}
                            inputMode="numeric"
                            min="1"
                            step="1"
                            type="number"
                            value={draft.cents}
                            onChange={(event) =>
                              onUpdateDenominationDraft(index, { cents: event.target.value })
                            }
                          />
                        </label>
                      </div>

                      <div className="denomination-card-actions">
                        <label className="availability-toggle">
                          <input
                            aria-label={`${displayName} available`}
                            checked={isAvailable}
                            disabled={cents === null}
                            type="checkbox"
                            onChange={(event) =>
                              onSetDenominationAvailable(previewDenomination, event.target.checked)
                            }
                          />
                          <span>Available</span>
                        </label>
                        <button
                          aria-label={`Remove ${displayName}`}
                          className="view-button compact-view-button danger-button"
                          disabled={denominationDrafts.length === 1}
                          type="button"
                          onClick={() => onRemoveDenominationDraft(index)}
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="denomination-visual-grid">
                      <label className="setting-mini-field">
                        <span>Shape</span>
                        <select
                          aria-label={`${displayName} token shape`}
                          value={draft.visualKind}
                          onChange={(event) =>
                            onUpdateDenominationDraft(index, {
                              visualKind: event.target.value as DenominationVisualKind,
                            })
                          }
                        >
                          <option value="bill">Bill</option>
                          <option value="coin">Coin</option>
                        </select>
                      </label>
                      <label className="setting-mini-field">
                        <span>Mark</span>
                        <input
                          aria-label={`${displayName} token label`}
                          maxLength={6}
                          value={draft.visualLabel}
                          onChange={(event) =>
                            onUpdateDenominationDraft(index, { visualLabel: event.target.value })
                          }
                        />
                      </label>
                      <label className="setting-mini-field color-field">
                        <span>Primary</span>
                        <input
                          aria-label={`${displayName} primary color`}
                          type="color"
                          value={draft.primaryColor}
                          onChange={(event) =>
                            onUpdateDenominationDraft(index, { primaryColor: event.target.value })
                          }
                        />
                      </label>
                      <label className="setting-mini-field color-field">
                        <span>Secondary</span>
                        <input
                          aria-label={`${displayName} secondary color`}
                          type="color"
                          value={draft.secondaryColor}
                          onChange={(event) =>
                            onUpdateDenominationDraft(index, { secondaryColor: event.target.value })
                          }
                        />
                      </label>
                      <label className="setting-mini-field color-field">
                        <span>Accent</span>
                        <input
                          aria-label={`${displayName} accent color`}
                          type="color"
                          value={draft.accentColor}
                          onChange={(event) =>
                            onUpdateDenominationDraft(index, { accentColor: event.target.value })
                          }
                        />
                      </label>
                      <label className="setting-mini-field color-field">
                        <span>Text</span>
                        <input
                          aria-label={`${displayName} text color`}
                          type="color"
                          value={draft.textColor}
                          onChange={(event) =>
                            onUpdateDenominationDraft(index, { textColor: event.target.value })
                          }
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="calculate-button settings-save-button"
              type="button"
              onClick={onSaveDenominations}
            >
              <Settings size={20} aria-hidden="true" />
              Save Denominations
            </button>

            {settingsMessage ? (
              <p className={`settings-message ${isSuccessMessage ? 'success' : 'error'}`}>
                {settingsMessage}
              </p>
            ) : null}
          </div>
        </section>
      </section>
    </>
  );
}
