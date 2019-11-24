package com.example.repl.lib;

import com.example.cash_register.currency.CashRegisterProperties;
import com.example.cash_register.currency.ChangeCalculatorBase;
import com.example.cash_register.currency.CurrencyValue;
import lombok.AccessLevel;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Currency;
import java.util.Locale;

/**
 * Holds the state for the REPL application.
 */
@Component(ReplState.QUALIFIER)
class ReplState {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.repl.lib.ReplState";
    /**
     * See {@link CashRegisterProperties}
     *
     * @see CashRegisterProperties
     */
    private final CashRegisterProperties cashRegisterProperties;
    /**
     * See {@link ReplInputOutput}.
     */
    private final ReplInputOutput replInputOutput;
    /**
     * See {@link CalculatorUtils}
     */
    private final CalculatorUtils calculatorUtils;

    /**
     * The owed value.
     */
    @Getter(AccessLevel.PACKAGE)
    private CurrencyValue owed;
    /**
     * The tendered value.
     */
    @Getter(AccessLevel.PACKAGE)
    private CurrencyValue tendered;
    /**
     * The change calculator.
     */
    @Getter(AccessLevel.PACKAGE)
    private ChangeCalculatorBase changeCalculator;

    /**
     * Autowired constructor.
     *
     * @param cashRegisterProperties See {@link CashRegisterProperties}.
     * @param replInputOutput See {@link ReplInputOutput}.
     * @param calculatorUtils See {@link CalculatorUtils}.
     */
    @Autowired
    private ReplState(
            final CashRegisterProperties cashRegisterProperties,
            final ReplInputOutput replInputOutput,
            final CalculatorUtils calculatorUtils) {
        this.cashRegisterProperties = cashRegisterProperties;
        this.replInputOutput = replInputOutput;
        this.calculatorUtils = calculatorUtils;
        this.changeCalculator = calculatorUtils.getChangeCalculator(CalculatorUtils.CalculatorType.FEWEST);
    }

    /**
     * Get the input locale.
     *
     * @return The input locale.
     */
    Locale getInputLocale() {
        return this.cashRegisterProperties.getInputLocale();
    }

    /**
     * Gets the currency.
     *
     * @return The currency.
     */
    Currency getCurrency() {
        return this.cashRegisterProperties.getCurrency();
    }

    /**
     * Sets the currency.
     *
     * @param currency The currency.
     */
    void setCurrency(final Currency currency) {
        this.cashRegisterProperties.setCurrencyCode(currency.getCurrencyCode());

        final String message = String.format(
                " I: currency set to %s",
                this.cashRegisterProperties.getCurrency());
        this.replInputOutput.writeLine(message);
        this.replInputOutput.flush();
    }

    /**
     * Sets the input local language tag.
     *
     * @param languageTag The language tag.
     *
     * @see CashRegisterProperties#setInputLocaleLanguageTag(String)
     */
    void setInputLocaleLanguageTag(final String languageTag) {
        this.cashRegisterProperties.setInputLocaleLanguageTag(languageTag);

        final String message = String.format(
                " I: input locale set to %s",
                this.cashRegisterProperties.getInputLocale().toLanguageTag());
        this.replInputOutput.writeLine(message);
        this.replInputOutput.flush();
    }

    /**
     * Sets the output local language tag.
     *
     * @param languageTag The language tag.
     *
     * @see CashRegisterProperties#setOutputLocaleLanguageTag(String)
     */
    void setOutputLocaleLanguageTag(final String languageTag) {
        this.cashRegisterProperties.setOutputLocaleLanguageTag(languageTag);

        final String message = String.format(
                " I: output locale set to %s",
                this.cashRegisterProperties.getOutputLocale().toLanguageTag());
        this.replInputOutput.writeLine(message);
        this.replInputOutput.flush();
    }

    /**
     * Sets the owed value; the current input locale and currency will determine exactly how it is parsed.
     *
     * @param owedString The owed value string.
     *
     * @see CurrencyValue.CurrencyValueBuilder#currencyAndBigDecimalString(Currency, String, Locale)
     */
    void setOwed(final String owedString) {
        final CurrencyValue placeholder = CurrencyValue.builder()
                .currencyAndBigDecimalString(this.getCurrency(), owedString, this.getInputLocale())
                .build();
        this.owed = placeholder;

        final String message = String.format(
                " I: owed set to %s",
                placeholder.toString());
        this.replInputOutput.writeLine(message);
        this.replInputOutput.flush();
    }

    /**
     * Sets the tendered value; the current input locale and currency will determine exactly how it is parsed.
     *
     * @param tenderedString The tendered value string.
     *
     * @see CurrencyValue.CurrencyValueBuilder#currencyAndBigDecimalString(Currency, String, Locale)
     */
    void setTendered(final String tenderedString) {
        final CurrencyValue placeholder = CurrencyValue.builder()
                .currencyAndBigDecimalString(this.getCurrency(), tenderedString, this.getInputLocale())
                .build();
        this.tendered = placeholder;

        final String message = String.format(
                " I: tendered set to %s",
                placeholder.toString());
        this.replInputOutput.writeLine(message);
        this.replInputOutput.flush();
    }

    /**
     * Sets the change calculator.
     *
     * @param calculatorTypeString The calculator type as a string; this will be parsed into an instance of the {@link
     * CalculatorUtils.CalculatorType} enum, which is then used to set the calculator.
     */
    void setChangeCalculator(final String calculatorTypeString) {
        final CalculatorUtils.CalculatorType calculatorType = Enum.valueOf(CalculatorUtils.CalculatorType.class, calculatorTypeString);
        this.changeCalculator = this.calculatorUtils.getChangeCalculator(calculatorType);

        final String message = String.format(
                " I: change calculator set to %s",
                calculatorType);
        this.replInputOutput.writeLine(message);
        this.replInputOutput.flush();
    }
}
