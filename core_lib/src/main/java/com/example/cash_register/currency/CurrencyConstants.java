package com.example.cash_register.currency;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Currency;

/**
 * Currency constants.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class CurrencyConstants {
    /**
     * A currency considered invalid by this application; specifically, {@code Currency.getInstance("XXX")}.
     *
     * @see Currency
     * @see Currency#getInstance(String)
     */
    public static final Currency INVALID_CURRENCY = Currency.getInstance("XXX");
}
