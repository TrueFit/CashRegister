package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.apache.commons.lang3.StringUtils;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Locale;

import static com.example.cash_register.CurrencyConstantsForTests.USD_CURRENCY;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_NICKEL_VALUE;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrValBuilderCurrencyAndBigDecimalStringTests {
    @Test
    public void currencyAndBigDecimalString_test() {
        CurrencyValue currencyValue = CurrencyValue.builder()
                .currencyAndBigDecimalString(USD_CURRENCY, "0.05")
                .build();
        MatcherAssert.assertThat(currencyValue, notNullValue());
        MatcherAssert.assertThat(currencyValue, equalTo(USD_NICKEL_VALUE));
    }

    @Test(expected = CurrencyValue.CurrencyValueBuilder.CurrencyAndBigDecimalStringNullCurrencyException.class)
    public void currencyAndBigDecimalString_CurrencyAndBigDecimalStringNullCurrencyException_test() {
        CurrencyValue.builder().currencyAndBigDecimalString(null, "1.0", Locale.US);
    }

    @Test(expected = CurrencyValue.CurrencyValueBuilder.CurrencyAndBigDecimalStringBlankBigDecimalException.class)
    public void currencyAndBigDecimalString_CurrencyAndBigDecimalStringBlankBigDecimalException_null_test() {
        CurrencyValue.builder().currencyAndBigDecimalString(USD_CURRENCY, null, Locale.US);
    }

    @Test(expected = CurrencyValue.CurrencyValueBuilder.CurrencyAndBigDecimalStringBlankBigDecimalException.class)
    public void currencyAndBigDecimalString_CurrencyAndBigDecimalStringBlankBigDecimalException_empty_test() {
        CurrencyValue.builder().currencyAndBigDecimalString(USD_CURRENCY, StringUtils.EMPTY, Locale.US);
    }

    @Test(expected = CurrencyValue.CurrencyValueBuilder.CurrencyAndBigDecimalStringBlankBigDecimalException.class)
    public void currencyAndBigDecimalString_CurrencyAndBigDecimalStringBlankBigDecimalException_whitespace_test() {
        CurrencyValue.builder().currencyAndBigDecimalString(USD_CURRENCY, StringUtils.SPACE, Locale.US);
    }

    @Test(expected = CurrencyValue.CurrencyValueBuilder.CurrencyAndBigDecimalStringNullLocaleException.class)
    public void currencyAndBigDecimalString_CurrencyAndBigDecimalStringNullLocaleException_test() {
        CurrencyValue.builder().currencyAndBigDecimalString(USD_CURRENCY, "1.0", null);
    }
}
