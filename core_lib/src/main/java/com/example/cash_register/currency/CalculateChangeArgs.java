package com.example.cash_register.currency;

import com.example.cash_register.shared.exceptions.CompoundException;
import com.example.cash_register.shared.exceptions.ExceptionList;
import com.example.cash_register.shared.mappers.ObjectMapperConfig;
import com.example.cash_register.shared.resources.ResourceUtils;
import com.example.cash_register.shared.spring.SpringContextUtils;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.modelmapper.AbstractConverter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.Collections;
import java.util.Currency;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

/**
 * Contains the arguments needed for calculating change.
 */
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class CalculateChangeArgs {
    /**
     * The currency value that is owed.
     */
    @NonNull
    private final CurrencyValue owed;
    /**
     * The currency value that is tendered.
     */
    @NonNull
    private final CurrencyValue tendered;

    /**
     * A list of exceptions associated with these calculate change args; these will usually be validation exceptions. If
     * this collection is non-empty, these calculate change args will be considered invalid for the purpose of
     * calculating results.
     */
    @Getter(AccessLevel.NONE)
    private final List<Throwable> inputArgsExceptionListInternal = new ExceptionList();
    /**
     * An atomic boolean used so that validation is run only once.
     */
    @Getter(AccessLevel.PACKAGE)
    @Setter(AccessLevel.NONE)
    private final AtomicBoolean isValidationComplete = new AtomicBoolean(false);

    /**
     * An unmodifiable view into the list of exceptions associated with these calculate change args.
     *
     * @see #inputArgsExceptionListInternal
     */
    @Getter(AccessLevel.PACKAGE)
    private final List<Throwable> inputArgsExceptionList = Collections.unmodifiableList(this.inputArgsExceptionListInternal);

    /**
     * Creates an intentionally invalid calculate change args object; specifically, a calculate change args with owed
     * and tendered currency values of {@link CurrencyValue#INVALID} and a {@link IntentionallyInvalidArgsException}
     * pre-populated in the exception collection of the args.
     * <p>
     * This method is intended for use by calculate change args parsers which require the ability to represent args
     * which could not be parsed; additional exceptions which help describe any issues can be added via the {@link
     * #addInputArgsException(Throwable)} method. An {@link IntentionallyInvalidArgsException} will always be present
     * and first in the {@link #inputArgsExceptionList} list.
     *
     * @return An intentionally invalid calculate change args object.
     *
     * @see CurrencyValue#INVALID
     * @see IntentionallyInvalidArgsException
     */
    public static CalculateChangeArgs createIntentionallyInvalidArgs() {
        final CalculateChangeArgs args = CalculateChangeArgs.builder()
                .owed(CurrencyValue.INVALID)
                .tendered(CurrencyValue.INVALID)
                .build();
        args.addInputArgsException(new IntentionallyInvalidArgsException());
        args.getIsValidationComplete().set(true);
        return args;
    }

    public final void addInputArgsException(Throwable throwable) {
        this.inputArgsExceptionListInternal.add(throwable);
    }

    /**
     * A flag for validity of these arguments; these arguments are valid if, after validation, no exceptions exist in
     * the exception collection.
     *
     * @return {@code true}, if these arguments are valid.  Otherwise, returns {@code false}.
     *
     * @see #inputArgsExceptionList
     */
    final boolean isValid() {
        final Validator validator = SpringContextUtils.getBean(Validator.class);
        validator.validate(this);
        return this.getInputArgsExceptionList().isEmpty();
    }

    /**
     * Used by Jackson to parse the JSON input model of calculate change args.
     */
    @Getter(AccessLevel.PACKAGE)
    @Setter(AccessLevel.PACKAGE)
    @JsonPropertyOrder({"currency", "inputLocale", "owedAndTenderedList"})
    static final class InputModel {
        /**
         * The currency for the calculate change args.
         */
        @JsonProperty
        private Currency currency;
        /**
         * The input locale used to parse the owed and tendered values for the calculate change args.
         */
        @JsonProperty
        private Locale inputLocale;
        /**
         * The list of owed and tendered values, which will be mapped to a list of calculate change args.
         *
         * @see OwedAndTendered
         */
        @JsonProperty
        private List<OwedAndTendered> owedAndTenderedList;

        /**
         * Represents an owed and tendered pair for the input model.
         *
         * @see InputModel
         */
        @Getter(AccessLevel.PACKAGE)
        @Setter(AccessLevel.PACKAGE)
        @JsonPropertyOrder({"owed", "tendered"})
        static class OwedAndTendered {
            /**
             * The owed value.
             */
            @JsonProperty
            private String owed;
            /**
             * The tendered value.
             */
            @JsonProperty
            private String tendered;
        }
    }

    /**
     * An {@code InputStreamParserBase} subclass which parses the input model.
     *
     * @see InputStreamParserBase
     * @see InputParserBase
     */
    @SuppressWarnings("UnnecessaryLocalVariable")
    @Component(InputModelParser.QUALIFIER)
    public static final class InputModelParser extends InputStreamParserBase {
        /**
         * Spring qualifier.
         */
        public static final String QUALIFIER = "com.example.cash_register.currency.CalculateChangeArgs.InputModelParser";
        /**
         * See {@link ResourceUtils}.
         */
        @Autowired
        private final ResourceUtils resourceUtils;
        /**
         * See {@link ObjectMapperConfig#jsonObjectMapper()}.
         */
        @Resource(name = ObjectMapperConfig.JSON_OBJECT_MAPPER_QUALIFIER)
        private final ObjectMapper jsonObjectMapper;

        /**
         * Autowired constructor.
         *
         * @param resourceUtils See {@link ResourceUtils}.
         * @param jsonObjectMapper See {@link ObjectMapperConfig#jsonObjectMapper()}.
         */
        @Autowired
        private InputModelParser(final ResourceUtils resourceUtils,
                                 final ObjectMapper jsonObjectMapper) {
            this.resourceUtils = resourceUtils;
            this.jsonObjectMapper = jsonObjectMapper;
        }

        /**
         * Maps the inputStream into a {@code List<CalculateChangeArgs>} using Jackson.
         *
         * @param inputStream the {@code InputStream} to parse; this input stream will provide JSON to the Jackson
         * parser.
         *
         * @return A list of calculate change args parsed from the input stream.
         *
         * @throws ParseInputStreamNullException When {@code inputStream} is null.
         * @throws ParseInputStreamIOException When the Jackson {@code .readValue} method throws an {@code IOException}.
         * @throws ParseInputStreamThrowableException For any other failures.
         */
        @Override
        protected List<CalculateChangeArgs> parseImpl(final InputStream inputStream) {
            if (inputStream == null) {
                throw new ParseInputStreamNullException();
            }

            try (inputStream) {
                final InputModel inputModel = this.jsonObjectMapper.readValue(inputStream, InputModel.class);
                return this.parse(inputModel);
            }
            catch (final IOException exception) {
                throw new ParseInputStreamIOException(exception);
            }
            catch (final Throwable throwable) {
                throw new ParseInputStreamThrowableException(throwable);
            }
        }

        /**
         * Helper method for {@link #parseImpl(InputStream)}. Uses the currency, locale, and list of {@link
         * InputModel.OwedAndTendered} values from an input model to parse a list of calculate change args.
         *
         * @param inputModel The input model to parse
         *
         * @return A list of calculate change args.
         */
        private List<CalculateChangeArgs> parse(final InputModel inputModel) {
            final Currency currency = inputModel.getCurrency();
            final Locale inputLocale = inputModel.getInputLocale();
            final List<InputModel.OwedAndTendered> owedAndTenderedList = inputModel.getOwedAndTenderedList();

            return owedAndTenderedList
                    .parallelStream()
                    .map(owedAndTendered -> this.parse(owedAndTendered, currency, inputLocale))
                    .collect(Collectors.toUnmodifiableList());
        }

        /**
         * Helper method for parsing individual values from the input model.
         *
         * @param owedAndTendered The owed and tendered value.
         * @param currency The currency value.
         * @param inputLocale The input locale value.
         *
         * @return A {@link CalculateChangeArgs} object built from the parameters.
         *
         * @see #parse(InputModel)
         */
        private CalculateChangeArgs parse(
                final InputModel.OwedAndTendered owedAndTendered,
                final Currency currency,
                final Locale inputLocale) {
            final String owedString = owedAndTendered.getOwed();
            final String tenderedString = owedAndTendered.getTendered();

            final CurrencyValue owed = CurrencyValue.builder()
                    .currencyAndBigDecimalString(currency, owedString, inputLocale)
                    .build();
            final CurrencyValue tendered = CurrencyValue.builder()
                    .currencyAndBigDecimalString(currency, tenderedString, inputLocale)
                    .build();

            final CalculateChangeArgs args = builder()
                    .owed(owed)
                    .tendered(tendered)
                    .build();
            return args;
        }

        /**
         * See {@link #parseImpl(InputStream)}
         *
         * @see #parseImpl(InputStream)
         */
        static final class ParseInputStreamIOException extends CashRegisterException {
            ParseInputStreamIOException(Throwable cause) {
                super("could not map value to input model", cause);
            }
        }

        /**
         * See {@link #parseImpl(InputStream)}
         *
         * @see #parseImpl(InputStream)
         */
        static final class ParseInputStreamThrowableException extends CashRegisterException {
            ParseInputStreamThrowableException(Throwable cause) {
                super("could not parse input model", cause);
            }
        }

        /**
         * See {@link #parseImpl(InputStream)}
         *
         * @see #parseImpl(InputStream)
         */
        static final class ParseInputStreamNullException extends CashRegisterException {
            ParseInputStreamNullException() {
                super("input stream must not be null");
            }
        }
    }

    /**
     * Used by Jackson to write out these args.
     */
    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    @JsonPropertyOrder({"owed", "tendered", "inputArgsExceptionList"})
    static final class OutputModel {
        /**
         * The owed value
         */
        @JsonProperty
        @JsonSerialize(using = ToStringSerializer.class)
        private CurrencyValue owed;

        /**
         * The tendered value
         */
        @JsonProperty
        @JsonSerialize(using = ToStringSerializer.class)
        private CurrencyValue tendered;

        /**
         * A list of exceptions (usually validation exceptions) associate with these args.
         */
        private List<Throwable> inputArgsExceptionList;

        /**
         * A string representation of the exception list.
         *
         * @return A string representation of the exception list.
         *
         * @see #inputArgsExceptionList
         */
        @JsonProperty
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        private List<String> getInputArgsExceptionList() {
            return this.inputArgsExceptionList
                    .parallelStream()
                    .map(Throwable::toString)
                    .collect(Collectors.toUnmodifiableList());
        }
    }

    /**
     * A {@link ModelMapper} converter object which converts a calculate change result object to its {@link
     * CalculateChangeResult.OutputModel}.
     */
    static final class ArgsToOutputModelConverter extends AbstractConverter<CalculateChangeArgs, OutputModel> {
        /**
         * Implementation of {@link AbstractConverter#convert(Object)}; performs the conversion.
         *
         * @param source The source object.
         *
         * @return The {@link CalculateChangeResult.OutputModel}
         */
        @Override
        protected OutputModel convert(final CalculateChangeArgs source) {
            final OutputModel outputModel = new OutputModel();
            outputModel.owed = source.getOwed();
            outputModel.tendered = source.getTendered();
            outputModel.inputArgsExceptionList = List.copyOf(source.getInputArgsExceptionList());
            return outputModel;
        }
    }

    /**
     * A class which validates calculate change args; the individual args are validated and any exceptions are place in
     * each args exception collection.
     */
    @Component(Validator.QUALIFIER)
    static class Validator {
        /**
         * Spring qualifier.
         */
        static final String QUALIFIER = "com.example.cash_register.currency.CalculateChangeArgs.Validator";
        /**
         * See {@link PhysicalSetMap}.
         */
        private final PhysicalSetMap physicalSetMap;

        /**
         * Autowired constructor.
         *
         * @param physicalSetMap See {@link PhysicalSetMap}.
         */
        @Autowired
        Validator(PhysicalSetMap physicalSetMap) {
            this.physicalSetMap = physicalSetMap;
        }

        /**
         * Validates a collection of calculate change args.
         *
         * @param calculateChangeArgsCollection The collection of calculate change args to validate.
         */
        void validate(Collection<CalculateChangeArgs> calculateChangeArgsCollection) {
            calculateChangeArgsCollection
                    .parallelStream()
                    .forEach(this::validate);
        }

        /**
         * Validates an individual calculate change args.  The args must not be null, and the args must have an
         * appropriate representation within the global set of physical currency.
         *
         * @param args The calculate change args to validate.
         *
         * @throws ValidateCalculateChangeArgsNullException When args is null.
         * @see PhysicalSetMap
         * @see PhysicalSetMap#checkRepresentation(CalculateChangeArgs)
         * @see #checkTenderedLessThanOwed(CalculateChangeArgs)
         */
        void validate(final CalculateChangeArgs args) {
            if (args == null) {
                throw new ValidateCalculateChangeArgsNullException();
            }

            if (args.getIsValidationComplete().compareAndSet(false, true)) {
                try {
                    this.physicalSetMap.checkRepresentation(args);
                }
                catch (final CompoundException compoundException) {
                    for (final Throwable throwable : compoundException.getExceptionList()) {
                        final Collection<Throwable> causeCollection = ExceptionUtils.getThrowableList(throwable);
                        args.inputArgsExceptionListInternal.addAll(causeCollection);
                    }
                }

                this.checkTenderedLessThanOwed(args);
            }
        }

        /**
         * Checks the provided calculate change args to ensure the tendered value is greater than or equal to the owed
         * value.
         *
         * @param args The args to check.
         */
        private void checkTenderedLessThanOwed(final CalculateChangeArgs args) {
            final CurrencyValue owed = args.getOwed();
            final CurrencyValue tendered = args.getTendered();

            if (! owed.hasSameCurrency(tendered)) {
                final DifferentCurrencyException exception = new DifferentCurrencyException();
                args.inputArgsExceptionListInternal.add(exception);
                return;
            }
            if (tendered.lessThan(owed)) {
                final TenderedValueLessThanOwedValueException exception = new TenderedValueLessThanOwedValueException(
                );
                args.inputArgsExceptionListInternal.add(exception);
            }
        }

        /**
         * The base exception class for calculate change args validator exceptions
         */
        static abstract class CalculateChangeArgsValidatorException extends CashRegisterException {
            CalculateChangeArgsValidatorException(final String message) {
                super(message);
            }
        }

        /**
         * An exception placed into a calculate change args exception collection when the owed and tendered values have
         * different currencies.
         */
        static final class DifferentCurrencyException extends CalculateChangeArgsValidatorException {
            DifferentCurrencyException() {
                super("owed and tendered values must be the same currency");
            }
        }

        /**
         * An exception placed into a calculate change args exception collection when the tendered value is less than
         * the owed value.
         */
        static final class TenderedValueLessThanOwedValueException extends CalculateChangeArgsValidatorException {
            TenderedValueLessThanOwedValueException() {
                super("the tendered value must not be less than the owed value");
            }
        }

        /**
         * See {@link Validator#validate(CalculateChangeArgs)}
         *
         * @see Validator#validate(CalculateChangeArgs)
         */
        static class ValidateCalculateChangeArgsNullException extends CalculateChangeArgsValidatorException {
            ValidateCalculateChangeArgsNullException() {
                super("args must not be null");
            }
        }

    }

    static class IntentionallyInvalidArgsException extends Validator.CalculateChangeArgsValidatorException {
        IntentionallyInvalidArgsException() {
            super("these calculate change args are intentionally invalid");
        }
    }
}
