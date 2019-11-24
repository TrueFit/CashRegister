package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import com.example.cash_register.shared.math.BigDecimalUtils;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Locale;

import static com.example.cash_register.CurrencyConstantsForTests.USD_CURRENCY;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;

@SuppressWarnings("ResultOfMethodCallIgnored")
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class UnitValueTests {
    @Test(expected = UnitValue.NullCurrencyException.class)
    public void valueOf_NullCurrencyException_test() {
        UnitValue.valueOf(null, BigDecimal.ONE);
    }

    @Test(expected = UnitValue.NullBigDecimalException.class)
    public void valueOf_NullBigDecimalException_test() {
        UnitValue.valueOf(USD_CURRENCY, (BigDecimal) null);
    }

    @Test(expected = UnitValue.NegativeBigDecimalException.class)
    public void valueOf_NegativeBigDecimalException_test() {
        UnitValue.valueOf(USD_CURRENCY, BigDecimal.ONE.negate());
    }

    @Test(expected = UnitValue.ValueOfBigIntegerNegativeException.class)
    public void valueOf_ValueOfBigIntegerNegativeException_test() {
        UnitValue.valueOf(BigInteger.ONE.negate());
    }

    @Test(expected = UnitValue.ValueOfBigIntegerNullException.class)
    public void valueOf_ValueOfBigIntegerNullException_test() {
        UnitValue.valueOf(null);
    }

    @Test(expected = UnitValue.FractionalPartRemainsDuringUnitValueConversionException.class)
    public void valueOf_FractionalPartRemainsDuringUnitValueConversionException_test() {
        UnitValue.valueOf(USD_CURRENCY, new BigDecimal("12.345"));
    }

    @Test
    public void isNonPositive_test() {
        boolean shouldBeTrue1 = UnitValue.valueOf(0).isNonPositive();
        boolean shouldBeFalse1 = UnitValue.valueOf(1).isNonPositive();

        MatcherAssert.assertThat(shouldBeTrue1, equalTo(true));
        MatcherAssert.assertThat(shouldBeFalse1, equalTo(false));
    }

    @Test
    public void valueOf_usdWithTwoDecimalPlaces_test() {
        UnitValue unitValue = UnitValue.valueOf(USD_CURRENCY, new BigDecimal("20.05"));

        MatcherAssert.assertThat(unitValue, notNullValue());
        MatcherAssert.assertThat(unitValue, equalTo(new BigInteger("2005")));
    }

    @Test
    public void valueOf_usdWithTwoDecimalPlacesWithTrailingZeroes_test() {
        UnitValue unitValue = UnitValue.valueOf(USD_CURRENCY, new BigDecimal("20.05000"));

        MatcherAssert.assertThat(unitValue, notNullValue());
        MatcherAssert.assertThat(unitValue, equalTo(new BigInteger("2005")));
    }

    @Test
    public void valueOf_usdWithOneDecimalPlace_test() {
        UnitValue unitValue = UnitValue.valueOf(USD_CURRENCY, new BigDecimal("20.1"));

        MatcherAssert.assertThat(unitValue, notNullValue());
        MatcherAssert.assertThat(unitValue, equalTo(new BigInteger("2010")));
    }

    @Test
    public void valueOf_usdWithZeroDecimalPlaces_test() {
        UnitValue unitValue = UnitValue.valueOf(USD_CURRENCY, new BigDecimal("20"));

        MatcherAssert.assertThat(unitValue, notNullValue());
        MatcherAssert.assertThat(unitValue, equalTo(new BigInteger("2000")));
    }

    @Test
    public void valueOf_usdWithZeroDecimalPlacesWithTrailingZeroes_test() {
        UnitValue unitValue = UnitValue.valueOf(USD_CURRENCY, new BigDecimal("20.000000"));

        MatcherAssert.assertThat(unitValue, notNullValue());
        MatcherAssert.assertThat(unitValue, equalTo(new BigInteger("2000")));
    }

    @Test
    public void valueOf_usdWithZeroDecimalPlacesWithDecimalPointOnly_test() {
        UnitValue unitValue = UnitValue.valueOf(USD_CURRENCY, new BigDecimal("20."));

        MatcherAssert.assertThat(unitValue, notNullValue());
        MatcherAssert.assertThat(unitValue, equalTo(new BigInteger("2000")));
    }

    @Test
    public void valueOf_withCurrencyAndBigDecimalString_test() {
        final UnitValue unitValue1 = UnitValue.valueOf(USD_CURRENCY, "1234.56");
        final UnitValue unitValue2 = UnitValue.valueOf(USD_CURRENCY, "2345.67");

        MatcherAssert.assertThat(unitValue1, notNullValue());
        MatcherAssert.assertThat(unitValue1, equalTo(new BigInteger("123456")));
        MatcherAssert.assertThat(unitValue2, notNullValue());
        MatcherAssert.assertThat(unitValue2, equalTo(new BigInteger("234567")));
    }

    @Test(expected = BigDecimalUtils.ParseBigDecimalWithLocaleException.class)
    public void valueOf_ParseBigDecimalWithLocaleException_test() {
        UnitValue.valueOf(USD_CURRENCY, "This can not be converted to BigDecimal", Locale.US);
    }

    @Test(expected = UnitValue.NegativeLongValueException.class)
    public void valueOf_NegativeLongValueException_test() {
        UnitValue.valueOf(- 1);
    }
}
