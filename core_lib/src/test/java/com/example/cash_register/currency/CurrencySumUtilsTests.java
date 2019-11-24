package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;

import static com.example.cash_register.CurrencyValueConstantsForTests.EUR_ONE_CENT_COIN_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_NICKEL_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_PENNY_VALUE;
import static com.example.cash_register.PhysicalConstantsForTests.USD_NICKEL_PHYSICAL;
import static com.example.cash_register.PhysicalConstantsForTests.USD_PENNY_PHYSICAL;
import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CurrencySumUtilsTests {
    private static final CurrencyValue USD_SIX_CENTS_VALUE;

    static {
        USD_SIX_CENTS_VALUE = CurrencyValue.builder()
                .unitValueAsLong(6)
                .currencyCode("USD")
                .build();
    }

    @Test
    public void sumCurrencyValue_test() {
        Collection<CurrencyValue> currencyValueCollection = Arrays.asList(USD_PENNY_VALUE, USD_NICKEL_VALUE);
        CurrencyValue actual = CurrencySumUtils.sumCurrencyValue(currencyValueCollection);
        MatcherAssert.assertThat(actual, equalTo(USD_SIX_CENTS_VALUE));
    }

    @Test(expected = CurrencySumUtils.SumCurrencyValueNullCollectionException.class)
    public void sumCurrencyValue_SumCurrencyValueNullCollectionException_test() {
        CurrencySumUtils.sumCurrencyValue(null);
    }

    @Test(expected = CurrencySumUtils.SumCurrencyValueEmptyCollectionException.class)
    public void sumCurrencyValue_SumCurrencyValueEmptyCollectionException_test() {
        CurrencySumUtils.sumCurrencyValue(Collections.emptyList());
    }

    @Test(expected = CurrencySumUtils.CollectionElementsCurrencyMismatchException.class)
    public void sumCurrencyValue_CollectionElementsCurrencyMismatchException_test() {
        Collection<CurrencyValue> currencyValueCollection = Arrays.asList(USD_PENNY_VALUE, EUR_ONE_CENT_COIN_VALUE);
        CurrencySumUtils.sumCurrencyValue(currencyValueCollection);
    }

    @Test
    public void sumPhysicalCurrency_test() {
        Collection<PhysicalCurrency> physicalCurrencyCollection = Arrays.asList(USD_PENNY_PHYSICAL, USD_NICKEL_PHYSICAL);
        CurrencyValue actual = CurrencySumUtils.sumPhysicalCurrency(physicalCurrencyCollection);
        MatcherAssert.assertThat(actual, equalTo(USD_SIX_CENTS_VALUE));
    }

    @Test(expected = CurrencySumUtils.SumPhysicalCurrencyNullCollectionException.class)
    public void sumPhysicalCurrency_SumPhysicalCurrencyNullCollectionException_test() {
        CurrencySumUtils.sumPhysicalCurrency(null);
    }

    @Test(expected = CurrencySumUtils.SumPhysicalCurrencyEmptyCollectionException.class)
    public void sumPhysicalCurrency_SumPhysicalCurrencyEmptyCollectionException_test() {
        CurrencySumUtils.sumPhysicalCurrency(Collections.emptyList());
    }
}
