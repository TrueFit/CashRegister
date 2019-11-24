package com.example.repl.lib;

import com.example.cash_register.currency.ChangeCalculatorBase;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Implementation of {@link ReplBase} which processes calculators.
 */
@Component(CalculatorRepl.QUALIFIER)
class CalculatorRepl extends ReplBase {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.repl.lib.CalculatorRepl";

    /**
     * See {@link ReplState}
     */
    private final ReplState replState;
    /**
     * See {@link CalculatorUtils}
     */
    private final CalculatorUtils calculatorUtils;

    /**
     * Autowired constructor.
     *
     * @param calculatorUtils See {@link CalculatorUtils}.
     * @param replState See {@link ReplState}.
     */
    @Autowired
    protected CalculatorRepl(
            final CalculatorUtils calculatorUtils,
            final ReplState replState) {
        super();
        this.calculatorUtils = calculatorUtils;
        this.replState = replState;
    }

    /**
     * Implementation of {@link ReplBase#doReplImpl()} which processes calculators.
     */
    @Override
    protected void doReplImpl() {
        final CalculatorUtils.CalculatorType[] calculatorTypeArray = CalculatorUtils.CalculatorType.values();
        this.write("Available calculators: ");
        this.writeLine(Arrays.toString(calculatorTypeArray));

        final ChangeCalculatorBase currentCalculator = this.replState.getChangeCalculator();
        final CalculatorUtils.CalculatorType calculatorType = this.calculatorUtils.getCalculatorType(currentCalculator);
        final String message = String.format("Change calculator [current: %s] -> ", calculatorType);
        this.write(message);
        this.flush();

        final String input = this.readLine();
        if (StringUtils.isBlank(input)) {
            return;
        }
        this.replState.setChangeCalculator(input);
    }
}
