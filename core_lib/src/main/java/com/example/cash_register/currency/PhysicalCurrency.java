package com.example.cash_register.currency;

import com.example.cash_register.shared.spring.SpringContextUtils;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

import java.util.Locale;

/**
 * Represents a piece of physical currency.  Note, for the purpose of this library, the natural order of physical
 * currency is from high unit value to low unit value.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Builder
@Getter(AccessLevel.PACKAGE)
public class PhysicalCurrency implements Comparable<PhysicalCurrency> {
    @NonNull
    CurrencyValue currencyValue;
    @NonNull
    private String name;

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
        CashRegisterProperties cashRegisterProperties = SpringContextUtils.getBean(CashRegisterProperties.class);
        Locale locale = cashRegisterProperties.getOutputLocale();
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
    public String toString(Locale locale) {
        String returnValue = String.format(
                "%s [%s]",
                this.getName(),
                this.getCurrencyValue().toString(locale));
        return returnValue;
    }
}
