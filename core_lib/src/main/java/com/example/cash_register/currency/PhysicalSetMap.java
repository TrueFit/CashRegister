package com.example.cash_register.currency;

import com.example.cash_register.shared.exceptions.CompoundException;
import com.example.cash_register.shared.exceptions.ExceptionList;
import com.google.common.collect.ForwardingSortedSetMultimap;
import com.google.common.collect.Multimaps;
import com.google.common.collect.SortedSetMultimap;
import org.apache.commons.text.TextStringBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Currency;

/**
 * This class is ultimately responsible for reading, parsing, validating, and providing a {@link SortedSetMultimap}
 * (i.e., itself) containing the available physical currency sets for this project; this class will recursively find and
 * parse all JSON files in the resource directory {@code `/com/example/cash_register/currency/physical_sets/`} to
 * populate itself.  The results of this parsing are placed into this object and made available as a Spring component.
 * This class provides various {@code .checkRepresentation} methods which are used to verify that a currency or
 * currency value is representable with the physical currency sets available in this {@code PhysicalSetMap} object.
 */
@Component(PhysicalSetMap.QUALIFIER)
public class PhysicalSetMap extends ForwardingSortedSetMultimap<Currency, PhysicalCurrency> {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.cash_register.currency.PhysicalSetMap";
    /**
     * The delegate for the {@link ForwardingSortedSetMultimap}
     */
    private final SortedSetMultimap<Currency, PhysicalCurrency> delegate;

    /**
     * Autowired constructor.
     *
     * @param currencyModelMapper See {@link CurrencyModelMapper}.
     * @param physicalSetConfigParser See {@link PhysicalSetConfigParser}.
     */
    @Autowired
    private PhysicalSetMap(
            final CurrencyModelMapper currencyModelMapper,
            final PhysicalSetConfigParser physicalSetConfigParser) {
        final String locationPattern = "/com/example/cash_register/currency/physical_sets/**/*.json";
        final PhysicalSetConfigParserResultCollection parserResultCollection = physicalSetConfigParser.parseResources(locationPattern);
        final SortedSetMultimap<Currency, PhysicalCurrency> mappedParserResultCollection = currencyModelMapper.mapToSortedSetMultimap(parserResultCollection);
        this.delegate = Multimaps.unmodifiableSortedSetMultimap(mappedParserResultCollection);
    }

    /**
     * Implementation of delegate for Guava {@link ForwardingSortedSetMultimap#delegate()}
     *
     * @return The delegate.
     */
    @Override
    protected SortedSetMultimap<Currency, PhysicalCurrency> delegate() {
        return delegate;
    }

    /**
     * Checks the provided {@link CalculateChangeArgs} object to ensure it is representable with the available physical
     * currency sets.
     *
     * @param args The args to check.
     *
     * @throws CheckRepresentationNullCalculateChangeArgsException When args is null.
     * @throws CompoundException When either the owed or tendered value of the provided args are not representable with
     * the available physical currency sets.
     * @see CalculateChangeArgs
     * @see #checkRepresentation(CurrencyValue)
     */
    void checkRepresentation(final CalculateChangeArgs args) {
        if (args == null) {
            throw new CheckRepresentationNullCalculateChangeArgsException();
        }

        final ExceptionList exceptionList = new ExceptionList();
        try {
            this.checkRepresentation(args.getOwed());
        }
        catch (final Throwable throwable) {
            exceptionList.add(
                    new CheckRepresentationCalculateChangeArgsOwedException(throwable));
        }

        try {
            this.checkRepresentation(args.getTendered());
        }
        catch (final Throwable throwable) {
            exceptionList.add(
                    new CheckRepresentationCalculateChangeArgsTenderedException(throwable));
        }
        exceptionList.checkAndThrow();
    }

    /**
     * Checks the provided {@link CurrencyValue} object to ensure it is representable with the available physical
     * currency sets.
     *
     * @param currencyValue The currency value to check.
     *
     * @throws CheckRepresentationNullCurrencyValueException When currencyValue is null.
     * @throws CheckRepresentationCurrencyValueNonPositiveException When currencyValue is non-positive.
     * @throws CheckRepresentationCurrencyValueNotDivisibleBySmallestAvailablePhysicalCurrencyException When
     * currencyValue is not divisible by the smallest available physical currency.
     * @see CurrencyValue
     * @see #checkRepresentation(Currency)
     */
    void checkRepresentation(final CurrencyValue currencyValue) {
        if (currencyValue == null) {
            throw new CheckRepresentationNullCurrencyValueException();
        }

        final Currency currency = currencyValue.getCurrency();
        this.checkRepresentation(currency);

        final CurrencyValue ONE = CurrencyValue.getOne(currency);
        if (currencyValue.lessThan(ONE)) {
            final String message = "currency value must be positive";
            throw new CheckRepresentationCurrencyValueNonPositiveException();
        }

        PhysicalCurrency smallestAvailable = this.get(currency).last();
        if (! currencyValue.isDivisibleBy(smallestAvailable)) {
            final String message = new TextStringBuilder()
                    .append("provided currencyValue is not divisible by the smallest available physical currency ")
                    .appendln(" denomination.")
                    .append(" currency value                  => ").appendln(currencyValue)
                    .append(" smallest available denomination => ").appendln(smallestAvailable)
                    .build();
            throw new CheckRepresentationCurrencyValueNotDivisibleBySmallestAvailablePhysicalCurrencyException(message);
        }
    }

    /**
     * Checks the provided {@link Currency} object to ensure it is representable with the available physical currency
     * sets.
     *
     * @param currency The currency to check.
     *
     * @throws CheckRepresentationNullCurrencyException When currency is null.
     * @throws CheckRepresentationCurrencyKeyNotPresentException When currency is not present as a key in this map.
     */
    public void checkRepresentation(final Currency currency) {
        if (currency == null) {
            throw new CheckRepresentationNullCurrencyException();
        }

        if (! this.containsKey(currency)) {
            String message = new TextStringBuilder()
                    .append("currency is not present as a key for the map.  currency => ").appendln(currency)
                    .build();
            throw new CheckRepresentationCurrencyKeyNotPresentException(message);
        }
    }

    /**
     * Abstract base class for currency representation exception.
     */
    static abstract class CurrencyRepresentationException extends CashRegisterException {
        CurrencyRepresentationException(final String message) {
            super(message);
        }

        CurrencyRepresentationException(final String message, final Throwable cause) {
            super(message, cause);
        }
    }

    /**
     * See {@link #checkRepresentation(CurrencyValue)}
     *
     * @see #checkRepresentation(CurrencyValue)
     */
    static final class CheckRepresentationNullCurrencyValueException extends CurrencyRepresentationException {
        CheckRepresentationNullCurrencyValueException() {
            super("currencyValue must not be null");
        }
    }

    /**
     * See {@link #checkRepresentation(Currency)}
     *
     * @see #checkRepresentation(Currency)
     */
    static final class CheckRepresentationCurrencyKeyNotPresentException extends CurrencyRepresentationException {
        CheckRepresentationCurrencyKeyNotPresentException(final String message) {
            super(message);
        }
    }

    /**
     * See {@link #checkRepresentation(CurrencyValue)}
     *
     * @see #checkRepresentation(CurrencyValue)
     */
    static final class CheckRepresentationCurrencyValueNonPositiveException extends CurrencyRepresentationException {
        CheckRepresentationCurrencyValueNonPositiveException() {
            super("currency value must be positive");
        }
    }

    /**
     * See {@link #checkRepresentation(CurrencyValue)}
     *
     * @see #checkRepresentation(CurrencyValue)
     */
    static final class CheckRepresentationCurrencyValueNotDivisibleBySmallestAvailablePhysicalCurrencyException extends CurrencyRepresentationException {
        CheckRepresentationCurrencyValueNotDivisibleBySmallestAvailablePhysicalCurrencyException(final String message) {
            super(message);
        }
    }

    /**
     * See {@link #checkRepresentation(CalculateChangeArgs)}
     *
     * @see #checkRepresentation(CalculateChangeArgs)
     */
    static final class CheckRepresentationNullCalculateChangeArgsException extends CurrencyRepresentationException {
        CheckRepresentationNullCalculateChangeArgsException() {
            super("args must not be null");
        }
    }

    /**
     * See {@link #checkRepresentation(CalculateChangeArgs)}
     *
     * @see #checkRepresentation(CalculateChangeArgs)
     */
    static final class CheckRepresentationCalculateChangeArgsOwedException extends CurrencyRepresentationException {
        CheckRepresentationCalculateChangeArgsOwedException(final Throwable cause) {
            super("error with representation of owed value", cause);
        }
    }

    /**
     * See {@link #checkRepresentation(CalculateChangeArgs)}
     *
     * @see #checkRepresentation(CalculateChangeArgs)
     */
    static final class CheckRepresentationCalculateChangeArgsTenderedException extends CurrencyRepresentationException {
        CheckRepresentationCalculateChangeArgsTenderedException(final Throwable cause) {
            super("error with representation of tendered value", cause);
        }
    }

    /**
     * See {@link #checkRepresentation(Currency)}
     *
     * @see #checkRepresentation(Currency)
     */
    static final class CheckRepresentationNullCurrencyException extends CurrencyRepresentationException {
        CheckRepresentationNullCurrencyException() {
            super("currency must not be null");
        }
    }
}
