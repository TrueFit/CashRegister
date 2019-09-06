package com.example.cash_register.currency;

import com.example.cash_register.shared.exceptions.CompoundException;
import com.example.cash_register.shared.exceptions.ExceptionList;
import com.example.cash_register.shared.guava.collect.MultimapUtils;
import com.example.cash_register.shared.spring.SpringContextUtils;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multimaps;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.commons.collections4.collection.AbstractCollectionDecorator;
import org.apache.commons.text.TextStringBuilder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Currency;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

/**
 * A special collection of {@link PhysicalSetConfigParserResult} containing several helper and validation methods.
 */
class PhysicalSetConfigParserResultCollection extends AbstractCollectionDecorator<PhysicalSetConfigParserResult> {
    /**
     * A collection of results within this collection which have JSON parsed successfully.
     *
     * @see PhysicalSetConfigParserResult#isJsonParseSuccessful()
     */
    @Getter(AccessLevel.PACKAGE)
    private final Collection<PhysicalSetConfigParserResult> jsonParseSuccessCollection;
    /**
     * The decorated delegate for this collection.
     */
    private final Collection<PhysicalSetConfigParserResult> decorated = new ArrayList<>();
    /**
     * An unmodifiable delegate for this collection.
     */
    private final Collection<PhysicalSetConfigParserResult> decoratedUnmodifiable = Collections.unmodifiableCollection(decorated);
    /**
     * An {@link AtomicBoolean} used to ensure that validation is run only once.
     */
    @Getter(AccessLevel.PACKAGE)
    private final AtomicBoolean isValidationComplete = new AtomicBoolean(false);

    /**
     * Creates a {@link PhysicalSetConfigParserResultCollection} from the provided collection of {@link
     * PhysicalSetConfigParserResult} objects.
     *
     * @param collection The objects to populate to this collection.
     */
    PhysicalSetConfigParserResultCollection(Collection<PhysicalSetConfigParserResult> collection) {
        super();
        this.decorated.addAll(collection);
        this.jsonParseSuccessCollection = this.decorated
                .parallelStream()
                .filter(PhysicalSetConfigParserResult::isJsonParseSuccessful)
                .collect(Collectors.toUnmodifiableList());
    }

    /**
     * Collects the JSON parse and data validation exceptions from the result objects in this collection.
     *
     * @return A collection of {@link Throwable} objects from all the JSON parse and data validations exception from the
     * result objects in this collection.
     */
    private Collection<Throwable> collectValidationExceptions() {
        this.doValidate();
        List<Throwable> primaryValidationExceptions = this.decorated
                .parallelStream()
                .map(PhysicalSetConfigParserResult::getJsonParseException)
                .filter(Objects::nonNull)
                .collect(Collectors.toUnmodifiableList());
        List<Throwable> secondaryValidationExceptions = this.decorated
                .parallelStream()
                .map(PhysicalSetConfigParserResult::getDataValidationExceptionList)
                .flatMap(Collection::parallelStream)
                .collect(Collectors.toUnmodifiableList());

        ExceptionList exceptionList = new ExceptionList();
        exceptionList.addAll(primaryValidationExceptions);
        exceptionList.addAll(secondaryValidationExceptions);
        return exceptionList;
    }

    /**
     * Checks for JSON parse and data validation success for all result objects in this collection.
     *
     * @return {@code true} when all results in this collection return true for {@link
     * PhysicalSetConfigParserResult#isJsonParseAndDataValidationSuccessful()}; otherwise, {@code false}.
     */
    @SuppressWarnings("BooleanMethodIsAlwaysInverted")
    private boolean isJsonParseAndDataValidationSuccessful() {
        this.doValidate();
        return this.parallelStream()
                .allMatch(PhysicalSetConfigParserResult::isJsonParseAndDataValidationSuccessful);
    }

    /**
     * Negates {@link #isJsonParseAndDataValidationSuccessful()}.
     *
     * @return Not {@link #isJsonParseAndDataValidationSuccessful()}.
     */
    private boolean isNotJsonParseAndDataValidationSuccessful() {
        return ! this.isJsonParseAndDataValidationSuccessful();
    }

    /**
     * Performs validation on this collection.
     *
     * @see Validator#validate(PhysicalSetConfigParserResultCollection)
     */
    private void doValidate() {
        Validator validator = SpringContextUtils.getBean(Validator.class);
        validator.validate(this);
    }

    /**
     * The decorated delegate for this collection.
     *
     * @return The decorated delegate for this collection.
     *
     * @see AbstractCollectionDecorator#decorated()
     */
    @Override
    protected Collection<PhysicalSetConfigParserResult> decorated() {
        return this.decoratedUnmodifiable;
    }

    /**
     * Validates a {@link PhysicalSetConfigParserResultCollection}.
     */
    @Component(Validator.QUALIFIER)
    static class Validator {
        /**
         * Spring qualifier.
         */
        static final String QUALIFIER = "com.example.cash_register.currency.PhysicalSetConfigParserResultCollection.Validator";

        /**
         * Validates the provided collection.
         *
         * @param parserResultsCollection The collection to validate.
         *
         * @throws CompoundException When validation is not successful; this exception will then contain every JSON
         * parse and data validation exception found within the results of the collection.
         * @throws DuplicateCurrencyException Indirectly, when {@link #checkDuplicateCurrency(PhysicalSetConfigParserResultCollection)}
         * throws an exception.
         * @see #checkDuplicateCurrency(PhysicalSetConfigParserResultCollection)
         */
        void validate(final PhysicalSetConfigParserResultCollection parserResultsCollection) {
            if (parserResultsCollection.getIsValidationComplete().compareAndSet(false, true)) {
                this.checkDuplicateCurrency(parserResultsCollection);
                if (parserResultsCollection.isNotJsonParseAndDataValidationSuccessful()) {
                    final Collection<Throwable> exceptionCollection = parserResultsCollection.collectValidationExceptions();
                    throw new CompoundException(exceptionCollection);
                }
            }
        }

        /**
         * Checks for duplicate currencies among the results in the provided collection.
         *
         * @param parserResultsCollection The collection to check.
         *
         * @throws DuplicateCurrencyException When duplicate currencies are found.
         * @see #filterDuplicateCurrency(PhysicalSetConfigParserResultCollection)
         * @see #groupByCurrency(PhysicalSetConfigParserResultCollection)
         */
        private void checkDuplicateCurrency(final PhysicalSetConfigParserResultCollection parserResultsCollection) {
            final Multimap<Currency, PhysicalSetConfigParserResult> duplicateCurrency = this.filterDuplicateCurrency(parserResultsCollection);
            if (! duplicateCurrency.isEmpty()) {
                final String message = new TextStringBuilder()
                        .appendln("a duplicate currency entry was found in the parsed results")
                        .appendln("duplicate currency map => ")
                        .appendln(duplicateCurrency)
                        .build();
                throw new DuplicateCurrencyException(message);
            }
        }

        /**
         * Groups the (JSON parse successful) results of this collection keyed on currency, then filters any currency
         * keys with more than one value, and returns the result. In practice this means that, if the returned multi-map
         * is not empty, there exist duplicate currencies among the results.
         *
         * @param parserResultsCollection The collection to check and filter.
         *
         * @return The checked and filtered multi-map; if the multi-map is not empty, then duplicate currencies exist
         * among the results of the provided collection.
         *
         * @see #groupByCurrency(PhysicalSetConfigParserResultCollection)
         */
        private Multimap<Currency, PhysicalSetConfigParserResult> filterDuplicateCurrency(final PhysicalSetConfigParserResultCollection parserResultsCollection) {
            final Multimap<Currency, PhysicalSetConfigParserResult> groupedByCurrency = this.groupByCurrency(parserResultsCollection);
            return MultimapUtils.filterKeysWithMoreThanOneValue(groupedByCurrency);
        }

        /**
         * Using the JSON parse success collection for the provided collection (because failures will not have
         * associated currencies), group by currency and return the result.
         *
         * @param parserResultsCollection The collection to check.
         *
         * @return A multi-map of JSON parse success results, grouped by currency, used by {@link
         * #filterDuplicateCurrency(PhysicalSetConfigParserResultCollection)}.
         *
         * @see #filterDuplicateCurrency(PhysicalSetConfigParserResultCollection)
         */
        private Multimap<Currency, PhysicalSetConfigParserResult> groupByCurrency(final PhysicalSetConfigParserResultCollection parserResultsCollection) {
            return Multimaps.index(
                    parserResultsCollection.getJsonParseSuccessCollection(),
                    PhysicalSetConfigParserResult::queryCurrency);
        }

        /**
         * See {@link #checkDuplicateCurrency(PhysicalSetConfigParserResultCollection)}
         *
         * @see #checkDuplicateCurrency(PhysicalSetConfigParserResultCollection)
         */
        final static class DuplicateCurrencyException extends CashRegisterException {
            DuplicateCurrencyException(final String message) {
                super(message);
            }
        }
    }
}
