package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigInteger;

import static com.example.cash_register.CurrencyValueConstantsForTests.EUR_ONE_CENT_COIN_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_PENNY_VALUE;
import static com.example.cash_register.PhysicalConstantsForTests.EUR_ONE_CENT_COIN_PHYSICAL;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrencyValueIsDivisibleByTests {
    @Test(expected = CurrencyValue.IsDivisibleByBigIntegerNullDivisorException.class)
    public void isDivisibleByBigInteger_IsDivisibleByBigIntegerNullDivisorException_test() {
        USD_PENNY_VALUE.isDivisibleBy((BigInteger) null);
    }

    @Test(expected = CurrencyValue.IsDivisibleByCurrencyValueNullDivisorException.class)
    public void isDivisibleByCurrencyValue_IsDivisibleByCurrencyValueNullDivisorException_test() {
        USD_PENNY_VALUE.isDivisibleBy((CurrencyValue) null);
    }

    @Test(expected = CurrencyValue.IsDivisibleByCurrencyValueDifferentCurrencyException.class)
    public void isDivisibleByCurrencyValue_IsDivisibleByCurrencyValueDifferentCurrencyException_test() {
        USD_PENNY_VALUE.isDivisibleBy(EUR_ONE_CENT_COIN_VALUE);
    }

    @Test(expected = CurrencyValue.IsDivisibleByPhysicalCurrencyNullDivisorException.class)
    public void isDivisibleByPhysicalCurrency_IsDivisibleByPhysicalCurrencyNullDivisorException_test() {
        USD_PENNY_VALUE.isDivisibleBy((PhysicalCurrency) null);
    }

    @Test(expected = CurrencyValue.IsDivisibleByPhysicalCurrencyDifferentCurrencyException.class)
    public void isDivisibleByPhysicalCurrency_IsDivisibleByPhysicalCurrencyDifferentCurrencyException_test() {
        USD_PENNY_VALUE.isDivisibleBy(EUR_ONE_CENT_COIN_PHYSICAL);
    }
}
