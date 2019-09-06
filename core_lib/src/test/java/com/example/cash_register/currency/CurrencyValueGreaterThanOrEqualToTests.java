package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static com.example.cash_register.CurrencyValueConstantsForTests.USD_NICKEL_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_PENNY_VALUE;
import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrencyValueGreaterThanOrEqualToTests {
    @Test
    public void greaterThanOrEqualToCurrencyValue_test() {
        boolean shouldBeTrue1 = USD_NICKEL_VALUE.greaterThanOrEqualTo(USD_PENNY_VALUE);
        boolean shouldBeTrue2 = USD_PENNY_VALUE.greaterThanOrEqualTo(USD_PENNY_VALUE);
        boolean shouldBeFalse1 = USD_PENNY_VALUE.greaterThanOrEqualTo(USD_NICKEL_VALUE);

        MatcherAssert.assertThat(shouldBeTrue1, equalTo(true));
        MatcherAssert.assertThat(shouldBeTrue2, equalTo(true));
        MatcherAssert.assertThat(shouldBeFalse1, equalTo(false));
    }

    @Test(expected = CurrencyValue.GreaterThanOrEqualToCurrencyValueNullRightException.class)
    public void greaterThanOrEqualToCurrencyValue_GreaterThanOrEqualToCurrencyValueNullRightException_test() {
        USD_NICKEL_VALUE.greaterThanOrEqualTo((CurrencyValue) null);
    }

    @Test(expected = CurrencyValue.GreaterThanOrEqualToPhysicalCurrencyNullRightException.class)
    public void greaterThanOrEqualToCurrencyValue_GreaterThanOrEqualToPhysicalCurrencyNullRightException_test() {
        USD_NICKEL_VALUE.greaterThanOrEqualTo((PhysicalCurrency) null);
    }
}
