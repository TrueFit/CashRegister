package com.example.cash_register.currency;

import java.util.Comparator;
import java.util.Currency;

/**
 * A comparator for Currency which sorts based on the currency code in {@code String} order.
 */
final class CurrencyByCurrencyCodeComparator implements Comparator<Currency> {
    @Override
    public int compare(Currency left, Currency right) {
        return left.getCurrencyCode().compareTo(right.getCurrencyCode());
    }
}
