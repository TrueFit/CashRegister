package com.example.repl.lib;

import com.example.cash_register.currency.CashRegisterProperties;
import com.example.cash_register.currency.ChangeCalculatorBase;
import com.example.cash_register.currency.CurrencyValue;
import com.example.cash_register.shared.io.WriterWrapper;
import lombok.AccessLevel;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.BufferedWriter;
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
     * The cash register properties.
     *
     * @see CashRegisterProperties
     */
    private final CashRegisterProperties cashRegisterProperties;
    /**
     * The output writer.
     */
    private final BufferedWriter outputWriter;
    /**
     * The buffered writer wrapper.
     */
    private final WriterWrapper writerWrapper;
    /**
     * The calculator utils.
     */
    private final CalculatorUtils calculatorUtils;

    /**
     * The currency.
     */
    @Getter(AccessLevel.PACKAGE)
    private Currency currency;
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
     * @param cashRegisterProperties Cash register properties.
     * @param outputWriter Output writer.
     * @param writerWrapper Buffered writer wrapper.
     * @param calculatorUtils Calculator utils.
     */
    @Autowired
    private ReplState(
            CashRegisterProperties cashRegisterProperties,
            BufferedWriter outputWriter,
            WriterWrapper writerWrapper,
            CalculatorUtils calculatorUtils) {
        this.cashRegisterProperties = cashRegisterProperties;
        this.outputWriter = outputWriter;
        this.writerWrapper = writerWrapper;
        this.calculatorUtils = calculatorUtils;
        this.currency = this.cashRegisterProperties.getCurrency();
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
     * Sets the currency.
     *
     * @param currency The currency.
     */
    void setCurrency(Currency currency) {
        this.currency = currency;

        String message = String.format(
                " I: currency set to %s",
                this.currency);
        this.writerWrapper.writeLine(this.outputWriter, message);
        this.writerWrapper.flush(this.outputWriter);
    }

    /**
     * Sets the input local language tag.
     *
     * @param languageTag The language tag.
     *
     * @see CashRegisterProperties#setInputLocaleLanguageTag(String)
     */
    void setInputLocaleLanguageTag(String languageTag) {
        this.cashRegisterProperties.setInputLocaleLanguageTag(languageTag);

        String message = String.format(
                " I: input locale set to %s",
                this.cashRegisterProperties.getInputLocale().toLanguageTag());
        this.writerWrapper.writeLine(this.outputWriter, message);
        this.writerWrapper.flush(this.outputWriter);
    }

    /**
     * Sets the output local language tag.
     *
     * @param languageTag The language tag.
     *
     * @see CashRegisterProperties#setOutputLocaleLanguageTag(String)
     */
    void setOutputLocaleLanguageTag(String languageTag) {
        this.cashRegisterProperties.setOutputLocaleLanguageTag(languageTag);

        String message = String.format(
                " I: output locale set to %s",
                this.cashRegisterProperties.getOutputLocale().toLanguageTag());
        this.writerWrapper.writeLine(this.outputWriter, message);
        this.writerWrapper.flush(this.outputWriter);
    }

    /**
     * Sets the owed value; the current input locale and currency will determine exactly how it is parsed.
     *
     * @param owedString The owed value string.
     *
     * @see CurrencyValue.CurrencyValueBuilder#currencyAndBigDecimalString(Currency, String, Locale)
     */
    void setOwed(String owedString) {
        CurrencyValue placeholder = CurrencyValue.builder()
                .currencyAndBigDecimalString(this.currency, owedString, this.cashRegisterProperties.getInputLocale())
                .build();
        this.owed = placeholder;

        String message = String.format(
                " I: owed set to %s",
                placeholder.toString());
        this.writerWrapper.writeLine(this.outputWriter, message);
        this.writerWrapper.flush(this.outputWriter);
    }

    /**
     * Sets the tendered value; the current input locale and currency will determine exactly how it is parsed.
     *
     * @param tenderedString The tendered value string.
     *
     * @see CurrencyValue.CurrencyValueBuilder#currencyAndBigDecimalString(Currency, String, Locale)
     */
    void setTendered(String tenderedString) {
        CurrencyValue placeholder = CurrencyValue.builder()
                .currencyAndBigDecimalString(this.currency, tenderedString, this.cashRegisterProperties.getInputLocale())
                .build();
        this.tendered = placeholder;

        String message = String.format(
                " I: tendered set to %s",
                placeholder.toString());
        this.writerWrapper.writeLine(this.outputWriter, message);
        this.writerWrapper.flush(this.outputWriter);
    }

    /**
     * Sets the change calculator.
     *
     * @param calculatorTypeString The calculator type as a string; this will be parsed into an instance of the {@link
     * CalculatorUtils.CalculatorType} enum, which is then used to set the calculator.
     */
    void setChangeCalculator(String calculatorTypeString) {
        CalculatorUtils.CalculatorType calculatorType = Enum.valueOf(CalculatorUtils.CalculatorType.class, calculatorTypeString);
        this.changeCalculator = this.calculatorUtils.getChangeCalculator(calculatorType);

        String message = String.format(
                " I: change calculator set to %s",
                calculatorType);
        this.writerWrapper.writeLine(this.outputWriter, message);
        this.writerWrapper.flush(this.outputWriter);
    }
}
