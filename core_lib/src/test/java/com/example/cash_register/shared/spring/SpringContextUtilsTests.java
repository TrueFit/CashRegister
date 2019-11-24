package com.example.cash_register.shared.spring;

import com.example.cash_register.TestConfig;
import com.example.cash_register.currency.PhysicalConverterBase;
import com.example.cash_register.currency.PhysicalConverterFewest;
import com.example.cash_register.currency.PhysicalConverterRandom;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.core.IsInstanceOf.instanceOf;
import static org.hamcrest.core.IsNull.notNullValue;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = TestConfig.class)
public class SpringContextUtilsTests {
    @Test
    public void getBean_withRequiredType_test() {
        PhysicalConverterBase fewest =
                SpringContextUtils.getBean(PhysicalConverterFewest.class);
        PhysicalConverterBase random =
                SpringContextUtils.getBean(PhysicalConverterRandom.class);

        MatcherAssert.assertThat(fewest, notNullValue());
        MatcherAssert.assertThat(fewest, instanceOf(PhysicalConverterFewest.class));
        MatcherAssert.assertThat(random, notNullValue());
        MatcherAssert.assertThat(random, instanceOf(PhysicalConverterRandom.class));
    }

    @Test
    public void getBean_withNameAndRequiredType_test() {
        PhysicalConverterBase fewest =
                SpringContextUtils.getBean(PhysicalConverterFewest.QUALIFIER, PhysicalConverterBase.class);
        PhysicalConverterBase random =
                SpringContextUtils.getBean(PhysicalConverterRandom.QUALIFIER, PhysicalConverterBase.class);

        MatcherAssert.assertThat(fewest, notNullValue());
        MatcherAssert.assertThat(fewest, instanceOf(PhysicalConverterFewest.class));
        MatcherAssert.assertThat(random, notNullValue());
        MatcherAssert.assertThat(random, instanceOf(PhysicalConverterRandom.class));
    }
}
