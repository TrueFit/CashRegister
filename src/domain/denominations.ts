import {
  Denomination,
  DenominationVisual,
  DenominationVisualKind,
  EURO_DENOMINATIONS,
  US_DENOMINATIONS,
} from './currency';
import { CurrencyOption, DEFAULT_CURRENCIES, formatDenominationValue } from './currencies';

export type DenominationAvailability = Record<number, boolean>;

export type DenominationDraft = {
  singular: string;
  plural: string;
  cents: string;
  visualKind: DenominationVisualKind;
  visualLabel: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
};

const defaultBillVisual: DenominationVisual = {
  kind: 'bill',
  label: '1',
  primaryColor: '#66d395',
  secondaryColor: '#2aa869',
  accentColor: '#bee9cf',
  textColor: '#0c663c',
};

const defaultCoinVisual: DenominationVisual = {
  kind: 'coin',
  label: '1c',
  primaryColor: '#868b95',
  secondaryColor: '#d7dbe1',
  accentColor: '#f7f8fb',
  textColor: '#626976',
};

function formatTokenLabel(cents: number, kind: DenominationVisualKind): string {
  return kind === 'bill' ? `${cents / 100}` : `${cents}c`;
}

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}

function isDenominationVisualKind(value: unknown): value is DenominationVisualKind {
  return value === 'bill' || value === 'coin';
}

export function getDefaultVisual(cents: number, kind?: DenominationVisualKind): DenominationVisual {
  const visualKind = kind ?? (cents >= 100 ? 'bill' : 'coin');
  const base = visualKind === 'bill' ? defaultBillVisual : defaultCoinVisual;

  return {
    ...base,
    kind: visualKind,
    label: formatTokenLabel(cents, visualKind),
  };
}

export function getDenominationVisual(denomination: Denomination): DenominationVisual {
  const visualKind = isDenominationVisualKind(denomination.visual?.kind)
    ? denomination.visual.kind
    : undefined;
  const fallback = getDefaultVisual(denomination.cents, visualKind);
  const visualLabel = denomination.visual?.label?.trim();

  return {
    kind: fallback.kind,
    label: visualLabel ? visualLabel.slice(0, 6) : fallback.label,
    primaryColor: isHexColor(denomination.visual?.primaryColor)
      ? denomination.visual.primaryColor
      : fallback.primaryColor,
    secondaryColor: isHexColor(denomination.visual?.secondaryColor)
      ? denomination.visual.secondaryColor
      : fallback.secondaryColor,
    accentColor: isHexColor(denomination.visual?.accentColor)
      ? denomination.visual.accentColor
      : fallback.accentColor,
    textColor: isHexColor(denomination.visual?.textColor)
      ? denomination.visual.textColor
      : fallback.textColor,
  };
}

export function normalizeDenomination(denomination: Denomination): Denomination {
  const cents = Math.trunc(denomination.cents);
  const singular = denomination.singular.trim() || 'custom denomination';
  const plural = denomination.plural.trim() || `${singular}s`;
  const normalized = {
    singular,
    plural,
    cents,
    visual: denomination.visual,
  };

  return {
    ...normalized,
    visual: getDenominationVisual(normalized),
  };
}

export function sortDenominations(denominations: Denomination[]): Denomination[] {
  return [...denominations].sort(
    (first, second) => second.cents - first.cents || first.singular.localeCompare(second.singular),
  );
}

export function getDefaultDenominations(): Denomination[] {
  return sortDenominations(US_DENOMINATIONS.map(normalizeDenomination));
}

export function getEuroDenominations(): Denomination[] {
  return sortDenominations(EURO_DENOMINATIONS.map(normalizeDenomination));
}

export function isStoredDenomination(value: unknown): value is Denomination {
  if (!value || typeof value !== 'object') return false;

  const denomination = value as Partial<Denomination>;
  return (
    typeof denomination.singular === 'string' &&
    typeof denomination.plural === 'string' &&
    typeof denomination.cents === 'number' &&
    Number.isInteger(denomination.cents) &&
    denomination.cents > 0
  );
}

export function parseStoredDenominations(value: unknown): Denomination[] {
  const savedDenominations = Array.isArray(value) ? value : [];
  const usedValues = new Set<number>();
  const denominations = savedDenominations
    .filter(isStoredDenomination)
    .map(normalizeDenomination)
    .filter((denomination) => {
      if (usedValues.has(denomination.cents)) return false;
      usedValues.add(denomination.cents);
      return true;
    });

  return denominations.length > 0 ? sortDenominations(denominations) : getDefaultDenominations();
}

export function createDenominationDraft(denomination: Denomination): DenominationDraft {
  const visual = getDenominationVisual(denomination);

  return {
    singular: denomination.singular,
    plural: denomination.plural,
    cents: String(denomination.cents),
    visualKind: visual.kind,
    visualLabel: visual.label,
    primaryColor: visual.primaryColor,
    secondaryColor: visual.secondaryColor,
    accentColor: visual.accentColor,
    textColor: visual.textColor,
  };
}

export function createDenominationDrafts(denominations: Denomination[]): DenominationDraft[] {
  return denominations.map(createDenominationDraft);
}

export function parseDraftCents(value: string): number | null {
  const cents = Number(value);
  return Number.isInteger(cents) && cents > 0 ? cents : null;
}

export function getDraftDisplayName(draft: DenominationDraft): string {
  return draft.plural.trim() || draft.singular.trim() || 'denomination';
}

export function previewDenominationFromDraft(draft: DenominationDraft): Denomination {
  const cents = parseDraftCents(draft.cents) ?? 1;

  return normalizeDenomination({
    singular: draft.singular || 'custom denomination',
    plural: draft.plural || 'custom denominations',
    cents,
    visual: {
      kind: draft.visualKind,
      label: draft.visualLabel,
      primaryColor: draft.primaryColor,
      secondaryColor: draft.secondaryColor,
      accentColor: draft.accentColor,
      textColor: draft.textColor,
    },
  });
}

export function findNextDraftCentValue(drafts: DenominationDraft[]): number {
  const usedValues = new Set(
    drafts.map((draft) => parseDraftCents(draft.cents)).filter((value): value is number => value !== null),
  );
  let nextValue = 1;

  while (usedValues.has(nextValue)) {
    nextValue += 1;
  }

  return nextValue;
}

export function parseDenominationDrafts(
  drafts: DenominationDraft[],
  currency: Pick<CurrencyOption, 'symbol'> = DEFAULT_CURRENCIES[0],
): Denomination[] {
  if (drafts.length === 0) {
    throw new Error('Add at least one denomination.');
  }

  const usedValues = new Set<number>();
  const denominations = drafts.map((draft) => {
    const singular = draft.singular.trim();
    const plural = draft.plural.trim();
    const cents = parseDraftCents(draft.cents);

    if (!singular || !plural) {
      throw new Error('Enter singular and plural names for each denomination.');
    }

    if (cents === null) {
      throw new Error('Enter denomination values as whole cents greater than 0.');
    }

    if (usedValues.has(cents)) {
      throw new Error(
        `${formatDenominationValue(cents, currency)} is duplicated. Denomination values must be unique.`,
      );
    }

    usedValues.add(cents);

    return normalizeDenomination({
      singular,
      plural,
      cents,
      visual: {
        kind: draft.visualKind,
        label: draft.visualLabel,
        primaryColor: draft.primaryColor,
        secondaryColor: draft.secondaryColor,
        accentColor: draft.accentColor,
        textColor: draft.textColor,
      },
    });
  });

  return sortDenominations(denominations);
}

export function createDefaultDenominationAvailability(
  denominations: Denomination[],
): DenominationAvailability {
  return denominations.reduce(
    (availability, denomination) => ({
      ...availability,
      [denomination.cents]: true,
    }),
    {} as DenominationAvailability,
  );
}

export function createDenominationAvailability(
  denominations: Denomination[],
  value: unknown,
): DenominationAvailability {
  const savedAvailability =
    value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

  return denominations.reduce((availability, denomination) => {
    const savedValue = savedAvailability[String(denomination.cents)];

    return {
      ...availability,
      [denomination.cents]: typeof savedValue === 'boolean' ? savedValue : true,
    };
  }, {} as DenominationAvailability);
}
