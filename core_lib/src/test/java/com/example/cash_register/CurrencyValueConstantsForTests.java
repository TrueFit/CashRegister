package com.example.cash_register;

import com.example.cash_register.currency.CurrencyValue;

import static com.example.cash_register.CurrencyConstantsForTests.EUR_CURRENCY;
import static com.example.cash_register.CurrencyConstantsForTests.USD_CURRENCY;

public class CurrencyValueConstantsForTests {
    public static final CurrencyValue USD_PENNY_VALUE = CurrencyValue.builder().unitValueAsLong(1).currency(USD_CURRENCY).build();
    public static final CurrencyValue USD_NICKEL_VALUE = CurrencyValue.builder().unitValueAsLong(5).currency(USD_CURRENCY).build();
    public static final CurrencyValue USD_DOLLAR_VALUE = CurrencyValue.builder().unitValueAsLong(100).currency(USD_CURRENCY).build();
    public static final CurrencyValue EUR_ONE_CENT_COIN_VALUE = CurrencyValue.builder().unitValueAsLong(1).currency(EUR_CURRENCY).build();
}
