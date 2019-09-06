package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static com.example.cash_register.CurrencyValueConstantsForTests.EUR_ONE_CENT_COIN_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_NICKEL_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_PENNY_VALUE;
import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrencyValueAddTests {
    @Test
    public void addCurrencyValue_test() {
        CurrencyValue sum = USD_NICKEL_VALUE.add(USD_PENNY_VALUE);
        CurrencyValue expected = CurrencyValue.builder()
                .currency(USD_NICKEL_VALUE.getCurrency())
                .unitValueAsLong(6)
                .build();

        MatcherAssert.assertThat(sum, equalTo(expected));
    }

    @Test(expected = CurrencyValue.AddCurrencyValueNullAddendException.class)
    public void addCurrencyValue_AddCurrencyValueNullAddendException_test() {
        USD_NICKEL_VALUE.add(null);
    }

    @Test(expected = CurrencyValue.AddCurrencyValueDifferentCurrencyException.class)
    public void addCurrencyValue_AddCurrencyValueDifferentCurrencyException_test() {
        USD_NICKEL_VALUE.add(EUR_ONE_CENT_COIN_VALUE);
    }
}
