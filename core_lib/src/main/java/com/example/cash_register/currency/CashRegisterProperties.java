package com.example.cash_register.currency;

import com.example.cash_register.shared.properties.PropertiesUtils;
import org.apache.commons.text.TextStringBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Currency;
import java.util.Locale;
import java.util.Properties;

/**
 * A helper class which wraps processing for the {@code `cash_register.properties`} properties file.  This file contains
 * several configurable properties which may also be overridden via JVM System properties of the same name.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Component(CashRegisterProperties.QUALIFIER)
public final class CashRegisterProperties {
    /**
     * Spring qualifier.
     */
    public final static String QUALIFIER = "com.example.cash_register.currency.CashRegisterProperties";
    /**
     * The resource name for the {@code `cash_register.properties`} file.
     */
    public final static String PROPERTIES_RESOURCE_NAME = "/cash_register.properties";
    /**
     * The property name for the configured currency.
     *
     * @see #getCurrency()
     */
    public final static String CURRENCY_PROPERTY_NAME =
            "com.example.cash_register.currency.CashRegisterProperties.currency";
    /**
     * The property name for the output locale language tag.
     *
     * @see #getOutputLocale()
     */
    public final static String OUTPUT_LOCALE_LANGUAGE_TAG_PROPERTY_NAME =
            "com.example.cash_register.currency.CashRegisterProperties.outputLocale.languageTag";
    /**
     * The property name for the input locale language tag.
     *
     * @see #getInputLocale()
     */
    public final static String INPUT_LOCALE_LANGUAGE_TAG_PROPERTY_NAME =
            "com.example.cash_register.currency.CashRegisterProperties.inputLocale.languageTag";
    /**
     * Cash register properties file.
     *
     * @see CashRegisterPropertiesFile
     */
    private final CashRegisterPropertiesFile cashRegisterPropertiesFile;
    /**
     * Physical set map.
     *
     * @see PhysicalSetMap
     */
    private final PhysicalSetMap physicalSetMap;

    /**
     * Autowired constructor.
     *
     * @param cashRegisterPropertiesFile Cash register properties file.
     * @param physicalSetMap Physical set map.
     */
    @Autowired
    CashRegisterProperties(
            CashRegisterPropertiesFile cashRegisterPropertiesFile,
            PhysicalSetMap physicalSetMap) {
        this.cashRegisterPropertiesFile = cashRegisterPropertiesFile;
        this.physicalSetMap = physicalSetMap;
    }

    /**
     * Remove any JVM System Properties overrides for the properties available in the {@code `cash_register.properties`}
     * file.
     *
     * @see CashRegisterPropertiesFile#removeSystemPropertiesOverrides()
     */
    public final void removeSystemPropertiesOverrides() {
        this.cashRegisterPropertiesFile.removeSystemPropertiesOverrides();
    }

    /**
     * Gets the configured currency for this project.
     *
     * @return The configured currency for this project.
     *
     * @throws CurrencyInstanceNotAvailableException When the configured currency can not be returned from {@link
     * Currency#getInstance(String)}.
     * @throws PhysicalCurrencySetNotAvailableException If {@link PhysicalSetMap#checkRepresentation(Currency)}
     * exceptions, that exception will be the cause.
     * @see Currency#getInstance(String)
     * @see PhysicalSetMap#checkRepresentation(Currency)
     */
    public final Currency getCurrency() {
        Currency currency;
        try {
            currency = Currency.getInstance(this.cashRegisterPropertiesFile.getCurrencyValue());
        }
        catch (final Throwable throwable) {
            throw new CurrencyInstanceNotAvailableException(throwable);
        }

        try {
            this.physicalSetMap.checkRepresentation(currency);
        }
        catch (final Throwable throwable) {
            String message = new TextStringBuilder()
                    .append("the currency configured via properties is not present in the")
                    .append(" available physical currency sets for this lib.  check the resource properties file,")
                    .append(" any system property overrides, and physical currency sets configurations.")
                    .appendln(" currencies are ISO 4217 values.")
                    .appendNewLine()
                    .append("   configured currency => ").appendln(currency)
                    .append("   resource properties file => ").appendln(PROPERTIES_RESOURCE_NAME)
                    .append("   available physical currency sets => ").appendln(this.physicalSetMap.keySet())
                    .build();
            throw new PhysicalCurrencySetNotAvailableException(message, throwable);
        }

        return currency;
    }

    /**
     * Sets the configured currency.
     *
     * @param currencyCode The ISO 4217 currency code, per {@link Currency}
     *
     * @return The results of {@link #getCurrency()}, after the provided currency code has been configured.
     *
     * @see #getCurrency()
     */
    public final Currency setCurrencyCode(final String currencyCode) {
        final String originalCurrencyCode = this.cashRegisterPropertiesFile.getCurrencyValue();
        this.cashRegisterPropertiesFile.setCurrencyValue(currencyCode);
        try {
            return this.getCurrency();
        }
        catch (final Throwable throwable) {
            this.cashRegisterPropertiesFile.setCurrencyValue(originalCurrencyCode);
            throw throwable;
        }
    }

    /**
     * The configured input locale for this project.
     *
     * @return The configured input locale for this project.
     *
     * @throws InputLocaleSetLanguageTagException If {@link #buildLocale(String)} fails.
     * @see #buildLocale(String)
     */
    public final Locale getInputLocale() {
        try {
            final String languageTag = this.cashRegisterPropertiesFile.getInputLocaleLanguageTagValue();
            return this.buildLocale(languageTag);
        }
        catch (final Throwable throwable) {
            throw new InputLocaleSetLanguageTagException(throwable);
        }
    }

    /**
     * Sets the configured input locale for this project.
     *
     * @param languageTag The IETF BCP 47 language tag. {@code https://en.wikipedia.org/wiki/IETF_language_tag}
     *
     * @return The results of {@link #getInputLocale()}, after the provided input language tag has been configured.
     *
     * @see #buildLocale(String)
     */
    public final Locale setInputLocaleLanguageTag(final String languageTag) {
        final String originalInputLocale = this.cashRegisterPropertiesFile.getInputLocaleLanguageTagValue();
        this.cashRegisterPropertiesFile.setInputLocaleLanguageTagValue(languageTag);
        try {
            return this.getInputLocale();
        }
        catch (final Throwable throwable) {
            this.cashRegisterPropertiesFile.setInputLocaleLanguageTagValue(originalInputLocale);
            throw throwable;
        }
    }

    /**
     * Per {@link #getInputLocale()}, but for output locale.
     *
     * @return The configured output locale for this project.
     *
     * @throws OutputLocaleSetLanguageTagException If {@link #buildLocale(String)} fails.
     * @see #getInputLocale()
     */
    public final Locale getOutputLocale() {
        try {
            final String languageTag = this.cashRegisterPropertiesFile.getOutputLocaleLanguageTagValue();
            return this.buildLocale(languageTag);
        }
        catch (final Throwable throwable) {
            throw new OutputLocaleSetLanguageTagException(throwable);
        }
    }

    /**
     * Per {@link #setInputLocaleLanguageTag(String)}, but for output locale.
     *
     * @param languageTag The IETF BCP 47 language tag, per {@code https://en.wikipedia.org/wiki/IETF_language_tag}
     *
     * @return The results of {@link #getOutputLocale()}, after the provided input language tag has been configured.
     *
     * @see #buildLocale(String)
     * @see #setInputLocaleLanguageTag(String)
     */
    public final Locale setOutputLocaleLanguageTag(final String languageTag) {
        final String originalOutputLocale = this.cashRegisterPropertiesFile.getOutputLocaleLanguageTagValue();
        this.cashRegisterPropertiesFile.setOutputLocaleLanguageTagValue(languageTag);
        try {
            return this.getOutputLocale();
        }
        catch (final Throwable throwable) {
            this.cashRegisterPropertiesFile.setOutputLocaleLanguageTagValue(originalOutputLocale);
            throw throwable;
        }
    }

    /**
     * Uses {@link Locale.Builder} to build a {@link Locale} object from the provide language tag.
     *
     * @param languageTag The IETF BCP 47 language tag, per {@link Locale.Builder#setLanguageTag(String)}.
     *
     * @return The built locale
     *
     * @see Locale.Builder#setLanguageTag(String)
     */
    private Locale buildLocale(String languageTag) {
        Locale.Builder builder = new Locale.Builder();
        builder.setLanguageTag(languageTag);
        Locale locale = builder.build();
        return locale;
    }

    /**
     * A helper class which handles getting, setting, and overriding the {@code String} properties available in the
     * {@code `cash_register.properties`} file, and the associated JVM system properties.
     */
    @Component(CashRegisterPropertiesFile.QUALIFIER)
    static class CashRegisterPropertiesFile {
        /**
         * Spring qualifier.
         */
        static final String QUALIFIER = "com.example.cash_register.currency.CashRegisterProperties.CashRegisterPropertiesFile";
        /**
         * Properties utils.
         *
         * @see PropertiesUtils
         */
        @Autowired
        private PropertiesUtils propertiesUtils;

        /**
         * Remove any JVM System Properties overrides for the properties available in the {@code
         * `cash_register.properties`} file.
         */
        void removeSystemPropertiesOverrides() {
            this.propertiesUtils.removeSystemPropertiesOverrides(PROPERTIES_RESOURCE_NAME);
        }

        /**
         * Creates and returns {@link Properties} from {@code `cash_register.properties`}.
         *
         * @return The {@link Properties} object.
         *
         * @see PropertiesUtils#getProperties(String)
         */
        private Properties getProperties() {
            return this.propertiesUtils.getProperties(PROPERTIES_RESOURCE_NAME);
        }

        /**
         * Gets the configured {@code String} currency code.
         *
         * @return The configure {@code String} currency code.
         */
        String getCurrencyValue() {
            return this.getProperties().getProperty(CURRENCY_PROPERTY_NAME);
        }

        /**
         * Sets the configured {@code String} currency code into the JVM System Properties.
         *
         * @param currencyCode The currency code to configure.
         */
        void setCurrencyValue(String currencyCode) {
            System.getProperties().setProperty(CURRENCY_PROPERTY_NAME, currencyCode);
        }

        /**
         * Gets the configured {@code String} input language tag.
         *
         * @return The configured {@code String} input language tag.
         */
        String getInputLocaleLanguageTagValue() {
            return this.getProperties().getProperty(INPUT_LOCALE_LANGUAGE_TAG_PROPERTY_NAME);
        }

        /**
         * Sets the configured {@code String} input language tag into the JVM System Properties.
         *
         * @param languageTag The input language tag to configure.
         */
        void setInputLocaleLanguageTagValue(String languageTag) {
            System.getProperties().setProperty(INPUT_LOCALE_LANGUAGE_TAG_PROPERTY_NAME, languageTag);
        }

        /**
         * Per {@link #getInputLocaleLanguageTagValue()}, but for output language tag.
         *
         * @return Per {@link #getInputLocaleLanguageTagValue()}, but for output language tag.
         */
        String getOutputLocaleLanguageTagValue() {
            return this.getProperties().getProperty(OUTPUT_LOCALE_LANGUAGE_TAG_PROPERTY_NAME);
        }

        /**
         * Per {@link #setInputLocaleLanguageTagValue(String)}, but for output language tag.
         *
         * @param languageTag Per {@link #setInputLocaleLanguageTagValue(String)}, but for output language tag.
         */
        void setOutputLocaleLanguageTagValue(String languageTag) {
            System.getProperties().setProperty(OUTPUT_LOCALE_LANGUAGE_TAG_PROPERTY_NAME, languageTag);
        }
    }

    /**
     * See {@link #getCurrency()}
     *
     * @see #getCurrency()
     */
    static final class PhysicalCurrencySetNotAvailableException extends CashRegisterException {
        PhysicalCurrencySetNotAvailableException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    /**
     * See {@link #getCurrency()}
     *
     * @see #getCurrency()
     */
    static final class CurrencyInstanceNotAvailableException extends CashRegisterException {
        CurrencyInstanceNotAvailableException(Throwable cause) {
            super("could not get instance of currency", cause);
        }
    }

    /**
     * See {@link #getInputLocale()}
     *
     * @see #getInputLocale()
     */
    static final class InputLocaleSetLanguageTagException extends CashRegisterException {
        InputLocaleSetLanguageTagException(Throwable cause) {
            super("could not set language tag for input locale", cause);
        }
    }

    /**
     * See {@link #getOutputLocale()}
     *
     * @see #getOutputLocale()
     */
    static final class OutputLocaleSetLanguageTagException extends CashRegisterException {
        OutputLocaleSetLanguageTagException(Throwable cause) {
            super("could not set language tag for output locale", cause);
        }
    }
}
