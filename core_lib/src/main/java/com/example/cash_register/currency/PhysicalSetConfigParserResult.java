package com.example.cash_register.currency;

import com.example.cash_register.shared.exceptions.ExceptionList;
import com.example.cash_register.shared.guava.collect.MultimapUtils;
import com.google.common.base.Function;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multimaps;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.text.TextStringBuilder;

import java.util.Currency;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * This class contains the result of parsing a JSON file with the {@link PhysicalSetConfig} model; it is an intermediary
 * between the JSON file and the {@link PhysicalSetMap}. The {@link CurrencyModelMapper} has converters which can
 * convert a collection of these results into the {@link PhysicalSetMap} via its forwarding delegate.
 *
 * @see CurrencyModelMapper
 * @see PhysicalSetConfig
 * @see PhysicalSetMap
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Getter(AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
final class PhysicalSetConfigParserResult {
    /**
     * The list of data validation exceptions, if present; data validation exceptions mean that, while the JSON itself
     * parsed without error, the data within has exceptions which prevent proper usage. These can be referred to as
     * "secondary" exceptions.
     */
    private final List<Throwable> dataValidationExceptionList = new ExceptionList();
    /**
     * The physical set config which led to this result.
     *
     * @see PhysicalSetConfig
     */
    @Getter(AccessLevel.NONE)
    private PhysicalSetConfig physicalSetConfig = null;
    /**
     * The JSON parse exception, if present; this is populated when JSON itself could not be parsed into the {@link
     * PhysicalSetConfig}. This can be referred to as the "primary" exception.
     */
    private Throwable jsonParseException = null;

    /**
     * Creates a {@code PhysicalSetConfigParserResult} from a JSON parse exception.
     *
     * @param jsonParseException The JSON parse exception.
     *
     * @return The created {@code PhysicalSetConfigParserResult}.
     */
    static PhysicalSetConfigParserResult fromJsonParseException(Throwable jsonParseException) {
        PhysicalSetConfigParserResult result = new PhysicalSetConfigParserResult();
        result.jsonParseException = jsonParseException;
        return result;
    }

    /**
     * Creates a {@link PhysicalSetConfigParserResult} from a {@link PhysicalSetConfig}; performs data validation.
     *
     * @param physicalSetConfig The {@link PhysicalSetConfig} to use.
     *
     * @return The created {@link PhysicalSetConfigParserResult}.
     */
    static PhysicalSetConfigParserResult fromPhysicalSetConfig(PhysicalSetConfig physicalSetConfig) {
        PhysicalSetConfigParserResult result = new PhysicalSetConfigParserResult();
        result.physicalSetConfig = physicalSetConfig;
        result.doDataValidation();
        return result;
    }

    /**
     * Checks for JSON parse success.
     *
     * @return {@code true} when the JSON parse was successful; otherwise, {@code false}.
     */
    boolean isJsonParseSuccessful() {
        if (this.getJsonParseException() != null) {
            return false;
        }
        if (this.physicalSetConfig == null) {
            return false;
        }
        if (this.physicalSetConfig.getCurrency() == null) {
            return false;
        }
        //noinspection RedundantIfStatement
        if (this.physicalSetConfig.getCurrencyValues().isEmpty()) {
            return false;
        }

        return true;
    }

    /**
     * Checks for data validation success; note, if {@link #isJsonParseSuccessful()} is false, this check will
     * automatically fail with no further checks.
     *
     * @return {@code true} when the data validation is successful; otherwise, {@code false}.
     */
    boolean isDataValidationSuccessful() {
        if (! this.isJsonParseSuccessful()) {
            return false;
        }
        else {
            return this.getDataValidationExceptionList().isEmpty();
        }
    }

    /**
     * An {@link Optional<PhysicalSetConfig>} wrapper for the physical set config property of this object.
     *
     * @return An {@link Optional<PhysicalSetConfig>} which contains the physical set config of this object, if present.
     */
    private Optional<PhysicalSetConfig> findPhysicalSetConfig() {
        return Optional.ofNullable(this.physicalSetConfig);
    }

    /**
     * A wrapper for {@link #findPhysicalSetConfig()} which returns the physical set config of this object, if present,
     * or throws an exception if the physical set config is not present.
     *
     * @return The physical set config of this object.
     *
     * @throws QueryPhysicalSetConfigNotPresentException If {@link #findPhysicalSetConfig()} is empty.
     */
    PhysicalSetConfig queryPhysicalSetConfig() {
        final QueryPhysicalSetConfigNotPresentException exception = new QueryPhysicalSetConfigNotPresentException(
        );
        return this.findPhysicalSetConfig().orElseThrow(() -> exception);
    }

    /**
     * An {@link Optional<Currency>} wrapper for the currency property of this object.
     *
     * @return An {@link Optional<Currency>} which contains the currency of this object, if present.
     */
    private Optional<Currency> findCurrency() {
        if (this.findPhysicalSetConfig().isEmpty()) {
            return Optional.empty();
        }
        else {
            final PhysicalSetConfig placeholder = this.findPhysicalSetConfig().get();
            return Optional.ofNullable(placeholder.getCurrency());
        }
    }

    /**
     * A wrapper {@link #findCurrency()} which returns the currency of this object, if present, or throws an exception
     * if the currency is not present.
     *
     * @return The currency of this object.
     *
     * @throws QueryCurrencyNotPresentException If {@link #findCurrency()} is empty.
     */
    Currency queryCurrency() {
        final CashRegisterException exception = new QueryCurrencyNotPresentException();
        return this.findCurrency().orElseThrow(() -> exception);
    }

    /**
     * Checks for full validation success.
     *
     * @return The logical AND of {@link #isJsonParseSuccessful()} and {@link #isDataValidationSuccessful()}.
     */
    boolean isJsonParseAndDataValidationSuccessful() {
        return this.isJsonParseSuccessful() && this.isDataValidationSuccessful();
    }

    /**
     * Performs data validation; checks for duplicate unit values and non-positive unit values in the parsed {@link
     * PhysicalSetConfig}.
     *
     * @see #fromPhysicalSetConfig(PhysicalSetConfig)
     * @see #checkDuplicateUnitValues()
     * @see #checkAllUnitValuesMustBePositive()
     */
    void doDataValidation() {
        if (! this.isJsonParseSuccessful()) {
            return;
        }
        this.checkAllUnitValuesMustBePositive();
        this.checkDuplicateUnitValues();
    }

    /**
     * Checks the {@link PhysicalSetConfig} of this object to ensure all unit values are greater than zero; if any
     * non-positive unit values are found, a {@link AllUnitValuesMustBePositiveException} will be added to the {@link
     * #dataValidationExceptionList}.
     *
     * @see #dataValidationExceptionList
     */
    private void checkAllUnitValuesMustBePositive() {
        final List<UnitValueAndName> currencyValues = this.queryPhysicalSetConfig().getCurrencyValues();
        final List<UnitValueAndName> nonPositiveUnitValues = currencyValues
                .parallelStream()
                .filter(this::isUnitValueNonPositive)
                .collect(Collectors.toList());
        if (! nonPositiveUnitValues.isEmpty()) {
            final String message = new TextStringBuilder()
                    .appendln("all unit values must be positive")
                    .appendln(nonPositiveUnitValues)
                    .build();
            final Throwable throwable = new AllUnitValuesMustBePositiveException(message);
            this.dataValidationExceptionList.add(throwable);
        }
    }

    /**
     * Checks the {@link PhysicalSetConfig} of this object for duplicate unit values, which are not permitted for the
     * purposes of this project; if any duplicate unit values are found, a {@link DuplicateUnitValueException} will be
     * added to the {@link #dataValidationExceptionList}.
     *
     * @see #dataValidationExceptionList
     */
    private void checkDuplicateUnitValues() {
        final Multimap<UnitValue, UnitValueAndName> groupedByUnitValue = this.groupByUnitValue();
        final Multimap<UnitValue, UnitValueAndName> duplicateUnitValues = MultimapUtils.filterKeysWithMoreThanOneValue(groupedByUnitValue);
        if (! duplicateUnitValues.isEmpty()) {
            final String message = new TextStringBuilder()
                    .appendln("duplicate unit value(s) found")
                    .appendln(duplicateUnitValues)
                    .build();
            final Throwable throwable = new DuplicateUnitValueException(message);
            this.dataValidationExceptionList.add(throwable);
        }
    }

    /**
     * Helper method which groups the list of unit value and name objects for this object into a {@link Multimap} keyed
     * on the unit values for use in finding duplicate unit values (any duplicate unit value will have multiple values
     * in the multi-map).
     *
     * @return A {@link Multimap} keyed on unit values, mapping to unit value and name objects.
     *
     * @see Multimaps#index(Iterable, Function)
     */
    private Multimap<UnitValue, UnitValueAndName> groupByUnitValue() {
        final List<UnitValueAndName> unitValueAndNameList = this.queryPhysicalSetConfig().getCurrencyValues();
        final Multimap<UnitValue, UnitValueAndName> groupedByUnitValue =
                Multimaps.index(unitValueAndNameList, UnitValueAndName::getUnitValue);
        return groupedByUnitValue;
    }

    /**
     * Helper method which checks for non-positive {@link UnitValueAndName} objects.
     *
     * @param unitValueAndName The {@link UnitValueAndName} to check.
     *
     * @return {@code true} when the unit value is non-positive; otherwise, {@code false}.
     */
    private boolean isUnitValueNonPositive(final UnitValueAndName unitValueAndName) {
        return unitValueAndName.isNonPositive();
    }

    /**
     * See {@link #queryPhysicalSetConfig()}
     *
     * @see #queryPhysicalSetConfig()
     */
    static final class QueryPhysicalSetConfigNotPresentException extends CashRegisterException {
        QueryPhysicalSetConfigNotPresentException() {
            super("physical set config not present");
        }
    }

    /**
     * See {@link #queryCurrency()}
     *
     * @see #queryCurrency()
     */
    static final class QueryCurrencyNotPresentException extends CashRegisterException {
        QueryCurrencyNotPresentException() {
            super("currency not present");
        }
    }

    /**
     * See {@link #checkAllUnitValuesMustBePositive()}
     *
     * @see #checkAllUnitValuesMustBePositive()
     */
    static final class AllUnitValuesMustBePositiveException extends CashRegisterException {
        AllUnitValuesMustBePositiveException(String message) {
            super(message);
        }
    }

    /**
     * See {@link #checkDuplicateUnitValues()}
     *
     * @see #checkDuplicateUnitValues()
     */
    static final class DuplicateUnitValueException extends CashRegisterException {
        DuplicateUnitValueException(String message) {
            super(message);
        }
    }
}
