package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static com.example.cash_register.CurrencyValueConstantsForTests.USD_NICKEL_VALUE;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNot.not;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.hamcrest.core.IsNull.nullValue;
import static org.hamcrest.core.IsSame.sameInstance;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrencyValueCopyTests {
    @Test
    public void copyCurrencyValue_normalValue_test() {
        CurrencyValue actual = CurrencyValue.copy(USD_NICKEL_VALUE);

        MatcherAssert.assertThat(actual, notNullValue());
        MatcherAssert.assertThat(actual, not(sameInstance(USD_NICKEL_VALUE)));
        MatcherAssert.assertThat(actual, equalTo(USD_NICKEL_VALUE));
    }

    @SuppressWarnings("ConstantConditions")
    @Test
    public void copyCurrencyValue_nullValue_test() {
        CurrencyValue actual = CurrencyValue.copy(null);
        MatcherAssert.assertThat(actual, nullValue());
    }
}
