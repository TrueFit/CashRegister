package com.example.cash_register.currency;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Collection;
import java.util.Currency;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Utilities for summing currency values.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class CurrencySumUtils {
    /**
     * Sums a collection of currency value objects.
     *
     * @param currencyValueCollection The collection to sum.
     *
     * @return The sum of the collection.
     *
     * @throws SumCurrencyValueNullCollectionException When {@code currencyValueCollection} is null.
     * @throws SumCurrencyValueEmptyCollectionException When {@code currencyValueCollection} is empty.
     * @see CurrencyValue
     */
    public static CurrencyValue sumCurrencyValue(Collection<CurrencyValue> currencyValueCollection) {
        if (currencyValueCollection == null) {
            throw new SumCurrencyValueNullCollectionException();
        }
        if (currencyValueCollection.isEmpty()) {
            throw new SumCurrencyValueEmptyCollectionException();
        }

        final Currency currency = currencyValueCollection.iterator().next().getCurrency();
        checkSameCurrency(currency, currencyValueCollection);
        final CurrencyValue ZERO = CurrencyValue.getZero(currency);

        final CurrencyValue sum = currencyValueCollection
                .parallelStream()
                .reduce(ZERO, CurrencySumUtils::add);
        return sum;
    }

    /**
     * Helper method used to check that every currency value in the collection is the same currency; this must be true
     * in order to sum the collection.
     *
     * @param currency The currency; all elements in the collection must be this currency.
     * @param currencyValueCollection The collection of currency values to check.
     *
     * @throws CollectionElementsCurrencyMismatchException When at least one value in the collection does not match
     * {@code currency}.
     */
    private static void checkSameCurrency(Currency currency, Collection<CurrencyValue> currencyValueCollection) {
        Optional<Currency> currencyDoesNotMatch = currencyValueCollection
                .parallelStream()
                .map(CurrencyValue::getCurrency)
                .filter(innerCurrency -> ! currency.equals(innerCurrency))
                .findAny();
        if (currencyDoesNotMatch.isPresent()) {
            throw new CollectionElementsCurrencyMismatchException();
        }
    }

    /**
     * Sums a collection of physical currency objects.
     *
     * @param physicalCurrencyCollection The collection to sum.
     *
     * @return The sum of the collection.
     *
     * @throws SumPhysicalCurrencyNullCollectionException When {@code physicalCurrencyCollection} is null.
     * @throws SumPhysicalCurrencyEmptyCollectionException When {@code physicalCurrencyCollection} is empty.
     * @see CurrencyValue
     * @see PhysicalCurrency
     */
    public static CurrencyValue sumPhysicalCurrency(Collection<PhysicalCurrency> physicalCurrencyCollection) {
        if (physicalCurrencyCollection == null) {
            throw new SumPhysicalCurrencyNullCollectionException();
        }
        if (physicalCurrencyCollection.isEmpty()) {
            throw new SumPhysicalCurrencyEmptyCollectionException();
        }
        List<CurrencyValue> currencyValues = physicalCurrencyCollection
                .parallelStream()
                .map(PhysicalCurrency::getCurrencyValue)
                .collect(Collectors.toList());
        return sumCurrencyValue(currencyValues);
    }

    /**
     * Helper method which adds two currency values.
     *
     * @param left The left addend.
     * @param right The right addend.
     *
     * @return The sum of {@code left} and {@code right}
     */
    private static CurrencyValue add(CurrencyValue left, CurrencyValue right) {
        return left.add(right);
    }

    /**
     * See {@link #checkSameCurrency(Currency, Collection)}
     *
     * @see #checkSameCurrency(Currency, Collection)
     */
    public static final class CollectionElementsCurrencyMismatchException extends CashRegisterException {
        CollectionElementsCurrencyMismatchException() {
            super("all elements in the collection must be of the same Currency");
        }
    }

    /**
     * See {@link #sumCurrencyValue(Collection)}
     *
     * @see #sumCurrencyValue(Collection)
     */
    public static final class SumCurrencyValueNullCollectionException extends CashRegisterException {
        SumCurrencyValueNullCollectionException() {
            super("currency value collection must not be null");
        }
    }

    /**
     * See {@link #sumPhysicalCurrency(Collection)}
     *
     * @see #sumPhysicalCurrency(Collection)
     */
    public static final class SumPhysicalCurrencyEmptyCollectionException extends CashRegisterException {
        SumPhysicalCurrencyEmptyCollectionException() {
            super("physical currency collection must not be empty");
        }
    }

    /**
     * See {@link #sumPhysicalCurrency(Collection)}
     *
     * @see #sumPhysicalCurrency(Collection)
     */
    public static final class SumPhysicalCurrencyNullCollectionException extends CashRegisterException {
        SumPhysicalCurrencyNullCollectionException() {
            super("physical currency collection must not be null");
        }
    }

    /**
     * See {@link #sumCurrencyValue(Collection)}
     *
     * @see #sumCurrencyValue(Collection)
     */
    public static final class SumCurrencyValueEmptyCollectionException extends CashRegisterException {
        SumCurrencyValueEmptyCollectionException() {
            super("currency value collection must not be empty");
        }
    }
}
