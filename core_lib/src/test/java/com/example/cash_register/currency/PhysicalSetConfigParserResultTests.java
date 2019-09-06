package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static com.example.cash_register.CurrencyConstantsForTests.USD_CURRENCY;
import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class PhysicalSetConfigParserResultTests {
    @Test
    public void isJsonParseSuccessful_fromPhysicalSetConfigWithNull_test() {
        PhysicalSetConfigParserResult result = PhysicalSetConfigParserResult.fromPhysicalSetConfig(null);

        boolean actual = result.isJsonParseSuccessful();
        MatcherAssert.assertThat(actual, equalTo(false));
    }

    @Test
    public void isJsonParseSuccessful_fromPhysicalSetConfigWithNullCurrency_test() {
        PhysicalSetConfig config = new PhysicalSetConfig();
        config.setCurrency(null);

        PhysicalSetConfigParserResult result = PhysicalSetConfigParserResult.fromPhysicalSetConfig(config);

        boolean actual = result.isJsonParseSuccessful();
        MatcherAssert.assertThat(actual, equalTo(false));
    }

    @Test
    public void isPrimaryValidationSuccessful_fromPhysicalSetConfigWithZeroCurrencyValues_test() {
        PhysicalSetConfig config = new PhysicalSetConfig();
        config.setCurrency(USD_CURRENCY);
        PhysicalSetConfigParserResult result = PhysicalSetConfigParserResult.fromPhysicalSetConfig(config);

        boolean actual = result.isJsonParseSuccessful();
        MatcherAssert.assertThat(actual, equalTo(false));
    }

    @Test
    public void isDataValidationSuccessful_whenJsonValidationNotSuccessful_test() {
        PhysicalSetConfigParserResult result = PhysicalSetConfigParserResult.fromPhysicalSetConfig(null);
        result.doDataValidation();
        boolean actual = result.isDataValidationSuccessful();
        MatcherAssert.assertThat(actual, equalTo(false));
    }

    @Test(expected = PhysicalSetConfigParserResult.QueryPhysicalSetConfigNotPresentException.class)
    public void queryPhysicalSetConfig_QueryPhysicalSetConfigNotPresentException_test() {
        PhysicalSetConfigParserResult result = PhysicalSetConfigParserResult.fromPhysicalSetConfig(null);
        result.queryPhysicalSetConfig();
    }

    @Test(expected = PhysicalSetConfigParserResult.QueryCurrencyNotPresentException.class)
    public void queryCurrency_QueryCurrencyNotPresentException_test() {
        PhysicalSetConfigParserResult result = PhysicalSetConfigParserResult.fromPhysicalSetConfig(null);
        result.queryCurrency();
    }
}
