package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Locale;

import static com.example.cash_register.CurrencyValueConstantsForTests.USD_PENNY_VALUE;
import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrencyValueToStringTests {
    @Test
    public void toString_test() {
        String actual = USD_PENNY_VALUE.toString();
        MatcherAssert.assertThat(actual, equalTo("$0.01 (USD)"));
    }

    @Test
    public void toStringWithLocale_test() {
        String actual = USD_PENNY_VALUE.toString(Locale.GERMANY);
        MatcherAssert.assertThat(actual, equalTo("0,01 $ (USD)"));
    }
}
