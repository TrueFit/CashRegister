package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.apache.commons.collections4.SortedBag;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class PhysicalCurrencyConvertFewestTests {
    @Autowired
    private PhysicalConverterFewest physicalConverter;

    @Test
    public void convertToPhysicalCurrency_test() {
        CurrencyValue currencyValue = CurrencyValue.builder()
                .unitValueAsLong(18641)
                .currencyCode("USD")
                .build();

        for (int i = 0; i < 1_000; i++) {
            SortedBag<PhysicalCurrency> physicalCurrencyBag = this.physicalConverter.convertToPhysicalCurrency(currencyValue);
            CurrencyValue sum = CurrencySumUtils.sumPhysicalCurrency(physicalCurrencyBag);

            MatcherAssert.assertThat(physicalCurrencyBag, hasSize(10));
            MatcherAssert.assertThat(sum.getUnitValue(), equalTo(UnitValue.valueOf(18641)));
        }
    }
}
