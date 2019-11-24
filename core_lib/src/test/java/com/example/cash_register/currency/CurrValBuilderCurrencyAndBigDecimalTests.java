package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;

import static com.example.cash_register.CurrencyConstantsForTests.USD_CURRENCY;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrValBuilderCurrencyAndBigDecimalTests {
    @Test(expected = UnitValue.NullCurrencyException.class)
    public void currencyAndBigDecimal_NullCurrencyException_test() {
        CurrencyValue.builder().currencyAndBigDecimal(null, BigDecimal.ONE);
    }

    @Test(expected = UnitValue.NullBigDecimalException.class)
    public void currencyAndBigDecimal_NullBigDecimalException_test() {
        CurrencyValue.builder().currencyAndBigDecimal(USD_CURRENCY, null);
    }

    @Test(expected = UnitValue.NegativeBigDecimalException.class)
    public void currencyAndBigDecimal_NegativeBigDecimalException_test() {
        CurrencyValue.builder().currencyAndBigDecimal(USD_CURRENCY, BigDecimal.ONE.negate());
    }
}
