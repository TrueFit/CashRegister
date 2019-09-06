package com.example.cash_register.shared.math;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.text.TextStringBuilder;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.util.Locale;

/**
 * Utilities for working with {@link BigDecimal} objects.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class BigDecimalUtils {
    /**
     * Parses the provided {@link String} into a {@link BigDecimal} object, using the provided {@link Locale}.
     *
     * @param bigDecimalString The big decimal to parse.
     * @param locale The locale to use.
     *
     * @return The parsed {@link BigDecimal} value.
     *
     * @throws ParseBigDecimalWithLocaleException If {@link DecimalFormat#parse(String)} throws a {@link
     * ParseException}, that exception will be the cause.
     */
    public static BigDecimal valueOf(final String bigDecimalString, final Locale locale) {
        DecimalFormat decimalFormat = (DecimalFormat) DecimalFormat.getInstance(locale);
        decimalFormat.setParseBigDecimal(true);
        BigDecimal bigDecimal;
        try {
            bigDecimal = (BigDecimal) decimalFormat.parse(bigDecimalString);
            return bigDecimal;
        }
        catch (final ParseException parseException) {
            final String message = new TextStringBuilder()
                    .appendln("could not parse string value to BigDecimal")
                    .append(" bigDecimalString => ").appendln(bigDecimalString)
                    .append(" locale => ").appendln(locale)
                    .build();
            throw new ParseBigDecimalWithLocaleException(message, parseException);
        }
    }

    /**
     * See {@link #valueOf(String, Locale)}
     *
     * @see #valueOf(String, Locale)
     */
    public static final class ParseBigDecimalWithLocaleException extends RuntimeException {
        private ParseBigDecimalWithLocaleException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
