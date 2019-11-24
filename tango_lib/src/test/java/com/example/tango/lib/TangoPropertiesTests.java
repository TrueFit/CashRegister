package com.example.tango.lib;

import com.example.cash_register.shared.io.FilesWrapper;
import org.hamcrest.MatcherAssert;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigInteger;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = TestConfig.class)
public class TangoPropertiesTests {
    @Autowired
    private TangoProperties tangoProperties;

    @Autowired
    private FilesWrapper filesWrapper;

    @After
    public void after() {
        this.tangoProperties.removeSystemPropertiesOverrides();
    }

    @Test
    public void getRandomChangeDivisor_test() {
        BigInteger bigInteger = this.tangoProperties.getRandomChangeDivisor();
        MatcherAssert.assertThat(bigInteger, notNullValue());
    }

    @Test(expected = TangoProperties.RandomChangeDivisorNonPositiveException.class)
    public void setRandomChangeDivisor_RandomChangeDivisorNonPositiveException_test() {
        this.tangoProperties.setRandomChangeDivisor(- 1);
    }

    @Test
    public void setRandomChangeDivisor_test() {
        BigInteger expected = BigInteger.valueOf(10);
        BigInteger actual = this.tangoProperties.setRandomChangeDivisor(10);
        MatcherAssert.assertThat(actual, equalTo(expected));
    }
}
