package com.example.cash_register.currency;

import com.example.cash_register.shared.math.BigDecimalUtils;
import com.example.cash_register.shared.spring.SpringContextUtils;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.text.TextStringBuilder;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.NumberFormat;
import java.util.Currency;
import java.util.Locale;

/**
 * Represents an immutable, abstract currency value; it contains a unit value and currency.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Builder
@Getter
@EqualsAndHashCode
public final class CurrencyValue implements Comparable<CurrencyValue> {
    /**
     * An invalid CurrencyValue instance; specifically, a currency equal to a unit value of {@link UnitValue#INVALID}
     * with a currency of {@link CurrencyConstants#INVALID_CURRENCY}.
     *
     * @see CalculateChangeArgs#createIntentionallyInvalidArgs()
     * @see CurrencyConstants#INVALID_CURRENCY
     * @see UnitValue#INVALID
     */
    public static final CurrencyValue INVALID =
            new CurrencyValue(UnitValue.INVALID, CurrencyConstants.INVALID_CURRENCY);

    /**
     * The unit value for this currency value.
     *
     * @see UnitValue
     */
    @lombok.NonNull
    private final UnitValue unitValue;
    /**
     * The currency of the currency value.
     *
     * @see Currency
     */
    @lombok.NonNull
    private final Currency currency;

    /**
     * Returns a currency value of zero in the provided currency.
     *
     * @param currency The currency to use.
     *
     * @return A currency value with a unit value of zero and with the provided currency.
     */
    static CurrencyValue getZero(final Currency currency) {
        return CurrencyValue.builder()
                .currency(currency)
                .unitValueAsLong(0)
                .build();
    }

    /**
     * Returns a currency value of one in the provided currency.
     *
     * @param currency The currency to use.
     *
     * @return A currency value with a unit value of one and with the provided currency.
     */
    static CurrencyValue getOne(final Currency currency) {
        return CurrencyValue.builder()
                .currency(currency)
                .unitValueAsLong(1)
                .build();
    }

    /**
     * Compare this currency value to the provided currency value. The two currency values must have the same currency
     * to be compared.
     *
     * @param right The currency value to compare.
     *
     * @return -1 when this currency value is less than the provided value, 0 when this currency value equals the
     * provided value, and 1 when this currency value is greater than the provided value.
     */
    @SuppressWarnings("NullableProblems")
    @Override
    public int compareTo(final CurrencyValue right) {
        if (right == null) {
            throw new CompareToNullRightValueException();
        }
        if (! this.hasSameCurrency(right)) {
            throw new CompareToDifferentCurrencyException();
        }

        return this.getUnitValue().compareTo(right.getUnitValue());
    }

    /**
     * Subtracts the subtrahend from this currency value and returns the result in a new currency value object.
     *
     * @param subtrahend The subtrahend to subtract.
     *
     * @return The difference of this minus the subtrahend.
     *
     * @throws SubtractCurrencyValueNullSubtrahendException When subtrahend is null.
     * @throws SubtractCurrencyValueDifferentCurrencyException When subtrahend and this have a different currency.
     */
    public CurrencyValue subtract(final CurrencyValue subtrahend) {
        if (subtrahend == null) {
            throw new SubtractCurrencyValueNullSubtrahendException();
        }
        if (! this.hasSameCurrency(subtrahend)) {
            throw new SubtractCurrencyValueDifferentCurrencyException();
        }
        final BigInteger difference = this.getUnitValue().subtract(subtrahend.getUnitValue());
        final CurrencyValue currencyValue = CurrencyValue.builder()
                .unitValueAsBigInteger(difference)
                .currency(this.currency)
                .build();
        return currencyValue;
    }

    /**
     * Subtracts the subtrahend from this currency value and returns the result in a new currency value object.
     *
     * @param subtrahend The subtrahend to subtract.
     *
     * @return The difference of this minus the subtrahend.
     *
     * @throws SubtractPhysicalCurrencyNullSubtrahendException When subtrahend is null.
     * @throws SubtractPhysicalCurrencyDifferentCurrencyException When subtrahend and this have a different currency.
     */
    CurrencyValue subtract(final PhysicalCurrency subtrahend) {
        if (subtrahend == null) {
            throw new SubtractPhysicalCurrencyNullSubtrahendException();
        }
        if (! this.hasSameCurrency(subtrahend)) {
            throw new SubtractPhysicalCurrencyDifferentCurrencyException();
        }
        return this.subtract(subtrahend.getCurrencyValue());
    }

    /**
     * Checks if this is less than the provided value.
     *
     * @param right The value to compare.
     *
     * @return {@code true}, if this is less than right; otherwise, {@code false}.
     *
     * @throws LessThanCurrencyValueNullRightException When right is null.
     */
    boolean lessThan(final CurrencyValue right) {
        if (right == null) {
            throw new LessThanCurrencyValueNullRightException();
        }
        return this.compareTo(right) < 0;
    }

    /**
     * Checks if this is greater than the provided value.
     *
     * @param right The value to compare.
     *
     * @return {@code true}, if this is greater than right; otherwise, {@code false}.
     *
     * @throws GreaterThanCurrencyValueNullRightException When right is null.
     */
    boolean greaterThan(final CurrencyValue right) {
        if (right == null) {
            throw new GreaterThanCurrencyValueNullRightException();
        }
        return this.compareTo(right) > 0;
    }

    /**
     * Checks if this is greater than zero.
     *
     * @return {@code true}, if this is greater than zero; otherwise, {@code false}
     */
    boolean greaterThanZero() {
        return this.getUnitValue().compareTo(BigInteger.ZERO) > 0;
    }

    /**
     * Checks if this is greater than or equal to the provided value.
     *
     * @param right The value to compare.
     *
     * @return {@code true}, if this is greater than or equal to right; otherwise, {@code false}.
     *
     * @throws GreaterThanOrEqualToCurrencyValueNullRightException When right is null.
     */
    boolean greaterThanOrEqualTo(final CurrencyValue right) {
        if (right == null) {
            throw new GreaterThanOrEqualToCurrencyValueNullRightException();
        }
        return this.compareTo(right) >= 0;
    }

    /**
     * Checks if this is greater than or equal to the provided value.
     *
     * @param right The value to compare.
     *
     * @return {@code true}, if this is greater than or equal to right; otherwise, {@code false}.
     *
     * @throws GreaterThanOrEqualToPhysicalCurrencyNullRightException When right is null.
     */
    boolean greaterThanOrEqualTo(final PhysicalCurrency right) {
        if (right == null) {
            throw new GreaterThanOrEqualToPhysicalCurrencyNullRightException();
        }
        return this.greaterThanOrEqualTo(right.getCurrencyValue());
    }

    /**
     * Checks if this and right have the same currency.
     *
     * @param right The value to compare.
     *
     * @return {@code true}, if this and right have the same currency; otherwise, {@code false}
     */
    boolean hasSameCurrency(final CurrencyValue right) {
        if (right == null) {
            return false;
        }
        return this.getCurrency().equals(right.getCurrency());
    }

    /**
     * Checks if this and right have the same currency.
     *
     * @param right The value to compare.
     *
     * @return {@code true}, if this and right have the same currency; otherwise, {@code false}
     */
    boolean hasSameCurrency(final PhysicalCurrency right) {
        if (right == null) {
            return false;
        }
        return this.hasSameCurrency(right.getCurrencyValue());
    }

    /**
     * Checks if this is evenly divisible by the divisor.
     *
     * @param divisor The divisor to check.
     *
     * @return {@code true}, if this is evenly divisible by the divisor; otherwise, {@code false}.
     *
     * @throws IsDivisibleByBigIntegerNullDivisorException When divisor is null.
     */
    public boolean isDivisibleBy(final BigInteger divisor) {
        if (divisor == null) {
            throw new IsDivisibleByBigIntegerNullDivisorException();
        }
        BigInteger remainder = this.getUnitValue().remainder(divisor);
        return remainder.equals(BigInteger.ZERO);
    }

    /**
     * Checks if this is evenly divisible by the divisor.
     *
     * @param divisor The divisor to check.
     *
     * @return {@code true}, if this is evenly divisible by the divisor; otherwise, {@code false}.
     *
     * @throws IsDivisibleByCurrencyValueNullDivisorException When divisor is null.
     * @throws IsDivisibleByCurrencyValueDifferentCurrencyException When this and divisor have different currencies.
     */
    public boolean isDivisibleBy(final CurrencyValue divisor) {
        if (divisor == null) {
            throw new IsDivisibleByCurrencyValueNullDivisorException();
        }
        if (! this.hasSameCurrency(divisor)) {
            throw new IsDivisibleByCurrencyValueDifferentCurrencyException();
        }
        return this.isDivisibleBy(divisor.getUnitValue());
    }

    /**
     * Checks if this is evenly divisible by the divisor.
     *
     * @param divisor The divisor to check.
     *
     * @return {@code true}, if this is evenly divisible by the divisor; otherwise, {@code false}.
     *
     * @throws IsDivisibleByPhysicalCurrencyNullDivisorException When divisor is null.
     * @throws IsDivisibleByPhysicalCurrencyDifferentCurrencyException When this and divisor have different currencies.
     */
    public boolean isDivisibleBy(final PhysicalCurrency divisor) {
        if (divisor == null) {
            throw new IsDivisibleByPhysicalCurrencyNullDivisorException();
        }
        if (! this.hasSameCurrency(divisor)) {
            throw new IsDivisibleByPhysicalCurrencyDifferentCurrencyException();
        }
        return this.isDivisibleBy(divisor.getCurrencyValue());
    }

    /**
     * Adds the addend to this value and returns the results in a new currency value object.
     *
     * @param addend The addend.
     *
     * @return The sum of this and addend.
     *
     * @throws AddCurrencyValueNullAddendException When addend is null.
     * @throws AddCurrencyValueDifferentCurrencyException When this and addend have different currencies.
     */
    CurrencyValue add(final CurrencyValue addend) {
        if (addend == null) {
            throw new AddCurrencyValueNullAddendException();
        }
        if (! this.hasSameCurrency(addend)) {
            throw new AddCurrencyValueDifferentCurrencyException();
        }
        final BigInteger sum = this.getUnitValue().add(addend.getUnitValue());
        final CurrencyValue currencyValue = CurrencyValue.builder()
                .unitValueAsBigInteger(sum)
                .currency(this.currency)
                .build();
        return currencyValue;
    }

    /**
     * Returns a string of this value formatted to the configured output locale, using the currency symbol of {@code
     * this.currency}.
     *
     * @return A string of this value formatted to the configured output locale, using the currency symbol of {@code
     * this.currency}.
     *
     * @see CashRegisterProperties#getOutputLocale()
     */
    @Override
    public String toString() {
        CashRegisterProperties cashRegisterProperties = SpringContextUtils.getBean(CashRegisterProperties.class);
        Locale locale = cashRegisterProperties.getOutputLocale();
        return this.toString(locale);
    }

    /**
     * Return a string of this value formatted to the provided locale, using the currency symbol of {@code
     * this.currency}.
     *
     * @param locale The locale to use.
     *
     * @return A string of this value formatted to the provided locale, using the currency symbol of {@code
     * this.currency}.
     */
    public String toString(final Locale locale) {
        final NumberFormat numberFormat = NumberFormat.getCurrencyInstance(locale);
        numberFormat.setCurrency(this.getCurrency());

        final int defaultFractionDigits = this.getCurrency().getDefaultFractionDigits();
        final BigDecimal bigDecimal = new BigDecimal(this.getUnitValue()).movePointLeft(defaultFractionDigits);
        final String currencyString = numberFormat.format(bigDecimal);

        String message = String.format(
                "%s (%s)",
                currencyString,
                this.getCurrency());
        return message;
    }

    /**
     * See {@link #subtract(CurrencyValue)}
     *
     * @see #subtract(CurrencyValue)
     */
    static final class SubtractCurrencyValueNullSubtrahendException extends CashRegisterException {
        SubtractCurrencyValueNullSubtrahendException() {
            super("subtrahend must not be null");
        }
    }

    /**
     * See {@link #subtract(CurrencyValue)}
     *
     * @see #subtract(CurrencyValue)
     */
    static final class SubtractCurrencyValueDifferentCurrencyException extends CashRegisterException {
        SubtractCurrencyValueDifferentCurrencyException() {
            super("minuend and subtrahend must be same currency");
        }
    }

    /**
     * See {@link #subtract(PhysicalCurrency)}
     *
     * @see #subtract(PhysicalCurrency)
     */
    static final class SubtractPhysicalCurrencyDifferentCurrencyException extends CashRegisterException {
        SubtractPhysicalCurrencyDifferentCurrencyException() {
            super("minuend and subtrahend must be same currency");
        }
    }

    /**
     * See {@link #subtract(PhysicalCurrency)}
     *
     * @see #subtract(PhysicalCurrency)
     */
    static final class SubtractPhysicalCurrencyNullSubtrahendException extends CashRegisterException {
        SubtractPhysicalCurrencyNullSubtrahendException() {
            super("subtrahend must not be null");
        }
    }

    /**
     * See {@link #lessThan(CurrencyValue)}
     *
     * @see #lessThan(CurrencyValue)
     */
    static final class LessThanCurrencyValueNullRightException extends CashRegisterException {
        LessThanCurrencyValueNullRightException() {
            super("right CurrencyValue must not be null");
        }
    }

    /**
     * See {@link #greaterThan(CurrencyValue)}
     *
     * @see #greaterThan(CurrencyValue)
     */
    static final class GreaterThanCurrencyValueNullRightException extends CashRegisterException {
        GreaterThanCurrencyValueNullRightException() {
            super("right CurrencyValue must not be null");
        }
    }

    /**
     * See {@link #greaterThanOrEqualTo(CurrencyValue)}
     *
     * @see #greaterThanOrEqualTo(CurrencyValue)
     */
    static final class GreaterThanOrEqualToCurrencyValueNullRightException extends CashRegisterException {
        GreaterThanOrEqualToCurrencyValueNullRightException() {
            super("right CurrencyValue must not be null");
        }
    }

    /**
     * See {@link #greaterThanOrEqualTo(PhysicalCurrency)}
     *
     * @see #greaterThanOrEqualTo(PhysicalCurrency)
     */
    static final class GreaterThanOrEqualToPhysicalCurrencyNullRightException extends CashRegisterException {
        GreaterThanOrEqualToPhysicalCurrencyNullRightException() {
            super("right PhysicalCurrency must not be null");
        }
    }

    /**
     * See {@link #isDivisibleBy(CurrencyValue)}
     *
     * @see #isDivisibleBy(CurrencyValue)
     */
    static final class IsDivisibleByCurrencyValueNullDivisorException extends CashRegisterException {
        IsDivisibleByCurrencyValueNullDivisorException() {
            super("divisor must not be null");
        }
    }

    /**
     * See {@link #isDivisibleBy(BigInteger)}
     *
     * @see #isDivisibleBy(BigInteger)
     */
    static final class IsDivisibleByBigIntegerNullDivisorException extends CashRegisterException {
        IsDivisibleByBigIntegerNullDivisorException() {
            super("divisor must not be null");
        }
    }

    /**
     * See {@link #add(CurrencyValue)}
     *
     * @see #add(CurrencyValue)
     */
    static final class AddCurrencyValueNullAddendException extends CashRegisterException {
        AddCurrencyValueNullAddendException() {
            super("addend parameter must not be null");
        }
    }

    /**
     * See {@link #isDivisibleBy(PhysicalCurrency)}
     *
     * @see #isDivisibleBy(PhysicalCurrency)
     */
    static final class IsDivisibleByPhysicalCurrencyNullDivisorException extends CashRegisterException {
        IsDivisibleByPhysicalCurrencyNullDivisorException() {
            super("divisor must not be null");
        }
    }

    /**
     * See {@link #isDivisibleBy(PhysicalCurrency)}
     *
     * @see #isDivisibleBy(PhysicalCurrency)
     */
    static final class IsDivisibleByPhysicalCurrencyDifferentCurrencyException extends CashRegisterException {
        IsDivisibleByPhysicalCurrencyDifferentCurrencyException() {
            super("dividend and divisor must be same currency");
        }
    }

    /**
     * See {@link #isDivisibleBy(CurrencyValue)}
     *
     * @see #isDivisibleBy(CurrencyValue)
     */
    static final class IsDivisibleByCurrencyValueDifferentCurrencyException extends CashRegisterException {
        IsDivisibleByCurrencyValueDifferentCurrencyException() {
            super("dividend and divisor must be same currency");
        }
    }

    /**
     * See {@link #add(CurrencyValue)}
     *
     * @see #add(CurrencyValue)
     */
    static final class AddCurrencyValueDifferentCurrencyException extends CashRegisterException {
        AddCurrencyValueDifferentCurrencyException() {
            super("addends must be same currency");
        }
    }

    /**
     * See {@link #compareTo(CurrencyValue)}
     *
     * @see #compareTo(CurrencyValue)
     */
    static final class CompareToDifferentCurrencyException extends CashRegisterException {
        private static final String MESSAGE = new TextStringBuilder()
                .append("To be compared, the currency of the provided instances must match")
                .toString();

        private CompareToDifferentCurrencyException() {
            super(MESSAGE);
        }
    }

    /**
     * See {@link #compareTo(CurrencyValue)}
     *
     * @see #compareTo(CurrencyValue)
     */
    static final class CompareToNullRightValueException extends CashRegisterException {
        private static final String MESSAGE = new TextStringBuilder()
                .append("The right parameter to the `compareTo` method must not be null")
                .toString();

        private CompareToNullRightValueException() {
            super(MESSAGE);
        }
    }

    //region Lombok `@Builder` overrides

    /**
     * {@code Lombok CurrencyValueBuilder}
     */
    public final static class CurrencyValueBuilder {
        /**
         * Helper to set the unit value with a long.
         *
         * @param unitValueAsLong The unit value as a long value.
         *
         * @return this builder.
         *
         * @see UnitValue#valueOf(long)
         */
        public CurrencyValueBuilder unitValueAsLong(final long unitValueAsLong) {
            return this.unitValue(UnitValue.valueOf(unitValueAsLong));
        }

        /**
         * Helper to set the unit value with a BigInteger.
         *
         * @param unitValueAsBigInteger The unit value as a {@link BigInteger}.
         *
         * @return this builder.
         *
         * @see UnitValue#valueOf(BigInteger)
         */
        public CurrencyValueBuilder unitValueAsBigInteger(final BigInteger unitValueAsBigInteger) {
            return this.unitValue(UnitValue.valueOf(unitValueAsBigInteger));
        }

        /**
         * Helper to set the currency with a ISO 4217 currency code.
         *
         * @param currencyCode The ISO 4217 currency code.
         *
         * @return this builder.
         *
         * @see Currency#getInstance(String)
         */
        public CurrencyValueBuilder currencyCode(final String currencyCode) {
            return this.currency(Currency.getInstance(currencyCode));
        }

        /**
         * Helper to set the unit value with a big decimal and a currency.
         *
         * @param currency The currency to use.
         * @param bigDecimal The {@code BigDecimal} to use.
         *
         * @return this builder.
         *
         * @see UnitValue#valueOf(Currency, BigDecimal)
         */
        public CurrencyValueBuilder currencyAndBigDecimal(final Currency currency, final BigDecimal bigDecimal) {
            final UnitValue unitValue = UnitValue.valueOf(currency, bigDecimal);
            return this.currency(currency).unitValue(unitValue);
        }

        /**
         * Helper to set the unit value with a {@code BigDecimal} string, a currency, and a locale.
         *
         * @param currency The currency to use.
         * @param bigDecimalString The {@code BigDecimal} string to use.
         * @param locale The locale to use.
         *
         * @return this builder.
         *
         * @throws CurrencyAndBigDecimalStringNullCurrencyException When currency is null.
         * @throws CurrencyAndBigDecimalStringBlankBigDecimalException When bigDecimalString is null, empty, or
         * whitespace.
         * @throws CurrencyAndBigDecimalStringNullLocaleException When locale is null.
         * @see #currencyAndBigDecimal(Currency, BigDecimal)
         */
        public CurrencyValueBuilder currencyAndBigDecimalString(
                final Currency currency,
                final String bigDecimalString,
                final Locale locale) {
            if (currency == null) {
                throw new CurrencyAndBigDecimalStringNullCurrencyException();
            }
            if (StringUtils.isBlank(bigDecimalString)) {
                throw new CurrencyAndBigDecimalStringBlankBigDecimalException();
            }
            if (locale == null) {
                throw new CurrencyAndBigDecimalStringNullLocaleException();
            }
            final BigDecimal bigDecimal = BigDecimalUtils.valueOf(bigDecimalString, locale);
            return this.currencyAndBigDecimal(currency, bigDecimal);
        }

        /**
         * Helper to set the unit value with a {@code BigDecimal} string, a currency, and the configured input locale.
         *
         * @param currency The currency to use.
         * @param bigDecimalString The {@code BigDecimal} string to use.
         *
         * @return this builder.
         *
         * @see #currencyAndBigDecimalString(Currency, String, Locale)
         * @see CashRegisterProperties#getInputLocale()
         */
        public CurrencyValueBuilder currencyAndBigDecimalString(final Currency currency, final String bigDecimalString) {
            final Locale locale = SpringContextUtils.getBean(CashRegisterProperties.class).getInputLocale();
            return this.currencyAndBigDecimalString(currency, bigDecimalString, locale);
        }

        /**
         * See {@link #currencyAndBigDecimalString(Currency, String, Locale)}
         *
         * @see #currencyAndBigDecimalString(Currency, String, Locale)
         */
        static final class CurrencyAndBigDecimalStringNullCurrencyException extends CashRegisterException {
            CurrencyAndBigDecimalStringNullCurrencyException() {
                super("currency must not be null");
            }
        }

        /**
         * {@link #currencyAndBigDecimalString(Currency, String, Locale)}
         *
         * @see #currencyAndBigDecimalString(Currency, String, Locale)
         */
        static final class CurrencyAndBigDecimalStringBlankBigDecimalException extends CashRegisterException {
            CurrencyAndBigDecimalStringBlankBigDecimalException() {
                super("bigDecimalString must not be null, empty, or whitespace");
            }
        }

        /**
         * See {@link #currencyAndBigDecimalString(Currency, String, Locale)}
         *
         * @see #currencyAndBigDecimalString(Currency, String, Locale)
         */
        static final class CurrencyAndBigDecimalStringNullLocaleException extends CashRegisterException {
            CurrencyAndBigDecimalStringNullLocaleException() {
                super("locale must not be null");
            }
        }
    }

    //endregion
}
