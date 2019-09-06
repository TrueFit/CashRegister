package com.example.cash_register.currency;

import com.example.cash_register.shared.math.BigDecimalUtils;
import com.example.cash_register.shared.spring.SpringContextUtils;
import org.apache.commons.text.TextStringBuilder;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Currency;
import java.util.Locale;

/**
 * A subclass of BigInteger to represent the unit value used in {@link CurrencyValue} objects.
 */
public final class UnitValue extends BigInteger {
    /**
     * An invalid UnitValue instance; specifically, a unit value equal to {@link Long#MIN_VALUE} (negative unit values
     * are not permitted by the public API).
     *
     * @see Long#MIN_VALUE
     * @see CurrencyValue#INVALID
     */
    public static final UnitValue INVALID = new UnitValue(Long.MIN_VALUE);

    /**
     * Creates a unit value object from a {@link long} value.
     *
     * @param longUnitValue The long value.
     */
    private UnitValue(long longUnitValue) {
        this(String.valueOf(longUnitValue));
    }

    /**
     * Per {@link BigInteger#BigInteger(String)}
     *
     * @param stringValue Per {@link BigInteger#BigInteger(String)}
     *
     * @see BigInteger#BigInteger(String)
     */
    private UnitValue(final String stringValue) {
        super(stringValue);
    }

    /**
     * Per {@link BigInteger#BigInteger(byte[])}
     *
     * @param byteArrayUnitValue Per {@link BigInteger#BigInteger(byte[])}
     *
     * @see BigInteger#BigInteger(byte[])
     */
    private UnitValue(final byte[] byteArrayUnitValue) {
        super(byteArrayUnitValue);
    }

    /**
     * Creates a unit value object from a {@link BigInteger} object
     *
     * @param bigIntegerUnitValue The {@link BigInteger} to copy into the unit value.
     */
    private UnitValue(final BigInteger bigIntegerUnitValue) {
        this(bigIntegerUnitValue.toByteArray());
    }

    /**
     * Creates a unit value from the provided long value.
     *
     * @param longValue The value for the unit value.
     *
     * @return The unit value.
     *
     * @throws NegativeLongValueException When longValue is less than zero.
     */
    public static UnitValue valueOf(final long longValue) {
        if (longValue < 0) {
            throw new NegativeLongValueException();
        }
        return new UnitValue(longValue);
    }

    /**
     * Creates a unit value from the provided {@code BigInteger}.
     *
     * @param bigInteger The value for the unit value.
     *
     * @return The unit value.
     *
     * @throws ValueOfBigIntegerNullException When bigInteger is null.
     * @throws ValueOfBigIntegerNegativeException When bigInteger is negative.
     */
    static UnitValue valueOf(final BigInteger bigInteger) {
        if (bigInteger == null) {
            throw new ValueOfBigIntegerNullException();
        }
        if (bigInteger.compareTo(BigInteger.ZERO) < 0) {
            throw new ValueOfBigIntegerNegativeException();
        }
        return new UnitValue(bigInteger);
    }

    /**
     * Creates a unit value from the provided {@link Currency} and {@link BigDecimal}
     *
     * @param currency The currency, used to determine how to parse the BigDecimal, via {@link
     * Currency#getDefaultFractionDigits()}
     * @param bigDecimal The value for the unit value.
     *
     * @return The unit value.
     *
     * @throws NullCurrencyException When currency is null.
     * @throws NullBigDecimalException When bigDecimal is null.
     * @throws NegativeBigDecimalException When bigDecimal is negative.
     * @throws FractionalPartRemainsDuringUnitValueConversionException When bigDecimal has a fractional part remaining
     * after moving the decimal point right by {@link Currency#getDefaultFractionDigits()} digits.
     * @see Currency
     * @see BigDecimal
     * @see BigDecimal#toBigIntegerExact()
     */
    static UnitValue valueOf(final Currency currency, final BigDecimal bigDecimal) {
        if (currency == null) {
            throw new NullCurrencyException();
        }
        if (bigDecimal == null) {
            throw new NullBigDecimalException();
        }
        if (bigDecimal.compareTo(BigDecimal.ZERO) < 0) {
            throw new NegativeBigDecimalException();
        }

        BigDecimal bigDecimalUnitValue = bigDecimal.movePointRight(currency.getDefaultFractionDigits());
        try {
            final BigInteger bigInteger = bigDecimalUnitValue.toBigIntegerExact();
            return new UnitValue(bigInteger);
        }
        catch (final ArithmeticException arithmeticException) {
            final String message = new TextStringBuilder()
                    .appendln("fractional part remains during UnitValue conversion")
                    .append(" Currency => ").appendln(currency)
                    .append(" Currency default fraction digits => ").appendln(currency.getDefaultFractionDigits())
                    .append(" BigDecimal value => ").appendln(bigDecimal)
                    .build();
            throw new FractionalPartRemainsDuringUnitValueConversionException(message, arithmeticException);
        }
    }

    /**
     * Creates a unit value from the provided {@link Currency}, {@link BigDecimal}, and {@link Locale}.
     *
     * @param currency The currency, used to determine how to parse the BigDecimal, via {@link
     * Currency#getDefaultFractionDigits()}
     * @param bigDecimalString The value for the unit value.
     * @param locale The locale used to parse {@code bigDecimalString}.
     *
     * @return The unit value.
     *
     * @see BigDecimalUtils#valueOf(String, Locale)
     * @see #valueOf(Currency, BigDecimal)
     */
    static UnitValue valueOf(final Currency currency, final String bigDecimalString, final Locale locale) {
        final BigDecimal bigDecimal = BigDecimalUtils.valueOf(bigDecimalString, locale);
        return valueOf(currency, bigDecimal);
    }

    /**
     * Creates a unit value from the provided {@link Currency}, {@link BigDecimal}, using the configured input locale.
     *
     * @param currency The currency, used to determine how to parse the BigDecimal, via {@link
     * Currency#getDefaultFractionDigits()}
     * @param bigDecimalString The value for the unit value.
     *
     * @return The unit value.
     *
     * @see CashRegisterProperties#getInputLocale()
     * @see #valueOf(Currency, String, Locale)
     */
    static UnitValue valueOf(final Currency currency, final String bigDecimalString) {
        Locale locale = SpringContextUtils.getBean(CashRegisterProperties.class).getInputLocale();
        return valueOf(currency, bigDecimalString, locale);
    }

    /**
     * Checks if this value is positive.
     *
     * @return {@code true} when this value is positive; otherwise, {@code false}.
     */
    @SuppressWarnings("BooleanMethodIsAlwaysInverted")
    public boolean isPositive() {
        /* `.signum()` of `1` is a positive value */
        return this.signum() == 1;
    }

    /**
     * Negates {@link #isPositive()}
     *
     * @return Negates {@link #isPositive()}
     *
     * @see #isPositive()
     */
    public boolean isNonPositive() {
        return ! this.isPositive();
    }

    /**
     * See {@link #valueOf(long)}
     *
     * @see #valueOf(long)
     */
    public static final class NegativeLongValueException extends CashRegisterException {
        NegativeLongValueException() {
            super("value must be non-negative");
        }
    }

    /**
     * See {@link #valueOf(BigInteger)}
     *
     * @see #valueOf(BigInteger)
     */
    public static final class ValueOfBigIntegerNullException extends CashRegisterException {
        ValueOfBigIntegerNullException() {
            super("bigInteger must not be null");
        }
    }

    /**
     * See {@link #valueOf(BigInteger)}
     *
     * @see #valueOf(BigInteger)
     */
    public static final class ValueOfBigIntegerNegativeException extends CashRegisterException {
        ValueOfBigIntegerNegativeException() {
            super("bigInteger must be non-negative");
        }
    }

    /**
     * See {@link #valueOf(Currency, BigDecimal)}
     *
     * @see #valueOf(Currency, BigDecimal)
     */
    static final class NullCurrencyException extends CashRegisterException {
        NullCurrencyException() {
            super("currency must not be null");
        }
    }

    /**
     * See {@link #valueOf(Currency, BigDecimal)}
     *
     * @see #valueOf(Currency, BigDecimal)
     */
    static final class NullBigDecimalException extends CashRegisterException {
        NullBigDecimalException() {
            super("bigDecimal must not be null");
        }
    }

    /**
     * See {@link #valueOf(Currency, BigDecimal)}
     *
     * @see #valueOf(Currency, BigDecimal)
     */
    static final class NegativeBigDecimalException extends CashRegisterException {
        NegativeBigDecimalException() {
            super("bigDecimal must be non-negative");
        }
    }

    /**
     * See {@link #valueOf(Currency, BigDecimal)}
     *
     * @see #valueOf(Currency, BigDecimal)
     */
    static final class FractionalPartRemainsDuringUnitValueConversionException extends CashRegisterException {
        FractionalPartRemainsDuringUnitValueConversionException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
