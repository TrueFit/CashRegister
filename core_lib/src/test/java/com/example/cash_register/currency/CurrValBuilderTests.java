package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.concurrent.ThreadLocalRandom;

import static com.example.cash_register.CurrencyConstantsForTests.USD_CURRENCY;
import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrValBuilderTests {
    @Test
    public void unitValueAsLong_test() {
        final long randomLong = ThreadLocalRandom.current().nextLong(1, 100_000);

        final CurrencyValue actual = CurrencyValue.builder()
                .currency(USD_CURRENCY)
                .unitValueAsLong(randomLong)
                .build();

        MatcherAssert.assertThat(actual.getCurrency(), equalTo(USD_CURRENCY));
        MatcherAssert.assertThat(actual.getUnitValue().longValueExact(), equalTo(randomLong));
    }

    @Test
    public void currencyCode_test() {
        final long unitValue = 1;
        final CurrencyValue actual = CurrencyValue.builder()
                .currencyCode("USD")
                .unitValueAsLong(unitValue)
                .build();

        MatcherAssert.assertThat(actual.getCurrency(), equalTo(USD_CURRENCY));
        MatcherAssert.assertThat(actual.getUnitValue().longValueExact(), equalTo(unitValue));
    }
}
