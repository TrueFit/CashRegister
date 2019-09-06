package com.example.cash_register;

import com.example.cash_register.currency.PhysicalCurrency;

public class PhysicalConstantsForTests {
    public static final PhysicalCurrency USD_PENNY_PHYSICAL;
    public static final PhysicalCurrency USD_NICKEL_PHYSICAL;
    public static final PhysicalCurrency EUR_ONE_CENT_COIN_PHYSICAL;

    static {
        USD_PENNY_PHYSICAL = PhysicalCurrency.builder()
                .currencyValue(CurrencyValueConstantsForTests.USD_PENNY_VALUE)
                .name("penny")
                .build();
    }

    static {
        USD_NICKEL_PHYSICAL = PhysicalCurrency.builder()
                .currencyValue(CurrencyValueConstantsForTests.USD_NICKEL_VALUE)
                .name("nickel")
                .build();
    }

    static {
        EUR_ONE_CENT_COIN_PHYSICAL = PhysicalCurrency.builder()
                .currencyValue(CurrencyValueConstantsForTests.EUR_ONE_CENT_COIN_VALUE)
                .name("one cent coin")
                .build();
    }
}
