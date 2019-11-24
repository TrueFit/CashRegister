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
public class CurrencyValueLessThanTests {
    @Test
    public void lessThanCurrencyValue_test() {
        boolean shouldBeTrue1 = USD_PENNY_VALUE.lessThan(USD_NICKEL_VALUE);
        boolean shouldBeFalse1 = USD_NICKEL_VALUE.lessThan(USD_PENNY_VALUE);
        boolean shouldBeFalse2 = USD_PENNY_VALUE.lessThan(USD_PENNY_VALUE);

        MatcherAssert.assertThat(shouldBeTrue1, equalTo(true));
        MatcherAssert.assertThat(shouldBeFalse1, equalTo(false));
        MatcherAssert.assertThat(shouldBeFalse2, equalTo(false));
    }

    @Test(expected = CurrencyValue.LessThanCurrencyValueNullRightException.class)
    public void lessThan_currencyValue_LessThanCurrencyValueNullRightException_test() {
        USD_NICKEL_VALUE.lessThan(null);
    }
}
