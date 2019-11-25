package com.example.cash_register.currency;

import com.example.cash_register.shared.spring.SpringContextUtils;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;

import java.util.Locale;

/**
 * Represents an immutable piece of physical currency.  Note, for the purpose of this library, the natural order of physical
 * currency is from high unit value to low unit value.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Builder
@Getter(AccessLevel.PACKAGE)
public class PhysicalCurrency implements Comparable<PhysicalCurrency> {
    /**
     * The {@link CurrencyValue} of this physical currency.
     */
    @lombok.NonNull
    private final CurrencyValue currencyValue;

    /**
     * The (arbitrary) name of this physical currency.
     */
    @lombok.NonNull
    private final String name;

    /**
     * Compares this physical currency to another. Note, for the purpose of this library, the natural order of physical
     * currency is from high unit value to low unit value.
     *
     * @param right The physical currency to compare.
     *
     * @return -1 when this is less than right, 0 when this is equal to right, 1 when this is greater than right.
     */
    @Override
    public int compareTo(final PhysicalCurrency right) {
        return right.getCurrencyValue().compareTo(this.getCurrencyValue());
    }

    /**
     * Returns a string of this value formatted to the configured output locale, using the currency symbol of {@code
     * this.getCurrencyValue().getCurrency()} via {@link CurrencyValue#toString(Locale)}.
     *
     * @return A string of this value formatted to the configured output locale, using the currency symbol of {@code
     * this.getCurrencyValue().getCurrency()}.
     *
     * @see CashRegisterProperties#getOutputLocale()
     */
    @Override
    public String toString() {
        final CashRegisterProperties cashRegisterProperties = SpringContextUtils.getBean(CashRegisterProperties.class);
        final Locale locale = cashRegisterProperties.getOutputLocale();
        return this.toString(locale);
    }

    /**
     * Return a string of this value formatted to the provided locale, using the currency symbol of {@code
     * this.getCurrencyValue().getCurrency()} via {@link CurrencyValue#toString(Locale)}.
     *
     * @param locale The locale to use.
     *
     * @return A string of this value formatted to the provided locale, using the currency symbol of {@code
     * this.getCurrencyValue().getCurrency()}.
     */
    public String toString(final Locale locale) {
        final String returnValue = String.format(
                "%s [%s]",
                this.getName(),
                this.getCurrencyValue().toString(locale));
        return returnValue;
    }
}
