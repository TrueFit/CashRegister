package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Locale;

import static com.example.cash_register.PhysicalConstantsForTests.USD_NICKEL_PHYSICAL;
import static com.example.cash_register.PhysicalConstantsForTests.USD_PENNY_PHYSICAL;
import static org.hamcrest.core.IsEqual.equalTo;

@SuppressWarnings("UnnecessaryLocalVariable")
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class PhysicalCurrencyTests {
    @Test
    public void compareTo_test() {
        PhysicalCurrency penny1 = USD_PENNY_PHYSICAL;
        PhysicalCurrency penny2 = USD_PENNY_PHYSICAL;
        PhysicalCurrency nickel = USD_NICKEL_PHYSICAL;

        final int shouldBeZero = penny1.compareTo(penny2);
        final int shouldBeOne = penny1.compareTo(nickel);
        final int shouldBeNegativeOne = nickel.compareTo(penny1);

        MatcherAssert.assertThat(shouldBeZero, equalTo(0));
        MatcherAssert.assertThat(shouldBeOne, equalTo(1));
        MatcherAssert.assertThat(shouldBeNegativeOne, equalTo(- 1));
    }

    @Test
    public void toString_test() {
        String actual = USD_PENNY_PHYSICAL.toString();
        MatcherAssert.assertThat(actual, equalTo("penny [$0.01 (USD)]"));
    }

    @Test
    public void toString_withLocale_test() {
        String actual = USD_PENNY_PHYSICAL.toString(Locale.GERMANY);
        MatcherAssert.assertThat(actual, equalTo("penny [0,01 $ (USD)]"));
    }
}
