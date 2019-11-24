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
import static com.example.cash_register.PhysicalConstantsForTests.EUR_ONE_CENT_COIN_PHYSICAL;
import static com.example.cash_register.PhysicalConstantsForTests.USD_PENNY_PHYSICAL;
import static org.hamcrest.core.IsEqual.equalTo;

@SuppressWarnings("ConstantConditions")
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrencyValueHasSameCurrencyTests {
    @Test
    public void hasSameCurrency_currencyValue_test() {
        boolean shouldBeTrue1 = USD_PENNY_VALUE.hasSameCurrency(USD_NICKEL_VALUE);
        boolean shouldBeFalse1 = USD_PENNY_VALUE.hasSameCurrency((CurrencyValue) null);
        boolean shouldBeFalse2 = USD_PENNY_VALUE.hasSameCurrency(EUR_ONE_CENT_COIN_VALUE);

        MatcherAssert.assertThat(shouldBeTrue1, equalTo(true));
        MatcherAssert.assertThat(shouldBeFalse1, equalTo(false));
        MatcherAssert.assertThat(shouldBeFalse2, equalTo(false));
    }

    @Test
    public void hasSameCurrency_physicalCurrency_test() {
        boolean shouldBeTrue1 = USD_PENNY_VALUE.hasSameCurrency(USD_PENNY_PHYSICAL);
        boolean shouldBeFalse1 = USD_PENNY_VALUE.hasSameCurrency((PhysicalCurrency) null);
        boolean shouldBeFalse2 = USD_PENNY_VALUE.hasSameCurrency(EUR_ONE_CENT_COIN_PHYSICAL);

        MatcherAssert.assertThat(shouldBeTrue1, equalTo(true));
        MatcherAssert.assertThat(shouldBeFalse1, equalTo(false));
        MatcherAssert.assertThat(shouldBeFalse2, equalTo(false));
    }
}
