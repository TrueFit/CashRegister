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
import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrencyValueSubtractTests {
    @Test
    public void subtractCurrencyValue_test() {
        CurrencyValue difference = USD_NICKEL_VALUE.subtract(USD_PENNY_VALUE);
        CurrencyValue expected = CurrencyValue.builder()
                .currency(USD_NICKEL_VALUE.getCurrency())
                .unitValueAsLong(4)
                .build();

        MatcherAssert.assertThat(difference, equalTo(expected));
    }

    @Test(expected = CurrencyValue.SubtractCurrencyValueNullSubtrahendException.class)
    public void subtractCurrencyValue_SubtractCurrencyValueNullSubtrahendException_test() {
        USD_NICKEL_VALUE.subtract((CurrencyValue) null);
    }

    @Test(expected = CurrencyValue.SubtractCurrencyValueDifferentCurrencyException.class)
    public void subtractCurrencyValue_SubtractCurrencyValueDifferentCurrencyException_test() {
        USD_NICKEL_VALUE.subtract(EUR_ONE_CENT_COIN_VALUE);
    }

    @Test(expected = CurrencyValue.SubtractPhysicalCurrencyNullSubtrahendException.class)
    public void subtractPhysicalCurrency_SubtractPhysicalCurrencyNullSubtrahendException_test() {
        USD_NICKEL_VALUE.subtract((PhysicalCurrency) null);
    }

    @Test(expected = CurrencyValue.SubtractPhysicalCurrencyDifferentCurrencyException.class)
    public void subtractPhysicalCurrency_SubtractPhysicalCurrencyDifferentCurrencyException_test() {
        USD_NICKEL_VALUE.subtract(EUR_ONE_CENT_COIN_PHYSICAL);
    }
}
