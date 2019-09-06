package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.SortedBag;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.util.ReflectionUtils;

import java.util.TreeSet;

import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class PhysicalConverterRandomTests {
    @Autowired
    private PhysicalConverterRandom physicalConverter;

    @Test
    public void convertToPhysicalCurrency_test() {
        final CurrencyValue currencyValue = CurrencyValue.builder()
                .unitValueAsLong(1997)
                .currencyCode("USD")
                .build();

        SortedBag<PhysicalCurrency> changeBag = this.physicalConverter.convertToPhysicalCurrency(currencyValue);
        boolean foundDifferentBag = false;
        while (! foundDifferentBag) {
            SortedBag<PhysicalCurrency> placeholder = this.physicalConverter.convertToPhysicalCurrency(currencyValue);
            foundDifferentBag = ! CollectionUtils.isEqualCollection(placeholder, changeBag);
        }

        for (int i = 0; i < 100_000; i++) {
            changeBag = this.physicalConverter.convertToPhysicalCurrency(currencyValue);
            CurrencyValue sum = CurrencySumUtils.sumPhysicalCurrency(changeBag);

            MatcherAssert.assertThat(sum.getUnitValue(), equalTo(UnitValue.valueOf(1997)));
        }
    }

    @Test(expected = PhysicalConverterRandom.PhysicalCurrencyDeque.GetRandomIsEmptyException.class)
    public void getRandom_GetRandomIsEmptyException_test() {
        PhysicalConverterRandom.PhysicalCurrencyDeque deque =
                PhysicalConverterRandom.PhysicalCurrencyDeque.create(new TreeSet<>());
        deque.getRandom();
    }
}
