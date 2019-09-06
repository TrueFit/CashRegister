package com.example.cash_register.shared.properties;

import com.example.cash_register.TestConfig;
import com.example.cash_register.currency.CashRegisterProperties;
import org.hamcrest.MatcherAssert;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Properties;

import static com.example.cash_register.CurrencyConstantsForTests.EUR_CURRENCY;
import static com.example.cash_register.CurrencyConstantsForTests.USD_CURRENCY;
import static org.hamcrest.collection.IsMapContaining.hasKey;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class PropertiesUtilsTests {
    @Autowired
    private PropertiesUtils propertiesUtils;

    @Autowired
    private CashRegisterProperties cashRegisterProperties;

    @Test
    public void getProperties_test() {
        this.cashRegisterProperties.setCurrencyCode("EUR");
        Properties properties = this.propertiesUtils.getProperties("/cash_register.properties");
        MatcherAssert.assertThat(properties, notNullValue());
        MatcherAssert.assertThat(properties, hasKey(CashRegisterProperties.CURRENCY_PROPERTY_NAME));
        MatcherAssert.assertThat(this.cashRegisterProperties.getCurrency(), equalTo(EUR_CURRENCY));

        this.cashRegisterProperties.setCurrencyCode("USD");
        properties = this.propertiesUtils.getProperties("/cash_register.properties");
        MatcherAssert.assertThat(properties, notNullValue());
        MatcherAssert.assertThat(properties, hasKey(CashRegisterProperties.CURRENCY_PROPERTY_NAME));
        MatcherAssert.assertThat(this.cashRegisterProperties.getCurrency(), equalTo(USD_CURRENCY));
    }

    @Test(expected = PropertiesUtils.PropertiesLoadException.class)
    public void propertiesLoadWrapper_PropertiesLoadException_test() {
        this.propertiesUtils.propertiesLoadWrapper(null, null);
    }

    @After
    public void after() {
        this.cashRegisterProperties.removeSystemPropertiesOverrides();
    }
}
