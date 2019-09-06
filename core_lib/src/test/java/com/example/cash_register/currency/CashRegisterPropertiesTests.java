package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.apache.commons.collections4.bag.HashBag;
import org.apache.commons.lang3.RandomStringUtils;
import org.hamcrest.MatcherAssert;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.Currency;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CashRegisterPropertiesTests {
    @Autowired
    private CashRegisterProperties cashRegisterProperties;
    @Autowired
    private CashRegisterProperties.CashRegisterPropertiesFile cashRegisterPropertiesFile;
    private String badLanguageTag;

    @After
    public void after() {
        this.cashRegisterPropertiesFile.removeSystemPropertiesOverrides();
    }

    @Test
    public void getCurrency_test() {
        final Currency currency = this.cashRegisterProperties.getCurrency();
        MatcherAssert.assertThat(currency, notNullValue());
    }

    @Test(expected = CashRegisterProperties.PhysicalCurrencySetNotAvailableException.class)
    public void getCurrency_PhysicalCurrencySetNotAvailable_test() {
        System.setProperty(CashRegisterProperties.CURRENCY_PROPERTY_NAME, CurrencyConstants.INVALID_CURRENCY.toString());
        this.cashRegisterProperties.getCurrency();
    }

    @Test(expected = CashRegisterProperties.CurrencyInstanceNotAvailableException.class)
    public void getCurrency_CurrencyInstanceNotAvailableException_test() {
        final String badCurrencyCode = this.generateBadCurrencyCode();
        System.setProperty(CashRegisterProperties.CURRENCY_PROPERTY_NAME, badCurrencyCode);
        this.cashRegisterProperties.getCurrency();
    }

    @Test(expected = CashRegisterProperties.CurrencyInstanceNotAvailableException.class)
    public void setCurrencyCode_CurrencyInstanceNotAvailableException_test() {
        final String badCurrencyCode = this.generateBadCurrencyCode();
        final Currency beforeTestCurrency = this.cashRegisterProperties.getCurrency();
        final String beforeTestPropertyValue = this.cashRegisterPropertiesFile.getCurrencyValue();
        try {
            this.cashRegisterProperties.setCurrencyCode(badCurrencyCode);
        }
        catch (final CashRegisterProperties.CurrencyInstanceNotAvailableException exception) {
            final Currency afterExceptionCurrency = this.cashRegisterProperties.getCurrency();
            final String afterExceptionPropertyValue = this.cashRegisterPropertiesFile.getCurrencyValue();
            MatcherAssert.assertThat(beforeTestCurrency, equalTo(afterExceptionCurrency));
            MatcherAssert.assertThat(beforeTestPropertyValue, equalTo(afterExceptionPropertyValue));
            throw exception;
        }
    }

    private String generateBadCurrencyCode() {
        final Set<Currency> availableCurrencySet = Currency.getAvailableCurrencies();
        final HashBag<String> availableCurrencyStringBag = availableCurrencySet
                .parallelStream()
                .map(Currency::getCurrencyCode)
                .collect(Collectors.toCollection(HashBag::new));

        String badCurrencyCode = RandomStringUtils.randomAlphabetic(20);
        while (availableCurrencyStringBag.contains(badCurrencyCode)) {
            badCurrencyCode = RandomStringUtils.randomAlphabetic(20);
        }
        return badCurrencyCode;
    }

    @Test
    public void getOutputLocale_test() {
        final Locale locale = this.cashRegisterProperties.getOutputLocale();
        MatcherAssert.assertThat(locale, notNullValue());
    }

    @Test(expected = CashRegisterProperties.InputLocaleSetLanguageTagException.class)
    public void getInputLocale_InputLocaleSetLanguageTagException_test() {
        final String badLanguageTag = this.getBadLanguageTag();
        final Locale beforeTestInputLocale = this.cashRegisterProperties.getInputLocale();
        final String beforeTestPropertyValue = this.cashRegisterPropertiesFile.getInputLocaleLanguageTagValue();

        try {
            this.cashRegisterProperties.setInputLocaleLanguageTag(badLanguageTag);
        }
        catch (final CashRegisterProperties.InputLocaleSetLanguageTagException exception) {
            final Locale afterExceptionInputLocale = this.cashRegisterProperties.getInputLocale();
            final String afterExceptionPropertyValue = this.cashRegisterPropertiesFile.getInputLocaleLanguageTagValue();
            MatcherAssert.assertThat(beforeTestInputLocale, equalTo(afterExceptionInputLocale));
            MatcherAssert.assertThat(beforeTestPropertyValue, equalTo(afterExceptionPropertyValue));
            throw exception;
        }
    }

    @Test(expected = CashRegisterProperties.OutputLocaleSetLanguageTagException.class)
    public void getInputLocale_OutputLocaleSetLanguageTagException_test() {
        final String badLanguageTag = this.getBadLanguageTag();
        final Locale beforeTestOutputLocale = this.cashRegisterProperties.getOutputLocale();
        final String beforeTestPropertyValue = this.cashRegisterPropertiesFile.getOutputLocaleLanguageTagValue();

        try {
            this.cashRegisterProperties.setOutputLocaleLanguageTag(badLanguageTag);
        }
        catch (final CashRegisterProperties.OutputLocaleSetLanguageTagException exception) {
            final Locale afterExceptionOutputLocale = this.cashRegisterProperties.getOutputLocale();
            final String afterExceptionPropertyValue = this.cashRegisterPropertiesFile.getOutputLocaleLanguageTagValue();
            MatcherAssert.assertThat(beforeTestOutputLocale, equalTo(afterExceptionOutputLocale));
            MatcherAssert.assertThat(beforeTestPropertyValue, equalTo(afterExceptionPropertyValue));
            throw exception;
        }
    }

    private String getBadLanguageTag() {
        if (this.badLanguageTag == null) {
            final HashBag<String> availableLanguageTagBag = Arrays.stream(Locale.getAvailableLocales())
                    .parallel()
                    .map(Locale::toLanguageTag)
                    .collect(Collectors.toCollection(HashBag::new));

            this.badLanguageTag = RandomStringUtils.randomAlphabetic(30);
            while (availableLanguageTagBag.contains(this.badLanguageTag)) {
                this.badLanguageTag = RandomStringUtils.randomAlphabetic(30);
            }
        }
        return this.badLanguageTag;
    }

    @Test
    public void setCurrency_test() {
        final String currencyCode1 = "USD";
        final String currencyCode2 = "EUR";
        final Currency expected1 = Currency.getInstance(currencyCode1);
        final Currency expected2 = Currency.getInstance(currencyCode2);
        final Currency actual1 = this.cashRegisterProperties.setCurrencyCode(currencyCode1);
        final Currency actual2 = this.cashRegisterProperties.setCurrencyCode(currencyCode2);
        MatcherAssert.assertThat(actual1, equalTo(expected1));
        MatcherAssert.assertThat(actual2, equalTo(expected2));
    }

    @Test
    public void setInputLocale_test() {
        final String tag1 = "en-US";
        final String tag2 = "he-IL-u-ca-hebrew-tz-jeruslm";
        final Locale expected1 = Locale.forLanguageTag(tag1);
        final Locale expected2 = Locale.forLanguageTag(tag2);
        final Locale actual1 = this.cashRegisterProperties.setInputLocaleLanguageTag(tag1);
        final Locale actual2 = this.cashRegisterProperties.setInputLocaleLanguageTag(tag2);
        MatcherAssert.assertThat(actual1, equalTo(expected1));
        MatcherAssert.assertThat(actual2, equalTo(expected2));
    }

    @Test
    public void setOutputLocale_test() {
        final String tag1 = "en-US";
        final String tag2 = "he-IL-u-ca-hebrew-tz-jeruslm";
        final Locale expected1 = Locale.forLanguageTag(tag1);
        final Locale expected2 = Locale.forLanguageTag(tag2);
        final Locale actual1 = this.cashRegisterProperties.setOutputLocaleLanguageTag(tag1);
        final Locale actual2 = this.cashRegisterProperties.setOutputLocaleLanguageTag(tag2);
        MatcherAssert.assertThat(actual1, equalTo(expected1));
        MatcherAssert.assertThat(actual2, equalTo(expected2));
    }
}
