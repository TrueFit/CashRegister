package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.concurrent.ThreadLocalRandom;

import static com.example.cash_register.CurrencyConstantsForTests.EUR_CURRENCY;
import static com.example.cash_register.CurrencyConstantsForTests.USD_CURRENCY;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_NICKEL_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_PENNY_VALUE;
import static org.hamcrest.core.IsEqual.equalTo;

@SuppressWarnings("UnnecessaryLocalVariable")
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrencyValueCompareToTests {
    @Test
    public void builder_unitValueAsLong_test() {
        final long randomLong = ThreadLocalRandom.current().nextLong(1, 100_000);

        final CurrencyValue actual = CurrencyValue.builder()
                .currency(USD_CURRENCY)
                .unitValueAsLong(randomLong)
                .build();

        MatcherAssert.assertThat(actual.getCurrency(), equalTo(USD_CURRENCY));
        MatcherAssert.assertThat(actual.getUnitValue().longValueExact(), equalTo(randomLong));
    }

    @Test
    public void builder_currencyCode_test() {
        final long unitValue = 1;
        final CurrencyValue actual = CurrencyValue.builder()
                .currencyCode("USD")
                .unitValueAsLong(unitValue)
                .build();

        MatcherAssert.assertThat(actual.getCurrency(), equalTo(USD_CURRENCY));
        MatcherAssert.assertThat(actual.getUnitValue().longValueExact(), equalTo(unitValue));
    }

    @Test
    public void compareTo_test() {
        final CurrencyValue penny1 = USD_PENNY_VALUE;
        final CurrencyValue penny2 = USD_PENNY_VALUE;
        final CurrencyValue nickel = USD_NICKEL_VALUE;

        final int shouldBeZero = penny1.compareTo(penny2);
        final int shouldBeOne = nickel.compareTo(penny1);
        final int shouldBeNegativeOne = penny1.compareTo(nickel);

        MatcherAssert.assertThat(shouldBeZero, equalTo(0));
        MatcherAssert.assertThat(shouldBeOne, equalTo(1));
        MatcherAssert.assertThat(shouldBeNegativeOne, equalTo(- 1));
    }

    @Test(expected = CurrencyValue.CompareToNullRightValueException.class)
    public void compareTo_CompareToNullRightValueException_test() {
        final CurrencyValue penny = USD_PENNY_VALUE;
        penny.compareTo(null);
    }

    @Test(expected = CurrencyValue.CompareToDifferentCurrencyException.class)
    public void compareTo_CompareToDifferentCurrencyException_test() {
        final CurrencyValue usdPenny = USD_PENNY_VALUE;
        final CurrencyValue eurPenny = CurrencyValue.builder()
                .currency(EUR_CURRENCY)
                .unitValueAsLong(1)
                .build();
        usdPenny.compareTo(eurPenny);
    }
}
