package com.example.tango.lib;

import com.example.cash_register.currency.CalculateChangeArgs;
import com.example.cash_register.currency.CashRegisterProperties;
import com.example.cash_register.currency.CurrencyValue;
import com.example.cash_register.currency.InputStreamParserBase;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Currency;
import java.util.List;
import java.util.StringTokenizer;
import java.util.stream.Collectors;

/**
 * Implementation of {@link InputStreamParserBase}, which parses an input stream into calculate change args objects.
 * <p>
 * Each line of this input format for this parser will be similar to:  {@code 1.00,2.00}.  The owed value is the first
 * value, the tendered value is the second value.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Component(TangoInputParser.QUALIFIER)
public final class TangoInputParser extends InputStreamParserBase {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.tango.lib.TangoInputParser";

    /**
     * Cash register properties.
     */
    private final CashRegisterProperties cashRegisterProperties;

    /**
     * Autowired constructor.
     *
     * @param cashRegisterProperties The cash register properties.
     */
    @Autowired
    public TangoInputParser(final CashRegisterProperties cashRegisterProperties) {
        this.cashRegisterProperties = cashRegisterProperties;
    }

    /**
     * Parses the input stream into a list of calculate change args.
     *
     * @param inputStream The input stream to parse.
     *
     * @return The list of calculate change args.
     *
     * @throws ReadLinesFromInputStreamException If {@link IOUtils#readLines(InputStream, Charset)} throws an exception,
     * that exception will be the cause.
     * @see #processLine(String)
     */
    @Override
    protected List<CalculateChangeArgs> parseImpl(final InputStream inputStream) {
        List<String> lines;
        try {
            lines = IOUtils.readLines(inputStream, StandardCharsets.UTF_8);
        }
        catch (final Throwable throwable) {
            throw new ReadLinesFromInputStreamException(throwable);
        }
        List<CalculateChangeArgs> calculateChangeArgs = lines
                .parallelStream()
                .map(this::processLine)
                .collect(Collectors.toUnmodifiableList());
        return calculateChangeArgs;
    }

    /**
     * Splits a line into owed and tendered values and returns a calculate change args object based on those values.
     *
     * @param line The line to parse.
     *
     * @return The calculate change args.
     *
     * @see TangoInputParser
     */
    private CalculateChangeArgs processLine(final String line) {
        final Currency currency = this.cashRegisterProperties.getCurrency();
        final CalculateChangeArgs intentionallyInvalidArgs = CalculateChangeArgs.createIntentionallyInvalidArgs();

        if (StringUtils.isBlank(line)) {
            intentionallyInvalidArgs.addInputArgsException(new BlankLineForInputException());
            return intentionallyInvalidArgs;
        }

        String owedString;
        String tenderedString;
        try {
            final StringTokenizer stringTokenizer = new StringTokenizer(line, ",");
            owedString = stringTokenizer.nextToken();
            tenderedString = stringTokenizer.nextToken();
        }
        catch (final Throwable throwable) {
            intentionallyInvalidArgs.addInputArgsException(new TokenizeOwedAndTenderedLineException(throwable));
            return intentionallyInvalidArgs;
        }

        CurrencyValue owed = null;
        CurrencyValue tendered = null;
        final Collection<Throwable> currencyValueParseExceptionCollection = new ArrayList<>();
        try {
            owed = CurrencyValue.builder()
                    .currencyAndBigDecimalString(currency, owedString)
                    .build();
        }
        catch (final Throwable throwable) {
            currencyValueParseExceptionCollection.add(new OwedCurrencyValueBuildException(throwable));
        }

        try {
            tendered = CurrencyValue.builder()
                    .currencyAndBigDecimalString(currency, tenderedString)
                    .build();
        }
        catch (final Throwable throwable) {
            currencyValueParseExceptionCollection.add(new TenderedCurrencyValueBuildException(throwable));
        }

        if (CollectionUtils.isNotEmpty(currencyValueParseExceptionCollection)) {
            currencyValueParseExceptionCollection
                    .forEach(intentionallyInvalidArgs::addInputArgsException);
            return intentionallyInvalidArgs;
        }

        final CalculateChangeArgs args = CalculateChangeArgs.builder()
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
    static final class ReadLinesFromInputStreamException extends RuntimeException {
        ReadLinesFromInputStreamException(Throwable throwable) {
            super("could not read lines from input stream", throwable);
        }
    }

    /**
     * See {@link #processLine(String)}
     *
     * @see #processLine(String)
     */
    static final class BlankLineForInputException extends RuntimeException {
        BlankLineForInputException() {
            super("blank line in input");
        }
    }

    /**
     * See {@link #processLine(String)}
     *
     * @see #processLine(String)
     */
    static final class TokenizeOwedAndTenderedLineException extends RuntimeException {
        TokenizeOwedAndTenderedLineException(Throwable cause) {
            super("could not tokenize owed and tendered value", cause);
        }
    }

    /**
     * See {@link #processLine(String)}
     *
     * @see #processLine(String)
     */
    static final class OwedCurrencyValueBuildException extends RuntimeException {
        OwedCurrencyValueBuildException(Throwable cause) {
            super("could not build owed currency value", cause);
        }
    }

    /**
     * See {@link #processLine(String)}
     *
     * @see #processLine(String)
     */
    static final class TenderedCurrencyValueBuildException extends RuntimeException {
        TenderedCurrencyValueBuildException(Throwable cause) {
            super("could not build tendered currency value", cause);
        }
    }
}
