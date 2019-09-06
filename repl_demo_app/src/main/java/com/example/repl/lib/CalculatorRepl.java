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
     * REPL state.
     */
    private final ReplState replState;
    /**
     * Calculator utils.
     */
    private final CalculatorUtils calculatorUtils;

    /**
     * Autowired constructor
     *
     * @param calculatorUtils Calculator utils
     * @param replState REPL state
     */
    @Autowired
    protected CalculatorRepl(
            CalculatorUtils calculatorUtils,
            ReplState replState) {
        super();
        this.calculatorUtils = calculatorUtils;
        this.replState = replState;
    }

    /**
     * Implementation of {@link ReplBase#doReplImpl()} which processes calculators.
     */
    @Override
    protected void doReplImpl() {
        CalculatorUtils.CalculatorType[] calculatorTypeArray = CalculatorUtils.CalculatorType.values();
        this.write("Available calculators: ");
        this.writeLine(Arrays.toString(calculatorTypeArray));

        ChangeCalculatorBase currentCalculator = this.replState.getChangeCalculator();
        CalculatorUtils.CalculatorType calculatorType = this.calculatorUtils.getCalculatorType(currentCalculator);
        String message = String.format("Change calculator [current: %s] -> ", calculatorType);
        this.write(message);
        this.flush();

        String input = this.readLine();
        if (StringUtils.isBlank(input)) {
            return;
        }
        this.replState.setChangeCalculator(input);
    }
}
